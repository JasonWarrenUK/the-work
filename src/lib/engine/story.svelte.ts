import { Story } from 'inkjs';
import { processTags } from './tags';

// inkjs ErrorType values (not reliably exported from ESM bundle)
const INK_ERROR = 0;

interface StoryState {
	inkStory: Story | null;
	history: string[];
	tick: number;
}

let state: StoryState = $state({
	inkStory: null,
	history: [],
	tick: 0
});

export async function loadStory(jsonPath: string) {
	const response = await fetch(jsonPath);
	if (!response.ok) {
		throw new Error(`Failed to load story: ${response.status} ${response.statusText}`);
	}
	const json = await response.text();
	const ink = new Story(json);

	ink.onError = (message: string, type: number) => {
		if (type === INK_ERROR) {
			console.error(`Ink error: ${message}`);
		} else {
			console.warn(`Ink warning: ${message}`);
		}
	};

	// Bind external functions if they exist in the compiled story.
	// get_storylet is declared in patches/storylets.ink — only bind if
	// that patch was INCLUDEd when the story JSON was compiled.
	try {
		ink.BindExternalFunction('get_storylet', (index: number) => {
			console.warn(`get_storylet(${index}) called but storylets are not yet implemented`);
			return '';
		});
	} catch {
		// Function not declared in this build of the story — safe to ignore
	}

	state.inkStory = ink;
}

export const story = {
	/**
	 * Continue the story until we hit choices or the end.
	 * Returns accumulated paragraphs and available choices.
	 */
	continue(): { paragraphs: string[]; choices: Array<{ index: number; text: string }> } {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');

		const paragraphs: string[] = [];

		while (ink.canContinue) {
			const text = ink.Continue();
			if (!text) continue;

			const trimmed = text.trim();
			if (trimmed === '') continue;

			// Process tags for this line
			const tags = ink.currentTags ?? [];
			const { clear, mood } = processTags(tags);

			// Apply mood to body for atmospheric CSS
			if (mood && typeof document !== 'undefined') {
				document.body.dataset.mood = mood;
			}

			if (clear) {
				// #CLEAR means wipe everything before this line
				paragraphs.length = 0;
				state.history = [];
			}

			paragraphs.push(trimmed);
		}

		// Track history
		state.history.push(...paragraphs);

		const choices = ink.currentChoices.map((c) => ({
			index: c.index,
			text: c.text
		}));

		// Bump tick so reactive consumers (StatusBar, etc.) re-derive
		state.tick++;

		return { paragraphs, choices };
	},

	choose(index: number) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		ink.ChooseChoiceIndex(index);
	},

	get canContinue(): boolean {
		return state.inkStory?.canContinue ?? false;
	},

	get currentTags(): string[] {
		return state.inkStory?.currentTags ?? [];
	},

	/**
	 * Read a reactive tick that increments after each continue().
	 * Used by $derived consumers to re-evaluate ink variable reads.
	 */
	get tick(): number {
		return state.tick;
	},

	getVariable(name: string): unknown {
		return state.inkStory?.variablesState?.$(name);
	},

	setVariable(name: string, value: unknown) {
		if (state.inkStory?.variablesState) {
			state.inkStory.variablesState.$(name, value);
		}
	},

	/** Serialise ink state for saving */
	saveState(): string {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		return ink.state.toJson();
	},

	/** Restore ink state from saved JSON */
	loadState(json: string) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		ink.state.LoadJson(json);
	},

	/** Get the full ink Story instance for advanced use */
	get ink(): Story | null {
		return state.inkStory;
	}
};
