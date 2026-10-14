/**
 * Integration tests: hidden objects revealed by examining their parent,
 * played through the compiled story with the real bindings and inventory.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { getAllPrompts, inventory } from './ideas.svelte';
import { registerAllIdeas } from './idea-catalog';
import { body } from './body.svelte';
import { type Session, startAt, texts, pick, run, settle } from '../../../tests/story-session';
import * as fixtures from '../../../tests/fixtures/hidden';

/** Open "Consider your circumstances" and pick a location, returning its choices. */
function lookAt(session: Session, location: string): string[] {
	pick(session, 'Consider your circumstances');
	run(session);
	pick(session, location);
	run(session);
	return texts(session);
}

/** Examine an object from its location menu and take its first reading. */
function examine(session: Session, location: string, label: string): string {
	lookAt(session, location);
	pick(session, label);
	const output = run(session);
	pick(session, texts(session)[0]);
	settle(session);
	return output;
}

beforeEach(() => {
	inventory.reset();
	body.reset();
});

describe('the fixture', () => {
	it('names every hidden prompt in the catalogue exactly once', () => {
		registerAllIdeas();
		const catalogued = getAllPrompts().filter((prompt) => prompt.location === 'hidden').map((prompt) => prompt.id).sort();
		expect(fixtures.HIDDEN_OBJECTS.map((object) => object.prompt).sort()).toEqual(catalogued);
	});
});

describe.each(fixtures.HIDDEN_OBJECTS)('$prompt behind $parent', ({ prompt, location, parent, label, text }) => {
	it('is absent until the parent is examined, then yields one reading and is consumed', () => {
		const session = startAt(12);
		settle(session);
		expect(lookAt(session, location)).not.toContain(label);
		pick(session, parent);
		run(session);
		pick(session, texts(session)[0]);
		settle(session);

		expect(lookAt(session, location)).toContain(label);
		pick(session, label);
		const output = run(session);
		expect(output).toContain(text);
		expect(texts(session)).toHaveLength(3);
		pick(session, texts(session)[1]);
		settle(session);
		expect(inventory.has(`O${prompt.slice(1)}b`)).toBe(true);

		expect(lookAt(session, location)).not.toContain(label);
		expect(session.errors).toEqual([]);
	});
});

describe('the Bible', () => {
	it('reveals the note whichever passage it fell open at', () => {
		const session = startAt(12);
		settle(session);
		examine(session, 'The shelves', 'The Bible');
		expect(lookAt(session, 'The shelves')).toContain('A note folded inside the Bible');
	});
});
