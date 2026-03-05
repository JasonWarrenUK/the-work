import { Story } from 'inkjs';
import { processTags } from './tags';

interface StoryState {
	inkStory: Story | null;
	history: string[];
}

let state: StoryState = $state({
	inkStory: null,
	history: []
});

export async function loadStory(jsonPath: string) {
	const response = await fetch(jsonPath);
	const json = await response.text();
	state.inkStory = new Story(json);
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
			const { clear } = processTags(tags);

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

	getVariable(name: string): unknown {
		return state.inkStory?.variablesState?.$(name);
	},

	setVariable(name: string, value: unknown) {
		if (state.inkStory?.variablesState) {
			state.inkStory.variablesState.$(name, value);
		}
	},

	/** Get the full ink Story instance for advanced use */
	get ink(): Story | null {
		return state.inkStory;
	}
};
