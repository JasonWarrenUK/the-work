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

// inkjs ErrorType values (not reliably exported from the ESM bundle).
// Verified against node_modules/inkjs/engine/Error.d.ts: Author = 0, Warning = 1, Error = 2.
const INK_WARNING = 1;

/** Most recent issues kept; older ones drop off (the console still has them all). */
const MAX_ISSUES = 200;

/** A problem the Ink runtime reported while the story ran. */
export interface StoryIssue {
	level: 'error' | 'warning';
	message: string;
}

/** A choice offered by the story, with the Ink tags attached to it. */
export interface StoryChoice {
	index: number;
	text: string;
	/** Raw Ink tags on the choice (e.g. `mood:textual`); empty when untagged. */
	tags: string[];
}

/** A paragraph of story text with the CSS classes its Ink tags asked for. */
export interface StoryParagraph {
	text: string;
	/** From `#class:<name>` and bare tags on the line; empty when untagged. */
	classes: string[];
}

/** Apply an atmospheric mood to the document root for mood-driven CSS. */
function applyMood(mood: string | null): void {
	if (mood && typeof document !== 'undefined') {
		document.documentElement.dataset.mood = mood;
	}
}

interface StoryState {
	inkStory: Story | null;
	history: string[];
	tick: number;
	issues: StoryIssue[];
}

let state: StoryState = $state({
	inkStory: null,
	history: [],
	tick: 0,
	issues: []
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
	let json = await response.text();
	// Strip UTF-8 BOM if present (inkjs compiler may emit one)
	if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
	const ink = new Story(json);

	// Author errors and runtime errors both count as errors; only Warning is a warning.
	ink.onError = (message: string, type: number) => {
		const level = type === INK_WARNING ? 'warning' : 'error';
		state.issues.push({ level, message });
		if (state.issues.length > MAX_ISSUES) {
			state.issues.splice(0, state.issues.length - MAX_ISSUES);
		}
		if (level === 'error') {
			console.error(`Ink error: ${message}`);
		} else {
			console.warn(`Ink warning: ${message}`);
		}
	};
	state.issues = [];

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
	 * Returns accumulated paragraphs (text plus CSS classes) and available
	 * choices, each with its tags.
	 */
	continue(): { paragraphs: StoryParagraph[]; choices: StoryChoice[] } {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');

		const paragraphs: StoryParagraph[] = [];

		while (ink.canContinue) {
			const text = ink.Continue();
			if (!text) continue;

			const trimmed = text.trim();
			if (trimmed === '') continue;

			// Process tags for this line
			const tags = ink.currentTags ?? [];
			const { clear, mood, classes } = processTags(tags);

			// Apply mood to html element for atmospheric CSS
			applyMood(mood);

			if (clear) {
				// #CLEAR means wipe everything before this line
				paragraphs.length = 0;
				state.history = [];
			}

			paragraphs.push({ text: trimmed, classes });
		}

		// Track history
		state.history.push(...paragraphs.map((p) => p.text));

		const choices = ink.currentChoices.map((c) => ({
			index: c.index,
			text: c.text,
			tags: c.tags ?? []
		}));

		// Bump tick so reactive consumers (StatusBar, etc.) re-derive
		state.tick++;

		return { paragraphs, choices };
	},

	/**
	 * Select a choice by its index to advance the narrative.
	 * A `#mood:<name>` tag on the choice is applied to the document root
	 * before the story advances.
	 */
	choose(index: number) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		const chosen = ink.currentChoices.find((c) => c.index === index);
		applyMood(processTags(chosen?.tags ?? []).mood);
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

	/**
	 * Errors and warnings the Ink runtime has reported since the story loaded
	 * (or since {@link clearIssues}). Reactive: read it inside `$derived()`.
	 */
	get issues(): readonly StoryIssue[] {
		return state.issues;
	},

	/** Forget every reported issue. */
	clearIssues() {
		state.issues = [];
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
