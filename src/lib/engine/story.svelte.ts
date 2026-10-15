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
import { processTags, type AudioCommand, type FrameSpec } from './tags';
import type { AudioPlayer } from './audio';

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

/** A paragraph of story text with what its Ink tags asked for. */
export interface StoryParagraph {
	text: string;
	/** From `#class:<name>` and bare tags on the line; empty when untagged. */
	classes: string[];
	/** From a `#frame:` tag on the line; null when there is none. */
	frame: FrameSpec | null;
}

/** Re-read every observed variable, since loading or replaying state fires no observers. */
function refreshObservedVariables(ink: Story): void {
	for (const name of observedNames) {
		if (name in state.variables) state.variables[name] = ink.variablesState.$(name);
	}
}

/** The player audio tags drive; null until {@link story.setAudio} attaches one, and audio tags are then ignored. */
let audioPlayer: AudioPlayer | null = null;

/** Carry out a line's audio commands on the attached player, in order. */
function applyAudio(commands: AudioCommand[]): void {
	if (!audioPlayer) return;
	for (const command of commands) {
		switch (command.kind) {
			case 'play':
				audioPlayer.play(command.track, command.fadeIn === null ? {} : { fadeIn: command.fadeIn });
				break;
			case 'stop':
				audioPlayer.stop(command.track ?? undefined, command.fadeOut === null ? {} : { fadeOut: command.fadeOut });
				break;
			case 'pause':
				audioPlayer.pause(command.track);
				break;
			case 'resume':
				audioPlayer.resume(command.track);
				break;
			case 'volume':
				audioPlayer.setVolume(command.level);
				break;
		}
	}
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
	/** Indices of the choices made through {@link story.choose} since the story loaded or was last replayed. */
	choiceLog: number[];
	/** The random seed the story started with; null before a story is loaded. */
	seed: number | null;
	/** Latest value of every Ink variable a consumer has read through {@link story.variable}. */
	variables: Record<string, unknown>;
	issues: StoryIssue[];
}

let state: StoryState = $state({
	inkStory: null,
	history: [],
	choiceLog: [],
	seed: null,
	variables: {},
	issues: []
});

/** Names with an inkjs observer registered on the current story (or known undeclared). */
const observedNames = new Set<string>();

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
	state.seed = ink.state.storySeed;
	state.choiceLog = [];
	// Observers belonged to the old Story instance; the next variable() read re-registers on this one
	observedNames.clear();
	state.variables = {};
}

/**
 * Reactive story object — the primary API for interacting with the Ink narrative.
 *
 * All state is managed internally with Svelte 5 runes. UI components read Ink
 * variables through `story.variable(name)` inside `$derived()`; an inkjs
 * variable observer keeps each read value current as the story assigns it.
 */
