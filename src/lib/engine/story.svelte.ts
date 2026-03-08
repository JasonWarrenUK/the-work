/**
 * Ink Story Engine — generic runtime for Ink narratives in Svelte 5.
 *
 * This module is game-agnostic: it loads compiled Ink JSON, manages reactive
 * story state with Svelte 5 runes, and provides a clean API for continuing
 * the narrative, making choices, and reading/writing Ink variables.
 *
 * Game-specific logic (external function bindings, data registration, etc.)
 * is injected via the `onInit` callback passed to {@link loadStory}.
 *
 * @example
 * ```ts
 * import { story, loadStory } from '$lib/engine/story.svelte';
 * import { initGameSystems } from '$lib/game/init';
 *
 * await loadStory('/story.json', initGameSystems);
 * const { paragraphs, choices } = story.continue();
 * ```
 *
 * @module
 */

import { Story } from 'inkjs';
import { processTags } from './tags';

/** Re-export Story type so consumers can type their onInit callbacks. */
export type { Story };

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

/**
 * Load a compiled Ink JSON story and prepare the engine for playback.
 *
 * @param jsonPath - URL or path to the compiled Ink JSON file.
 * @param onInit - Optional callback invoked with the raw inkjs Story instance
 *   after it is created but before playback begins. Use this to register
 *   external functions, populate game data catalogs, or perform any other
 *   game-specific setup.
 */
export async function loadStory(jsonPath: string, onInit?: (ink: Story) => void) {
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

	// Let the game wire up its own external functions and data
	onInit?.(ink);

	state.inkStory = ink;
}

/**
 * Reactive story object — the primary API for interacting with the Ink narrative.
 *
 * All state is managed internally with Svelte 5 runes. UI components can read
 * `story.tick` inside `$derived()` to re-evaluate whenever the story advances.
 */
export const story = {
	/**
	 * Continue the story until we hit choices or the end.
	 * Processes Ink tags (CLEAR, mood, class) on each line.
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

			// Apply mood to html element for atmospheric CSS
			if (mood && typeof document !== 'undefined') {
				document.documentElement.dataset.mood = mood;
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

	/** Select a choice by its index to advance the narrative. */
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
			state.inkStory.variablesState.$(name, value as string | number);
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
