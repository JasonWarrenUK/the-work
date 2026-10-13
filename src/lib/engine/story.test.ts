import { afterEach, describe, expect, it, vi } from 'vitest';
import { Compiler } from 'inkjs/compiler/Compiler';
import { story, loadStory } from './story.svelte';

/** Compile an inline Ink source and load it through the real engine. */
async function loadInk(source: string): Promise<void> {
	const json = new Compiler(source).Compile().ToJson();
	vi.stubGlobal('fetch', async () => ({ ok: true, text: async () => json }));
	await loadStory('inline.json');
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('story.variable()', () => {
	const COUNTER = 'VAR x = 1\nStart.\n* [bump]\n\t~ x = 2\n\tBumped.\n\t-> END\n';

	it('reads the current value and follows assignments the story makes', async () => {
		await loadInk(COUNTER);
		expect(story.variable('x')).toBe(1);

		story.continue();
		story.choose(0);
		story.continue();

		expect(story.variable('x')).toBe(2);
	});

	it('follows setVariable()', async () => {
		await loadInk(COUNTER);
		expect(story.variable('x')).toBe(1);

		story.setVariable('x', 5);

		expect(story.variable('x')).toBe(5);
	});

	it('re-reads observed variables after loadState()', async () => {
		await loadInk(COUNTER);
		expect(story.variable('x')).toBe(1);
		const snapshot = story.saveState();
		story.setVariable('x', 5);

		story.loadState(snapshot);

		expect(story.variable('x')).toBe(1);
	});

	it('reads an undeclared name as undefined without throwing', async () => {
		await loadInk(COUNTER);
		expect(() => story.variable('nope')).not.toThrow();
		expect(story.variable('nope')).toBeUndefined();
	});

	it('forgets observed values when a new story loads', async () => {
		await loadInk(COUNTER);
		expect(story.variable('x')).toBe(1);

		await loadInk('No variables here.\n-> END\n');

		expect(story.variable('x')).toBeUndefined();
	});

	it('no longer exposes a tick counter', () => {
		expect('tick' in story).toBe(false);
	});
});

describe('story.continue() paragraph classes', () => {
	it('carries #class: and bare tags onto the paragraph they sit on', async () => {
		await loadInk('A plain line.\nAn italic line. #class:italic\nA dim line. #class:dim #aside\n-> END\n');

		const { paragraphs } = story.continue();

		expect(paragraphs.map((p) => p.text)).toEqual(['A plain line.', 'An italic line.', 'A dim line.']);
		expect(paragraphs.map((p) => p.classes)).toEqual([[], ['italic'], ['dim', 'aside']]);
	});

	it('does not turn #CLEAR or #mood: into classes', async () => {
		await loadInk('Before.\nAfter. #CLEAR #mood:tense #class:bold\n-> END\n');

		const { paragraphs } = story.continue();

		expect(paragraphs).toEqual([{ text: 'After.', classes: ['bold'] }]);
	});
});
