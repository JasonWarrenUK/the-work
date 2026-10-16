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

describe('story.choiceLog and story.seed', () => {
	const BRANCHING = 'VAR roll = 0\nStart.\n* [left]\n\t~ roll = RANDOM(1, 1000000)\n\tLeft.\n\t* * [down]\n\t\t~ roll = roll + RANDOM(1, 1000000)\n\t\tDown.\n\t\t-> END\n\t* * [up]\n\t\tUp.\n\t\t-> END\n* [right]\n\tRight.\n\t-> END\n';

	it('records the index of each choice made and nothing else', async () => {
		await loadInk(BRANCHING);
		expect(story.choiceLog).toEqual([]);

		story.continue();
		story.choose(0);
		story.continue();
		story.choose(1);

		expect(story.choiceLog).toEqual([0, 1]);
	});

	it('exposes the seed the story started with and clears the log on a fresh load', async () => {
		await loadInk(BRANCHING);
		expect(typeof story.seed).toBe('number');
		story.continue();
		story.choose(0);

		await loadInk(BRANCHING);

		expect(story.choiceLog).toEqual([]);
	});

	it('hands out a copy, so a caller cannot rewrite the record', async () => {
		await loadInk(BRANCHING);
		story.continue();
		story.choose(0);

		(story.choiceLog as number[]).push(99);

		expect(story.choiceLog).toEqual([0]);
	});

	it('carries the saved log on through loadState() so the run can still replay', async () => {
		await loadInk(BRANCHING);
		story.continue();
		story.choose(0);
		const saved = { state: story.saveState(), seed: story.seed as number, log: [...story.choiceLog] };
		story.continue();
		story.choose(1);

		story.loadState(saved.state, saved.log);
		expect(story.choiceLog).toEqual([0]);
		expect(story.seed).toBe(saved.seed);
		story.continue();
		story.choose(0);
		const resumed = story.saveState();

		story.replay(saved.seed, story.choiceLog);

		expect(story.choiceLog).toEqual([0, 0]);
		expect(story.saveState()).toBe(resumed);
	});

	it('empties the log and reads the seed from the state when loadState() gets no log', async () => {
		await loadInk(BRANCHING);
		story.continue();
		story.choose(0);
		const snapshot = story.saveState();
		const seed = story.seed as number;

		// A different seed on purpose, so the assertion cannot pass by a chance match
		story.replay((seed + 1) % 100, []);
		story.continue();
		story.choose(1);
		story.loadState(snapshot);

		expect(story.choiceLog).toEqual([]);
		expect(story.seed).toBe(seed);
	});
});

describe('story.replay()', () => {
	const BRANCHING = 'VAR roll = 0\nStart.\n* [left]\n\t~ roll = RANDOM(1, 1000000)\n\tLeft.\n\t* * [down]\n\t\t~ roll = roll + RANDOM(1, 1000000)\n\t\tDown.\n\t\t-> END\n\t* * [up]\n\t\tUp.\n\t\t-> END\n* [right]\n\tRight.\n\t-> END\n';

	/** Play left then down, returning what a reload needs to rebuild the run. */
	function playLeftDown(): { seed: number; log: number[]; roll: unknown; saved: string } {
		story.continue();
		story.choose(0);
		story.continue();
		story.choose(0);
		return { seed: story.seed as number, log: [...story.choiceLog], roll: story.getVariable('roll'), saved: story.saveState() };
	}

	it('rebuilds the same state, random rolls included, from the seed and the log', async () => {
		await loadInk(BRANCHING);
		const run = playLeftDown();

		await loadInk(BRANCHING);
		story.replay(run.seed, run.log);

		expect(story.getVariable('roll')).toBe(run.roll);
		expect(story.saveState()).toBe(run.saved);
		expect(story.choiceLog).toEqual(run.log);
		expect(story.seed).toBe(run.seed);
	});

	it('rolls differently under a different seed', async () => {
		await loadInk(BRANCHING);
		const run = playLeftDown();

		story.replay((run.seed + 1) % 100, run.log);

		expect(story.getVariable('roll')).not.toBe(run.roll);
	});

	it('resumes at the passage after the last choice and starts history afresh', async () => {
		await loadInk(BRANCHING);
		const run = playLeftDown();
		expect(story.canContinue).toBe(true);

		story.replay(run.seed, run.log);
		const { paragraphs, choices } = story.continue();

		expect(paragraphs.map((p) => p.text)).toEqual(['Down.']);
		expect(choices).toEqual([]);
	});

	it('replays an empty log back to the opening passage', async () => {
		await loadInk(BRANCHING);
		playLeftDown();

		story.replay(story.seed as number, []);
		const { paragraphs, choices } = story.continue();

		expect(paragraphs.map((p) => p.text)).toEqual(['Start.']);
		expect(choices.map((c) => c.text)).toEqual(['left', 'right']);
	});

	it('refreshes an observed variable that the replay changed', async () => {
		await loadInk(BRANCHING);
		const run = playLeftDown();
		expect(story.variable('roll')).toBe(run.roll);

		story.replay(run.seed, [0]);

		expect(story.variable('roll')).toBe(story.getVariable('roll'));
		expect(story.variable('roll')).not.toBe(run.roll);
	});

	it('throws when a logged choice is not on offer, leaving the log at the last good step', async () => {
		await loadInk(BRANCHING);
		story.continue();

		expect(() => story.replay(story.seed as number, [0, 7])).toThrow(/step 1: choice 7 is not on offer/);
		expect(story.choiceLog).toEqual([0]);
	});
});

