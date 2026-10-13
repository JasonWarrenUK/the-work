/**
 * Regression check: external functions still fire after a save is restored.
 *
 * Upstream inkjs issue #1082 reported externals possibly breaking after a
 * JSON state load. This project binds externals once in onInit, before any
 * loadState() call, so bindings live on the Story and survive a state swap.
 * These tests pin that down at both layers: raw inkjs (as the page does on a
 * reload) and the Nib `story` singleton.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Story } from 'inkjs';
import { initGameSystems } from './init';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import { story, loadStory } from '../engine/story.svelte';

const STORY_JSON = readFileSync(process.env.STORY_JSON ?? 'static/The Work.json', 'utf8').replace(/^﻿/, '');

interface Session {
	story: Story;
	errors: string[];
}

/** A bound story, started at the gameplay loop and run to the action menu. */
function atMenu(): Session {
	const errors: string[] = [];
	const ink = new Story(STORY_JSON);
	ink.onError = (message: string) => errors.push(message);
	initGameSystems(ink);
	ink.variablesState.$('TimeNumber', 1);
	ink.variablesState.$('TimeScore', 200);
	ink.ChoosePathString('d1_2000');
	ink.ContinueMaximally();
	return { story: ink, errors };
}

function pick(ink: Story, label: string): void {
	const index = ink.currentChoices.findIndex((choice) => choice.text.includes(label));
	if (index < 0) throw new Error(`No choice containing "${label}"`);
	ink.ChooseChoiceIndex(index);
}

/** "Attend to The Work" calls get_total_dread and body_level before offering choices. */
function attend(ink: Story): string {
	pick(ink, 'Attend to The Work');
	return ink.ContinueMaximally();
}

beforeEach(() => {
	inventory.reset();
	body.reset();
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('externals after LoadJson on the same story', () => {
	it('still reach the TypeScript side and raise no ink errors', () => {
		const session = atMenu();
		const snapshot = session.story.state.toJson();
		const dread = vi.spyOn(inventory, 'getTotalDread');
		const level = vi.spyOn(body, 'level');

		session.story.state.LoadJson(snapshot);
		expect(() => session.story.ValidateExternalBindings()).not.toThrow();
		attend(session.story);

		expect(session.errors).toEqual([]);
		expect(dread).toHaveBeenCalled();
		expect(level).toHaveBeenCalledWith('cramp');
		expect(session.story.currentChoices.map((c) => c.text)).toContain('Set pen to paper');
	});
});

describe('externals on a fresh story that restores a save', () => {
	it('fire after onInit binding then LoadJson, as a page reload does', () => {
		const source = atMenu();
		expect(source.errors).toEqual([]);
		const snapshot = source.story.state.toJson();

		const errors: string[] = [];
		const restored = new Story(STORY_JSON);
		restored.onError = (message: string) => errors.push(message);
		initGameSystems(restored);
		restored.state.LoadJson(snapshot);
		const dread = vi.spyOn(inventory, 'getTotalDread');

		expect(() => restored.ValidateExternalBindings()).not.toThrow();
		attend(restored);

		expect(errors).toEqual([]);
		expect(dread).toHaveBeenCalled();
	});
});

describe('externals through Nib after story.loadState()', () => {
	it('keep firing and log no ink error', async () => {
		vi.stubGlobal('fetch', async () => ({ ok: true, text: async () => STORY_JSON }));
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		await loadStory('inline.json', initGameSystems);
		story.setVariable('TimeNumber', 1);
		story.setVariable('TimeScore', 200);
		story.ink?.ChoosePathString('d1_2000');
		story.continue();
		const snapshot = story.saveState();
		const dread = vi.spyOn(inventory, 'getTotalDread');

		story.loadState(snapshot);
		const { choices } = story.continue();
		const attendChoice = choices.find((c) => c.text.includes('Attend to The Work'));
		expect(attendChoice).toBeDefined();
		story.choose(attendChoice?.index ?? -1);
		const result = story.continue();

		expect(consoleError).not.toHaveBeenCalled();
		expect(dread).toHaveBeenCalled();
		expect(result.choices.map((c) => c.text)).toContain('Set pen to paper');
	});
});
