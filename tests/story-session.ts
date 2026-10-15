/**
 * Shared harness for tests that play the compiled story through the real
 * game bindings (idea-bridge.ts, storylets.ts) with the real inventory and
 * body state, no stubs.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { readFileSync } from 'node:fs';
import { vi } from 'vitest';
import { Story } from 'inkjs';
import { initGameSystems } from '../src/lib/game/init';
import { inventory } from '../src/lib/game/ideas.svelte';
import { body } from '../src/lib/game/body.svelte';

/** The compiled story, BOM stripped. Point STORY_JSON at another build to test it instead. */
export const STORY_JSON = readFileSync(process.env.STORY_JSON ?? 'static/The Work.json', 'utf8').replace(/^﻿/, '');

export interface Session {
	story: Story;
	errors: string[];
}

/** Start the gameplay loop at an hour with a fresh inventory and body. Ink errors are collected, never thrown. */
export function startAt(hour: number): Session {
	inventory.reset();
	body.reset();
	const errors: string[] = [];
	const story = new Story(STORY_JSON);
	story.onError = (message: string) => errors.push(message);
	initGameSystems(story);
	story.variablesState.$('TimeNumber', hour);
	story.variablesState.$('TimeScore', 210 - 10 * hour);
	story.ChoosePathString('d1_2000');
	return { story, errors };
}

/** A session at the first hour, run to the core action menu. */
export function atMenu(): Session {
	const session = startAt(1);
	run(session);
	return session;
}

/** The text of every choice currently on offer. */
export const texts = (session: Session): string[] => session.story.currentChoices.map((choice) => choice.text);

/** Choose the first option whose text contains the label. */
export function pick(session: Session, label: string): void {
	const index = texts(session).findIndex((text) => text.includes(label));
	if (index < 0) throw new Error(`No choice containing "${label}" in [${texts(session).join(' | ')}]`);
	session.story.ChooseChoiceIndex(index);
}

/** Continue until the next choice point or the end, returning the text produced. */
export const run = (session: Session): string => session.story.ContinueMaximally();

/** Run, then push through any interrupt beats and let any sensory event pass until the action menu is showing. */
export function settle(session: Session): string {
	let output = run(session);
	let beat = interruptChoice(session);
	while (beat) {
		pick(session, beat);
		output += run(session);
		beat = interruptChoice(session);
	}
	return output;
}

/** The choice that dismisses whichever between-action beat is showing, or '' at the action menu. */
function interruptChoice(session: Session): string {
	const labels = ['push through', 'let it pass'];
	return labels.find((label) => texts(session).some((text) => text.includes(label))) ?? '';
}

/** Make `fetch` return the compiled story so Nib's `loadStory()` can load it. Undo with `vi.unstubAllGlobals()`. */
export function stubStoryFetch(): void {
	vi.stubGlobal('fetch', async () => ({ ok: true, text: async () => STORY_JSON }));
}
