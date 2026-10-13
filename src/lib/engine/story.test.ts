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
	vi.restoreAllMocks();
});

describe('story.issues', () => {
	// inkjs ErrorType: Author = 0, Warning = 1, Error = 2 (engine/Error.d.ts)
	it('records runtime errors and warnings with the right level', async () => {
		await loadInk('Hello.\n-> END\n');
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		story.ink?.onError?.('author problem', 0);
		story.ink?.onError?.('a warning', 1);
		story.ink?.onError?.('a runtime error', 2);

		expect(story.issues).toEqual([
			{ level: 'error', message: 'author problem' },
			{ level: 'warning', message: 'a warning' },
			{ level: 'error', message: 'a runtime error' }
		]);
		expect(console.error).toHaveBeenCalledTimes(2);
		expect(console.warn).toHaveBeenCalledTimes(1);
	});

	it('records a runtime error inkjs reports as an error, not a warning', async () => {
		// A reversed RANDOM range is a runtime error (ErrorType.Error) that inkjs reports
		// through onError instead of throwing. The old INK_ERROR = 0 logged it as a warning.
		await loadInk('Before.\n~ temp r = RANDOM(5, 1)\nAfter.\n-> END\n');
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		expect(() => story.continue()).not.toThrow();

		expect(story.issues).toHaveLength(1);
		expect(story.issues[0].level).toBe('error');
		expect(story.issues[0].message).toMatch(/RANDOM/);
		expect(error).toHaveBeenCalledOnce();
		expect(warn).not.toHaveBeenCalled();
	});

	it('keeps only the most recent 200 issues', async () => {
		await loadInk('Hello.\n-> END\n');
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		for (let i = 1; i <= 250; i += 1) story.ink?.onError?.(`warning ${i}`, 1);

		expect(story.issues).toHaveLength(200);
		expect(story.issues[0].message).toBe('warning 51');
		expect(story.issues.at(-1)?.message).toBe('warning 250');
	});

	it('clears on clearIssues() and on a fresh load', async () => {
		await loadInk('Hello.\n-> END\n');
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		story.ink?.onError?.('stale', 1);
		expect(story.issues).toHaveLength(1);

		story.clearIssues();
		expect(story.issues).toEqual([]);

		story.ink?.onError?.('stale again', 1);
		await loadInk('Again.\n-> END\n');
		expect(story.issues).toEqual([]);
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
