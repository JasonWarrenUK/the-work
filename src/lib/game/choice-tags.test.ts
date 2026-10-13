/**
 * Integration test: the core action menu in the compiled story carries the
 * mood tags that Nib applies when a choice is chosen.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { Story } from 'inkjs';
import { story, loadStory } from '../engine/story.svelte';
import { initGameSystems } from './init';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import { processTags } from '../engine/tags';

const STORY_JSON = readFileSync(process.env.STORY_JSON ?? 'static/The Work.json', 'utf8').replace(/^﻿/, '');

function coreMenu(): Story {
	inventory.reset();
	body.reset();
	const story = new Story(STORY_JSON);
	initGameSystems(story);
	story.variablesState.$('TimeNumber', 1);
	story.variablesState.$('TimeScore', 200);
	story.ChoosePathString('d1_2000');
	story.ContinueMaximally();
	return story;
}

describe('Nib applies a chosen choice mood', () => {
	it('sets the document mood when a tagged choice is chosen', async () => {
		const root = { dataset: {} as Record<string, string> };
		vi.stubGlobal('document', { documentElement: root });
		vi.stubGlobal('fetch', async () => ({ ok: true, text: async () => STORY_JSON }));
		try {
			inventory.reset();
			body.reset();
			await loadStory('story.json', initGameSystems);
			story.setVariable('TimeNumber', 1);
			story.setVariable('TimeScore', 200);
			story.ink?.ChoosePathString('d1_2000');
			const { choices } = story.continue();
			const physical = choices.find((c) => c.text.includes('Consider'));
			expect(physical?.tags).toContain('mood:physical');
			story.choose(physical?.index ?? -1);
			expect(root.dataset.mood).toBe('physical');
		} finally {
			vi.unstubAllGlobals();
		}
	});
});

describe('core action menu choice tags', () => {
	it.each([
		['Attend to The Work', 'textual'],
		['Consider your circumstances', 'physical'],
		['Exercise the mind', 'mental']
	])('%s carries the %s mood', (text, mood) => {
		const choice = coreMenu().currentChoices.find((c) => c.text.includes(text));
		expect(choice, `no choice containing "${text}"`).toBeDefined();
		expect(processTags(choice?.tags ?? []).mood).toBe(mood);
	});

	it('keeps the tag out of the choice text', () => {
		const texts = coreMenu().currentChoices.map((c) => c.text);
		expect(texts.some((t) => t.includes('#mood'))).toBe(false);
	});
});
