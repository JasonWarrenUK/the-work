import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	APP_VERSION,
	checkVersion,
	describeVersionCheck,
	load,
	loadChecked,
	parseVersion,
	save,
	autosave,
	loadAutosaveChecked,
	type SaveData
} from './save-load';

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

beforeEach(() => {
	vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('parseVersion', () => {
	it('reads the major and minor out of tag, describe and prerelease forms', () => {
		expect(parseVersion('v0.14.0')).toEqual({ major: 0, minor: 14 });
		expect(parseVersion('0.14.0-3-gabc1234')).toEqual({ major: 0, minor: 14 });
		expect(parseVersion('v1.2.0-rc.1')).toEqual({ major: 1, minor: 2 });
		expect(parseVersion('v2.0')).toEqual({ major: 2, minor: 0 });
	});

	it('gives null for a bare SHA, dev or nothing', () => {
		expect(parseVersion('c73a6b7')).toBeNull();
		expect(parseVersion('dev')).toBeNull();
		expect(parseVersion(undefined)).toBeNull();
		expect(parseVersion('')).toBeNull();
	});
});

describe('checkVersion', () => {
	it('matches the same minor whatever the patch or commit distance', () => {
		expect(checkVersion('v0.14.0', 'v0.14.0')).toEqual({ status: 'match' });
		expect(checkVersion('v0.14.0', 'v0.14.2')).toEqual({ status: 'match' });
		expect(checkVersion('v0.14.0', 'v0.14.0-5-gdeadbee')).toEqual({ status: 'match' });
	});

	it('flags a minor mismatch and a major mismatch separately', () => {
		expect(checkVersion('v0.13.0', 'v0.14.0')).toEqual({ status: 'minor-mismatch', saved: 'v0.13.0', current: 'v0.14.0' });
		expect(checkVersion('v0.14.0', 'v1.0.0')).toEqual({ status: 'major-mismatch', saved: 'v0.14.0', current: 'v1.0.0' });
	});

	it('matches an identical non-semver build and calls anything else unknown', () => {
		expect(checkVersion('c73a6b7', 'c73a6b7')).toEqual({ status: 'match' });
		expect(checkVersion('c73a6b7', 'v0.14.0')).toEqual({ status: 'unknown', saved: 'c73a6b7', current: 'v0.14.0' });
		expect(checkVersion(undefined, 'v0.14.0')).toEqual({ status: 'unknown', saved: undefined, current: 'v0.14.0' });
		expect(checkVersion('v0.14.0', 'dev')).toEqual({ status: 'unknown', saved: 'v0.14.0', current: 'dev' });
	});
});

describe('describeVersionCheck', () => {
	it('says nothing for a match and names both versions otherwise', () => {
		expect(describeVersionCheck({ status: 'match' })).toBeNull();
		expect(describeVersionCheck(checkVersion('v0.13.0', 'v0.14.0'))).toBe('This save is from version v0.13.0; you are running v0.14.0. Loading it anyway.');
		expect(describeVersionCheck(checkVersion('v0.14.0', 'v1.0.0'))).toContain('may not read it correctly');
		expect(describeVersionCheck(checkVersion(undefined, 'v0.14.0'))).toContain('no version recorded');
	});
});

describe('save and loadChecked', () => {
	it('stamps the running version and reads it back as a match', () => {
		save({ storyState: '{"ink":1}', inventoryState: '[]' });

		const result = loadChecked();
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.version).toBe(APP_VERSION);
		expect(result.data.storyState).toBe('{"ink":1}');
		expect(result.check).toEqual({ status: 'match' });
		expect(result.warning).toBeNull();
	});

	it('loads an older minor with a warning rather than refusing', () => {
		save({ storyState: '{}', version: 'v0.13.0' });

		const result = loadChecked(undefined, 'v0.14.0');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.check.status).toBe('minor-mismatch');
		expect(result.warning).toContain('Loading it anyway');
	});

	it('loads a save from before version stamping and says it has no version', () => {
		const legacy: SaveData = { storyState: '{}', timestamp: 1 };
		localStorage.setItem('the-work-save', JSON.stringify(legacy));

		const result = loadChecked(undefined, 'v0.14.0');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.check.status).toBe('unknown');
		expect(result.warning).toContain('no version recorded');
	});

	it('names the reason when a slot cannot be read', () => {
		expect(loadChecked()).toEqual({ ok: false, error: 'There is no save in that slot.' });

		localStorage.setItem('the-work-save', '{not json');
		expect(loadChecked()).toEqual({ ok: false, error: 'The save could not be read: it is not valid JSON.' });

		localStorage.setItem('the-work-save', JSON.stringify({ timestamp: 1 }));
		expect(loadChecked()).toEqual({ ok: false, error: 'The save could not be read: it has no story state.' });
	});

	it('keeps load() returning null for anything unreadable', () => {
		expect(load()).toBeNull();
		localStorage.setItem('the-work-save', '{not json');
		expect(load()).toBeNull();
		save({ storyState: '{}' });
		expect(load()?.storyState).toBe('{}');
	});

	it('stamps the autosave too', () => {
		autosave('{"auto":1}');
		const result = loadAutosaveChecked();
		expect(result.ok && result.data.version).toBe(APP_VERSION);
	});
});