export const story = {
	/**
	 * Continue the story until we hit choices or the end.
	 * Processes Ink tags (CLEAR, mood, class, frame) on each line.
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
			const { clear, mood, classes, frame, audio } = processTags(tags);

			// Apply mood to html element for atmospheric CSS
			applyMood(mood);
			applyAudio(audio);

			if (clear) {
				// #CLEAR means wipe everything before this line
				paragraphs.length = 0;
				state.history = [];
			}

			paragraphs.push({ text: trimmed, classes, frame });
		}

		// Track history
		state.history.push(...paragraphs.map((p) => p.text));

		const choices = ink.currentChoices.map((c) => ({
			index: c.index,
			text: c.text,
			tags: c.tags ?? []
		}));

		return { paragraphs, choices };
	},

	/**
	 * Select a choice by its index to advance the narrative.
	 * A `#mood:<name>` tag on the choice is applied to the document root,
	 * and its audio tags to the attached player, before the story advances.
	 */
	choose(index: number) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		const chosen = ink.currentChoices.find((c) => c.index === index);
		const { mood, audio } = processTags(chosen?.tags ?? []);
		applyMood(mood);
		applyAudio(audio);
		ink.ChooseChoiceIndex(index);
		state.choiceLog.push(index);
	},

	get canContinue(): boolean {
		return state.inkStory?.canContinue ?? false;
	},

	get currentTags(): string[] {
		return state.inkStory?.currentTags ?? [];
	},

	/**
	 * Read an Ink variable reactively. The first read of a name registers an
	 * inkjs variable observer, so a `$derived()` that calls this re-evaluates
	 * whenever the story assigns that variable. A name the story never
	 * declared reads as `undefined` and is not observed. Returns `undefined`
	 * before the story is loaded.
	 */
	variable(name: string): unknown {
		const ink = state.inkStory;
		if (ink && !observedNames.has(name)) {
			observedNames.add(name);
			try {
				ink.ObserveVariable(name, (_variableName: string, value: unknown) => {
					state.variables[name] = value;
				});
				state.variables[name] = ink.variablesState.$(name);
			} catch {
				// Not declared in this story: inkjs refuses to observe it
			}
		}
		return state.variables[name];
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

	/** Read an Ink variable once, without reactivity. */
	getVariable(name: string): unknown {
		return state.inkStory?.variablesState?.$(name);
	},

	setVariable(name: string, value: unknown) {
		if (state.inkStory?.variablesState) {
			state.inkStory.variablesState.$(name, value as string | number);
			if (observedNames.has(name)) state.variables[name] = value;
		}
	},

	/** Serialise ink state for saving */
	saveState(): string {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		return ink.state.toJson();
	},

	/**
	 * Restore ink state from saved JSON. Observed variables are re-read, since
	 * a load fires no observers, and {@link story.seed} is read back out of the
	 * loaded state.
	 *
	 * The choice log is replaced with `choices`: the log that was recorded
	 * alongside the state JSON (see {@link story.choiceLog}), so the record
	 * carries on from the restored point. Without it the log is emptied, since
	 * the choices that led to the loaded state are unknown and a log that
	 * started mid-run cannot {@link story.replay}.
	 */
	loadState(json: string, choices: readonly number[] = []) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		ink.state.LoadJson(json);
		state.seed = ink.state.storySeed;
		state.choiceLog = [...choices];
		refreshObservedVariables(ink);
	},

	/**
	 * The choices made through {@link story.choose} since the story loaded or
	 * was last replayed, as the indices `choose()` received. Pair it with
	 * {@link story.seed} to rebuild the exact story state through
	 * {@link story.replay}. Save it next to the state JSON and hand it back to
	 * {@link story.loadState}, which otherwise empties the log.
	 */
	get choiceLog(): readonly number[] {
		return [...state.choiceLog];
	},

	/** The random seed the current run started with; null before a story is loaded. */
	get seed(): number | null {
		return state.seed;
	},

	/**
	 * Rebuild a run silently: reset the story, restore the seed and re-make
	 * each choice in order without producing any passages. The story stops
	 * right after the last choice, so the next {@link story.continue} returns
	 * the passage that followed it, exactly as it would have live.
	 *
	 * Ink variables and the story's own state come back identical. State held
	 * outside Ink (anything a bound external function mutates) is mutated
	 * again as the choices replay, so the caller must reset it first.
	 *
	 * Passage history is cleared. Choices made with `ChoosePathString` or
	 * through the raw `ink` instance are not in the log and cannot replay.
	 *
	 * @param seed - The seed from {@link story.seed} when the run was recorded.
	 * @param choices - The log from {@link story.choiceLog}.
	 * @throws If a logged choice is not on offer at its step (the story changed
	 *   since the log was recorded). The story is left at the last step that
	 *   replayed, and `choiceLog` matches it.
	 */
	replay(seed: number, choices: readonly number[]) {
		const ink = state.inkStory;
		if (!ink) throw new Error('Story not loaded');
		ink.ResetState();
		ink.state.storySeed = seed;
		ink.state.previousRandom = 0;
		state.seed = seed;
		state.choiceLog = [];
		state.history = [];
		try {
			for (const [step, index] of choices.entries()) {
				ink.ContinueMaximally();
				if (!ink.currentChoices.some((choice) => choice.index === index)) {
					throw new Error(`Replay diverged at step ${step}: choice ${index} is not on offer`);
				}
				ink.ChooseChoiceIndex(index);
				state.choiceLog.push(index);
			}
		} finally {
			refreshObservedVariables(ink);
		}
	},

	/**
	 * Attach the player that `#play:`, `#stop`, `#pause:`, `#resume:` and
	 * `#volume:` tags drive, or detach it with null. Tags seen while no
	 * player is attached are dropped, not queued. Nothing here resets the
	 * player: {@link loadStory}, {@link story.loadState} and {@link story.replay}
	 * leave whatever is playing alone, and a replay's tags run through the
	 * player again like any other side effect, so detach first to replay
	 * silently.
	 */
	setAudio(player: AudioPlayer | null) {
		audioPlayer = player;
	},

	/** The attached audio player, or null. */
	get audio(): AudioPlayer | null {
		return audioPlayer;
	},

	/** Get the full ink Story instance for advanced use */
	get ink(): Story | null {
		return state.inkStory;
	}
};
