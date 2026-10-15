/**
 * Integration tests: the compiled story firing timed sensory events through
 * the real bindings (sensory.ts) and the real inventory, with no stubs.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import { type Session, startAt, texts, pick, run, settle } from '../../../tests/story-session';

const timeScore = (session: Session): number => session.story.variablesState.$('TimeScore') as number;
const hour = (session: Session): number => session.story.variablesState.$('TimeNumber') as number;

/** One spend of time that touches nothing but the body. */
function reflect(session: Session): string {
	pick(session, 'Exercise the mind');
	run(session);
	pick(session, 'Reflect on your progress');
	return run(session);
}

/** Whether the choices on offer are a sensory event's. */
const atEvent = (session: Session): boolean => texts(session).some((text) => text.includes('let it pass'));

beforeEach(() => {
	inventory.reset();
	body.reset();
});

describe('a timed sensory event', () => {
	it('lands after the first full action of its hour, not on the action that arrived there', () => {
		const session = startAt(12);
		settle(session);
		reflect(session);
		expect(atEvent(session)).toBe(false);

		const output = reflect(session);
		expect(output).toContain('Bells. Midnight.');
		expect(atEvent(session)).toBe(true);
		expect(session.errors).toEqual([]);
	});

	it('offers its three readings and takes one, costing an observation', () => {
		const session = startAt(12);
		settle(session);
		reflect(session);
		reflect(session);
		expect(texts(session)).toHaveLength(4);

		const before = timeScore(session);
		pick(session, texts(session)[2]);
		settle(session);
		expect(inventory.has('O49c')).toBe(true);
		expect(before - timeScore(session)).toBe(1);
		expect(session.errors).toEqual([]);
	});

	it('can be let pass at no cost and does not return that hour', () => {
		const session = startAt(12);
		settle(session);
		reflect(session);
		reflect(session);
		const before = timeScore(session);
		pick(session, 'let it pass');
		settle(session);
		expect(timeScore(session)).toBe(before);
		expect(inventory.has('O49a')).toBe(false);

		reflect(session);
		expect(atEvent(session)).toBe(false);
	});

	it('is silent in an hour that has no event', () => {
		const session = startAt(13);
		settle(session);
		for (let step = 0; step < 4; step += 1) {
			reflect(session);
			expect(atEvent(session)).toBe(false);
		}
		expect(session.errors).toEqual([]);
	});

	it('fires again when the night reaches the next slotted hour', () => {
		const session = startAt(13);
		settle(session);
		const events: string[] = [];
		for (let step = 0; step < 40 && hour(session) < 15; step += 1) {
			if (texts(session).some((text) => text.includes('push through'))) {
				pick(session, 'push through');
				run(session);
			} else if (atEvent(session)) {
				pick(session, 'let it pass');
				run(session);
			} else {
				const output = reflect(session);
				if (atEvent(session)) events.push(output.trim().split('\n').at(-1) ?? '');
			}
		}
		expect(events).toEqual(['The gas lamp dims.']);
		expect(session.errors).toEqual([]);
	});
});

describe('persistence', () => {
	it('keeps the armed and handled hours in the story state', () => {
		const session = startAt(12);
		settle(session);
		reflect(session);
		const storyJson = session.story.state.toJson();

		const restored = startAt(12);
		restored.story.state.LoadJson(storyJson);
		expect(restored.story.variablesState.$('sensoryArmedHour')).toBe(12);
		expect(restored.story.variablesState.$('sensoryHandledHour')).toBe(0);
		reflect(restored);
		expect(atEvent(restored)).toBe(true);
		expect(restored.errors).toEqual([]);
	});
});
