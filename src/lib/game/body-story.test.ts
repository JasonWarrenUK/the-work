/**
 * Integration tests: the compiled story, the real external bindings
 * (idea-bridge.ts) and the real body and inventory state, with no stubs.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Story } from 'inkjs';
import { initGameSystems } from './init';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import * as fixtures from '../../../tests/fixtures/body';

const STORY_JSON = readFileSync(process.env.STORY_JSON ?? 'static/The Work.json', 'utf8').replace(/^﻿/, '');

interface Session {
	story: Story;
	errors: string[];
}

/** Start the gameplay loop at an hour with a fresh inventory and body. */
function startAt(hour: number): Session {
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

const texts = (session: Session): string[] => session.story.currentChoices.map((choice) => choice.text);

function pick(session: Session, label: string): void {
	const index = texts(session).findIndex((text) => text.includes(label));
	if (index < 0) throw new Error(`No choice containing "${label}" in [${texts(session).join(' | ')}]`);
	session.story.ChooseChoiceIndex(index);
}

const run = (session: Session): string => session.story.ContinueMaximally();

/** Run, then push through any interrupt beats until the action menu is showing. */
function settle(session: Session): string {
	let output = run(session);
	while (texts(session).some((text) => text.includes('push through'))) {
		pick(session, 'push through');
		output += run(session);
	}
	return output;
}

const timeScore = (session: Session): number => session.story.variablesState.$('TimeScore') as number;

/** One spend of time that touches nothing but the body. */
function reflect(session: Session): string {
	pick(session, 'Exercise the mind');
	run(session);
	pick(session, 'Reflect on your progress');
	return run(session);
}

function setBody(points: Parameters<typeof fixtures.bodyWithPoints>[0], announced: Record<string, number> = {}): void {
	body.fromJSON(JSON.stringify({ points, announced }));
}

beforeEach(() => {
	inventory.reset();
	body.reset();
});

describe('the night with a neglected body', () => {
	it('raises aggregated interrupts, then ends with the Writer asleep before the defence', () => {
		const session = startAt(9);
		const beats: string[] = [];
		let output = '';
		for (let step = 0; step < 300; step += 1) {
			output = run(session);
			if (texts(session).length === 0) break;
			if (texts(session).some((text) => text.includes('push through'))) {
				beats.push(output.split('\n').filter((line) => line.startsWith('[PLACEHOLDER')).join(' + '));
				pick(session, 'push through');
			} else if (texts(session).includes('Reflect on your progress')) {
				pick(session, 'Reflect on your progress');
			} else {
				pick(session, 'Exercise the mind');
			}
		}
		expect(session.errors).toEqual([]);
		expect(beats.some((beat) => beat.split(' + ').length === 2)).toBe(true);
		expect(session.story.variablesState.$('fellAsleep')).toBe(true);
		expect(output).toContain('It is 8:00 in the morning');
	});

	it('ends the story at extreme cold with the stub ending', () => {
		const session = startAt(12);
		setBody({ cold: 120 });
		run(session);
		expect(reflect(session)).toContain('the cold takes you');
		expect(texts(session)).toEqual([]);
	});

	it('falls asleep when tending inside the beat carries fatigue to the extreme', () => {
		const session = startAt(12);
		setBody({ hunger: 95, fatigue: 115 }, { hunger: 2, fatigue: 3 });
		run(session);
		reflect(session);
		pick(session, 'attend to hunger');
		run(session);
		expect(session.story.variablesState.$('fellAsleep')).toBe(true);
		expect(session.errors).toEqual([]);
	});
});

describe('tending and time', () => {
	it('charges the remedy ticks and spends the room stores', () => {
		const session = startAt(12);
		setBody({ hunger: 100, fatigue: 70 }, { hunger: 3, fatigue: 2 });
		settle(session);

		let before = timeScore(session);
		pick(session, 'Attend to yourself');
		run(session);
		pick(session, 'PLACEHOLDER eat');
		settle(session);
		expect(before - timeScore(session)).toBe(1);

		before = timeScore(session);
		pick(session, 'Attend to yourself');
		run(session);
		pick(session, 'PLACEHOLDER rest');
		settle(session);
		expect(before - timeScore(session)).toBe(3);
		expect(JSON.parse(body.toJSON()).stores.meals).toBe(2);
	});

	it('charges an extra tick per action at cold level 3, but not for tending', () => {
		const session = startAt(12);
		setBody({ cold: 95 }, { cold: 3 });
		settle(session);

		const before = timeScore(session);
		reflect(session);
		settle(session);
		expect(before - timeScore(session)).toBe(2);

		const beforeTending = timeScore(session);
		pick(session, 'Attend to yourself');
		run(session);
		pick(session, 'wrap the coat');
		settle(session);
		expect(beforeTending - timeScore(session)).toBe(1);
	});
});

describe('persistence', () => {
	it('restores the body and story together without re-firing resolved interrupts', () => {
		const session = startAt(9);
		let resolved = 0;
		for (let step = 0; step < 200 && resolved < 2; step += 1) {
			run(session);
			if (texts(session).some((text) => text.includes('push through'))) {
				pick(session, 'push through');
				resolved += 1;
			} else if (texts(session).includes('Reflect on your progress')) {
				pick(session, 'Reflect on your progress');
			} else {
				pick(session, 'Exercise the mind');
			}
		}
		run(session);
		const pendingBefore = body.interrupts();
		const storyJson = session.story.state.toJson();
		const bodyJson = body.toJSON();

		const restored = startAt(9);
		body.fromJSON(bodyJson);
		restored.story.state.LoadJson(storyJson);

		expect(body.toJSON()).toBe(bodyJson);
		expect(body.interrupts()).toEqual(pendingBefore);
		expect(restored.errors).toEqual([]);
	});
});

describe('dwelling on a state', () => {
	it('acquires one reading and is not offered again once it is held', () => {
		const session = startAt(12);
		setBody({ hunger: 35 });
		run(session);
		reflect(session);
		expect(texts(session)).toContain('PLACEHOLDER dwell on hunger');

		pick(session, 'dwell on hunger');
		run(session);
		expect(texts(session)).toHaveLength(3);
		pick(session, texts(session)[1]);
		run(session);
		expect(inventory.has('O54b')).toBe(true);
		expect(session.errors).toEqual([]);

		setBody({ hunger: 65 }, { hunger: 1 });
		reflect(session);
		expect(texts(session)).toContain('PLACEHOLDER attend to hunger');
		expect(texts(session)).not.toContain('PLACEHOLDER dwell on hunger');
	});
});

describe('action failures at level 3', () => {
	/** Open the writing menu and report what it offers. */
	function openWriting(session: Session): string[] {
		pick(session, 'Attend to The Work');
		run(session);
		return texts(session);
	}

	it('blocks writing for a cramped hand, spends no time and points to stretching', () => {
		const session = startAt(12);
		inventory.acquire('C2');
		setBody({ cramp: 95 }, { cramp: 3 });
		settle(session);

		const before = timeScore(session);
		pick(session, 'Attend to The Work');
		const output = run(session);
		expect(output).toContain('stretch it first');
		expect(timeScore(session)).toBe(before);
		expect(texts(session)).toContain('Attend to The Work');
		expect(texts(session)).toContain('Attend to yourself');
	});

	it('offers a way forward, costing a tick, when nothing is writable', () => {
		const session = startAt(12);
		settle(session);
		expect(openWriting(session)).toEqual(['Set pen to paper']);
		const before = timeScore(session);
		pick(session, 'Set pen to paper');
		expect(run(session)).toContain('too unformed');
		expect(before - timeScore(session)).toBe(1);
		expect(session.errors).toEqual([]);
	});

	it('writes the chosen idea once and spends a tick when the hand is fine', () => {
		const session = startAt(12);
		inventory.acquire('C2');
		settle(session);
		const offered = openWriting(session);
		expect(offered).toHaveLength(1);
		expect(offered[0]).not.toBe('Set pen to paper');

		const before = timeScore(session);
		pick(session, offered[0]);
		const output = run(session);
		expect(output.match(/You set pen to paper\./g)).toHaveLength(1);
		expect(inventory.isWritten('C2')).toBe(true);
		expect(before - timeScore(session)).toBe(1);
		expect(session.errors).toEqual([]);
	});

	it('stalls developing at fatigue level 3 but still spends the time', () => {
		const session = startAt(12);
		inventory.acquire('O1a');
		setBody({ fatigue: 95 }, { fatigue: 3 });
		settle(session);

		pick(session, 'Exercise the mind');
		run(session);
		pick(session, 'Dwell on a thread');
		run(session);
		const before = timeScore(session);
		pick(session, 'Rule');
		const output = run(session);
		expect(output).toContain('too tired to develop');
		expect(inventory.has('I5')).toBe(false);
		expect(before - timeScore(session)).toBeGreaterThan(0);
	});

	it('develops normally when rested', () => {
		const session = startAt(12);
		inventory.acquire('O1a');
		settle(session);
		pick(session, 'Exercise the mind');
		run(session);
		pick(session, 'Dwell on a thread');
		run(session);
		pick(session, 'Rule');
		run(session);
		expect(inventory.has('I5')).toBe(true);
	});

	it('stalls combining at hunger level 3', () => {
		const session = startAt(12);
		inventory.acquire('O1a');
		setBody({ hunger: 95 }, { hunger: 3 });
		settle(session);

		pick(session, 'Exercise the mind');
		run(session);
		pick(session, 'Draw connections');
		run(session);
		pick(session, 'Rule');
		expect(run(session)).toContain('too hungry to hold two thoughts together');
	});
});
