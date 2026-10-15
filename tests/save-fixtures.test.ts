/**
 * Regression test over real saves captured from tagged releases
 * (`tests/fixtures/saves/<tag>.json`). Every fixture must still load under
 * the version-mismatch policy in `save-load.ts`: a load is never refused,
 * a save from another version says so, and a save from this build's minor
 * restores into the current story.
 *
 * Capturing a fixture (see tests/fixtures/saves/README.md):
 *
 *   CAPTURE_SAVE_FIXTURE=v0.16.0 bun run test tests/save-fixtures.test.ts
 *
 * With STORY_JSON pointing at an older tag's compiled story, the same
 * command captures a fixture for that tag in the save shape it used.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_VERSION, loadChecked, parseVersion, type SaveData } from '../src/lib/game/save-load';
import { story, loadStory } from '../src/lib/engine/story.svelte';
import { initGameSystems } from '../src/lib/game/init';
import { inventory } from '../src/lib/game/ideas.svelte';
import { body } from '../src/lib/game/body.svelte';
import { startAt, settle, stubStoryFetch, type Session } from './story-session';

const FIXTURE_DIR = join(__dirname, 'fixtures', 'saves');
const SLOT = 'the-work-fixture';

/** Which fields a save carried at a given tag: body state arrived in 0.3, the version stamp in 0.15. */
const FIELDS_SINCE = { bodyState: { major: 0, minor: 3 }, version: { major: 0, minor: 15 } };

/** The slice of `Storage` the save code uses, in memory. */
function memoryStorage(): Storage {
	const items = new Map<string, string>();
	return {
		get length() {
			return items.size;
		},
		clear: () => items.clear(),
		getItem: (key: string) => items.get(key) ?? null,
		key: (index: number) => [...items.keys()][index] ?? null,
		removeItem: (key: string) => void items.delete(key),
		setItem: (key: string, value: string) => void items.set(key, value)
	};
}

function atLeast(version: string, floor: { major: number; minor: number }): boolean {
	const parts = parseVersion(version);
	if (!parts) throw new Error(`Cannot parse tag ${version}`);
	return parts.major > floor.major || (parts.major === floor.major && parts.minor >= floor.minor);
}

/** Play a fixed route through the story and return a save in the shape the given tag wrote. */
function captureSave(tag: string): SaveData {
	const session: Session = startAt(1);
	settle(session);
	for (let step = 0; step < 6 && session.story.currentChoices.length > 0; step += 1) {
		session.story.ChooseChoiceIndex(0);
		settle(session);
	}
	if (session.errors.length > 0) throw new Error(`Ink errors while capturing ${tag}: ${session.errors.join('; ')}`);
	const data: SaveData = {
		storyState: session.story.state.toJson(),
		inventoryState: inventory.toJSON(),
		timestamp: Date.now()
	};
	if (atLeast(tag, FIELDS_SINCE.bodyState)) data.bodyState = body.toJSON();
	if (atLeast(tag, FIELDS_SINCE.version)) data.version = tag;
	return data;
}

beforeEach(() => {
	vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

// Capture runs before the fixtures are listed, so the new fixture is checked in the same run
const captureTag = process.env.CAPTURE_SAVE_FIXTURE;
if (captureTag) {
	if (!parseVersion(captureTag)) throw new Error(`CAPTURE_SAVE_FIXTURE must be a tag like v0.16.0, got "${captureTag}"`);
	mkdirSync(FIXTURE_DIR, { recursive: true });
	writeFileSync(join(FIXTURE_DIR, `${captureTag}.json`), JSON.stringify(captureSave(captureTag), null, '\t') + '\n');
}

const fixtures = existsSync(FIXTURE_DIR)
	? readdirSync(FIXTURE_DIR)
			.filter((name) => name.endsWith('.json'))
			.map((name) => ({ tag: name.replace(/\.json$/, ''), raw: readFileSync(join(FIXTURE_DIR, name), 'utf8') }))
	: [];

const current = parseVersion(APP_VERSION);

describe('save fixtures from tagged releases', () => {
	it('has at least one fixture to check', () => {
		expect(fixtures.map((f) => f.tag)).not.toEqual([]);
	});

	describe.each(fixtures)('$tag', ({ tag, raw }) => {
		const tagParts = parseVersion(tag);
		if (!tagParts) throw new Error(`Fixture ${tag}.json is not named after a tag`);
		const sameMinor = current !== null && current.major === tagParts.major && current.minor === tagParts.minor;

		it('is a save this build can read, and says how its version relates', () => {
			localStorage.setItem(SLOT, raw);
			const result = loadChecked(SLOT);
			expect(result.ok).toBe(true);
			if (!result.ok) return;

			if (result.data.version === undefined) {
				// Saves from before 0.15 carry no stamp, and the policy says so rather than guessing
				expect(atLeast(tag, FIELDS_SINCE.version)).toBe(false);
				expect(result.check.status).toBe('unknown');
				expect(result.warning).toContain('no version recorded');
			} else if (current === null) {
				expect(result.check.status).toBe('unknown');
			} else if (sameMinor) {
				expect(result.check.status).toBe('match');
				expect(result.warning).toBeNull();
			} else if (current.major === tagParts.major) {
				expect(result.check.status).toBe('minor-mismatch');
				expect(result.warning).toContain('Loading it anyway');
			} else {
				expect(result.check.status).toBe('major-mismatch');
				expect(result.warning).toContain('may not read it correctly');
			}
		});

		it('carries the fields its tag wrote, each still parseable', () => {
			const data = JSON.parse(raw) as SaveData;
			const ink = JSON.parse(data.storyState) as { inkSaveVersion?: unknown };
			expect(typeof ink.inkSaveVersion).toBe('number');
			expect(typeof data.inventoryState).toBe('string');
			expect(data.bodyState !== undefined).toBe(atLeast(tag, FIELDS_SINCE.bodyState));
			expect(data.version !== undefined).toBe(atLeast(tag, FIELDS_SINCE.version));
			inventory.reset();
			body.reset();
			expect(() => inventory.fromJSON(data.inventoryState as string)).not.toThrow();
			if (data.bodyState) expect(() => body.fromJSON(data.bodyState as string)).not.toThrow();
		});

		// Only a save from this build's minor is promised to restore; older story state may not fit the current story, and the policy is to warn and try
		it.runIf(sameMinor)('restores into the current story and carries on without Ink errors', async () => {
			inventory.reset();
			body.reset();
			stubStoryFetch();
			await loadStory('The Work.json', initGameSystems);
			const data = JSON.parse(raw) as SaveData;

			story.loadState(data.storyState);
			inventory.fromJSON(data.inventoryState as string);
			if (data.bodyState) body.fromJSON(data.bodyState);
			const { choices } = story.continue();

			expect(choices.length).toBeGreaterThan(0);
			expect(story.issues).toEqual([]);
		});
	});
});
