/**
 * Integration test: a real night replays from its seed and choice log,
 * rebuilding the game state held outside Ink (inventory and body) as well as
 * Ink's own, through the Nib `story` singleton and the real bindings.
 *
 * Requires `static/The Work.json` to be up to date (see CLAUDE.md for the
 * compile command).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initGameSystems } from './init';
import { inventory } from './ideas.svelte';
import { body } from './body.svelte';
import { story, loadStory } from '../engine/story.svelte';
import { stubStoryFetch } from '../../../tests/story-session';

/** Choose the first option whose text contains the label. */
function choose(label: string): void {
	const { choices } = story.continue();
	const choice = choices.find((c) => c.text.includes(label));
	if (!choice) throw new Error(`No choice containing "${label}" in [${choices.map((c) => c.text).join(' | ')}]`);
	story.choose(choice.index);
}

/** Take the first choice on offer, up to `steps` times or until the story ends. */
function playFirstChoices(steps: number): void {
	for (let step = 0; step < steps; step += 1) {
		const { choices } = story.continue();
		if (choices.length === 0) return;
		story.choose(choices[0].index);
	}
}

beforeEach(async () => {
	inventory.reset();
	body.reset();
	stubStoryFetch();
	await loadStory('The Work.json', initGameSystems);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('replaying a night from the seed and choice log', () => {
	it('rebuilds the story, inventory and body exactly', () => {
		choose('Test the Game');
		playFirstChoices(60);
		expect(story.choiceLog.length).toBeGreaterThan(20);

		const seed = story.seed as number;
		const log = [...story.choiceLog];
		const saved = { story: story.saveState(), inventory: inventory.toJSON(), body: body.toJSON() };

		// The external state belongs to the game, so the caller resets it before replaying
		inventory.reset();
		body.reset();
		story.replay(seed, log);

		expect(story.saveState()).toBe(saved.story);
		expect(inventory.toJSON()).toBe(saved.inventory);
		expect(body.toJSON()).toBe(saved.body);
		expect(story.choiceLog).toEqual(log);
		expect(story.issues).toEqual([]);
	});

	it('carries on from the replayed point as the live run would have', () => {
		choose('Test the Game');
		playFirstChoices(40);
		const seed = story.seed as number;
		const log = [...story.choiceLog];

		const live = story.continue();
		story.choose(live.choices[0].index);
		const liveNext = story.continue();

		inventory.reset();
		body.reset();
		story.replay(seed, log);
		const replayed = story.continue();
		story.choose(replayed.choices[0].index);
		const replayedNext = story.continue();

		expect(replayed.paragraphs).toEqual(live.paragraphs);
		expect(replayedNext.paragraphs).toEqual(liveNext.paragraphs);
		expect(replayedNext.choices).toEqual(liveNext.choices);
	});
});
