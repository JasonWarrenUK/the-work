/**
 * Integration test: the core action menu in the compiled story carries the
 * mood tags that Nib applies when a choice is chosen.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { describe, expect, it, vi } from 'vitest';
import { story, loadStory } from '../engine/story.svelte';
import { initGameSystems } from './init';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import { processTags } from '../engine/tags';
import { atMenu, stubStoryFetch } from '../../../tests/story-session';

describe('Nib applies a chosen choice mood', () => {
	it('sets the document mood when a tagged choice is chosen', async () => {
		const root = { dataset: {} as Record<string, string> };
		vi.stubGlobal('document', { documentElement: root });
		stubStoryFetch();
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
		const choice = atMenu().story.currentChoices.find((c) => c.text.includes(text));
		expect(choice, `no choice containing "${text}"`).toBeDefined();
		expect(processTags(choice?.tags ?? []).mood).toBe(mood);
	});

	it('keeps the tag out of the choice text', () => {
		const texts = atMenu().story.currentChoices.map((c) => c.text);
		expect(texts.some((t) => t.includes('#mood'))).toBe(false);
	});
});
