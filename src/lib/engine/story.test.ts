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

describe('story.continue() paragraph frames', () => {
	it('carries a #frame: tag onto the paragraph it sits on', async () => {
		// The Ink compiler rejects `|` inside a tag, so Ink source separates options with `;`
		await loadInk('A framed line. #frame: back.png:6, mid.png, fore.gif:1.5; height:0.2\nA plain line.\n-> END\n');

		const { paragraphs } = story.continue();

		expect(paragraphs[0].frame).toEqual({
			layers: [
				{ src: 'back.png', depth: 6 },
				{ src: 'mid.png', depth: 1 },
				{ src: 'fore.gif', depth: 1.5 }
			],
			height: 0.2
		});
		expect(paragraphs[0].classes).toEqual([]);
		expect(paragraphs[1].frame).toBeNull();
	});

	it('attaches a frame tag written on its own line to the paragraph below it', async () => {
		await loadInk('#frame: back.png:2, fore.png\nThe framed paragraph.\nA plain line.\n-> END\n');

		const { paragraphs } = story.continue();

		expect(paragraphs.map((p) => p.text)).toEqual(['The framed paragraph.', 'A plain line.']);
		expect(paragraphs[0].frame?.layers.map((l) => l.src)).toEqual(['back.png', 'fore.png']);
		expect(paragraphs[1].frame).toBeNull();
	});
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

		expect(paragraphs).toEqual([{ text: 'After.', classes: ['bold'], frame: null }]);
	});
});