describe('audio tags', () => {
	/** A player that records what the story asked of it. */
	function recorder() {
		const calls: string[] = [];
		const player = {
			options: { basePath: '/audio', formats: ['ogg'], allowMultipleTracks: false, fadeIn: 2000, fadeOut: 2000, volume: 0.5 },
			tracks: [] as string[],
			play: (name: string, settings?: { fadeIn?: number }) => void calls.push(`play:${name}:${settings?.fadeIn ?? ''}`),
			stop: (name?: string, settings?: { fadeOut?: number }) => void calls.push(`stop:${name ?? '*'}:${settings?.fadeOut ?? ''}`),
			pause: (name: string) => void calls.push(`pause:${name}`),
			resume: (name: string) => void calls.push(`resume:${name}`),
			setVolume: (level: number) => void calls.push(`volume:${level}`),
			dispose: () => void calls.push('dispose')
		};
		return { player, calls };
	}

	afterEach(() => story.setAudio(null));

	it('drives the attached player from line tags, in story order', async () => {
		await loadInk('Rain starts. #play: rain\nQuieter. #volume: 0.2\nSilence. #stop: rain; fadeout: 100\n-> END\n');
		const { player, calls } = recorder();
		story.setAudio(player);

		const { paragraphs } = story.continue();

		expect(paragraphs.map((p) => p.text)).toEqual(['Rain starts.', 'Quieter.', 'Silence.']);
		expect(paragraphs.map((p) => p.classes)).toEqual([[], [], []]);
		expect(calls).toEqual(['play:rain:', 'volume:0.2', 'stop:rain:100']);
	});

	it('drives the player from a tag on the chosen choice, before the story advances', async () => {
		// A tag after `[...]` belongs to the content below the choice; on the choice itself it follows bare choice text
		await loadInk('Start.\n* Open the door #play: wind; fadein: 300\n\tWind.\n\t-> END\n');
		const { player, calls } = recorder();
		story.setAudio(player);
		story.continue();

		story.choose(0);

		expect(calls).toEqual(['play:wind:300']);
	});

	it('ignores audio tags when no player is attached', async () => {
		await loadInk('Rain starts. #play: rain\n-> END\n');
		expect(() => story.continue()).not.toThrow();
		expect(story.audio).toBeNull();
	});
});

describe('story.stepBack()', () => {
	const BRANCHING = 'Start.\n* [left]\n\tLeft.\n\t* * [down]\n\t\tDown.\n\t\t-> END\n\t* * [up]\n\t\tUp.\n\t\t-> END\n* [right]\n\tRight.\n\t-> END\n';

	it('rewinds to the passage before the last choice, with its choices on offer again', async () => {
		await loadInk(BRANCHING);
		story.continue();
		story.choose(0);
		const before = { passage: story.continue(), state: story.saveState() };
		story.choose(0);
		story.continue();

		expect(story.stepBack()).toBe(true);

		expect(story.choiceLog).toEqual([0]);
		expect(story.continue()).toEqual(before.passage);
		expect(story.saveState()).toBe(before.state);
	});

	it('steps back to the opening passage one choice at a time, then has nothing to take back', async () => {
		await loadInk(BRANCHING);
		const opening = story.continue();
		story.choose(0);
		story.continue();
		story.choose(1);
		story.continue();

		expect(story.stepBack()).toBe(true);
		expect(story.stepBack()).toBe(true);
		expect(story.choiceLog).toEqual([]);
		expect(story.continue()).toEqual(opening);

		expect(story.stepBack()).toBe(false);
		expect(story.choiceLog).toEqual([]);
	});

	it('returns false before any choice and leaves the story where it was', async () => {
		await loadInk(BRANCHING);
		story.continue();
		const state = story.saveState();

		expect(story.stepBack()).toBe(false);

		expect(story.saveState()).toBe(state);
	});
});
