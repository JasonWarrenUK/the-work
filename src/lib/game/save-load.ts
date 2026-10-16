const SAVE_KEY = 'the-work-save';
const AUTOSAVE_KEY = 'the-work-autosave';

/**
 * The build's version, stamped into every save: the nearest git tag as
 * `git describe --tags --always` prints it (`v0.14.0`, `v0.14.0-3-gabc1234`
 * three commits past the tag, or a bare short SHA with no tag in reach),
 * injected by vite.config.ts at build time. 'dev' when no build injected one.
 */
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';

export interface SaveData {
	storyState: string;
	/** Serialised inventory state from `inventory.toJSON()`. Absent in saves created before inventory persistence was added. */
	inventoryState?: string;
	/** Serialised body state from `body.toJSON()`. Absent in saves created before bodily states; those restore with a fresh body. */
	bodyState?: string;
	/** The run's `story.seed`. Absent in saves from before the choice history was stored. */
	seed?: number;
	/** The run's `story.choiceLog` at the moment of saving; with `seed`, enough to replay the run. Absent in saves from before the choice history was stored. */
	choices?: number[];
	/** The {@link APP_VERSION} that wrote the save. Absent in saves from before version stamping. */
	version?: string;
	timestamp: number;
}

/** The major and minor of a version string, when it carries a semver. */
export interface VersionParts {
	major: number;
	minor: number;
}

/**
 * Read the leading semver out of a version string. `v0.14.0`,
 * `0.14.0-3-gabc1234` and `v1.2.0-rc.1` all parse; a bare SHA or `dev`
 * gives null.
 */
export function parseVersion(version: string | undefined): VersionParts | null {
	if (!version) return null;
	const match = /^v?(\d+)\.(\d+)(?:\.\d+)?(?:[-+.].*)?$/.exec(version.trim());
	return match ? { major: Number(match[1]), minor: Number(match[2]) } : null;
}

/** How a save's version relates to the running build. */
export type VersionCheck =
	/** Same major and minor, or the save was written by this exact build. Patch and commit distance do not count. */
	| { status: 'match' }
	/** Same major, different minor: load it, but say so. */
	| { status: 'minor-mismatch'; saved: string; current: string }
	/** Different major: load it, with a stronger warning. */
	| { status: 'major-mismatch'; saved: string; current: string }
	/** The save predates version stamping, or one side carries no semver (a bare SHA, `dev`). */
	| { status: 'unknown'; saved: string | undefined; current: string };

/** Compare a save's recorded version with the running build. */
export function checkVersion(saved: string | undefined, current: string = APP_VERSION): VersionCheck {
	if (saved !== undefined && saved === current) return { status: 'match' };
	const savedParts = parseVersion(saved);
	const currentParts = parseVersion(current);
	if (!savedParts || !currentParts) return { status: 'unknown', saved, current };
	if (savedParts.major !== currentParts.major) return { status: 'major-mismatch', saved: saved as string, current };
	if (savedParts.minor !== currentParts.minor) return { status: 'minor-mismatch', saved: saved as string, current };
	return { status: 'match' };
}

/** A sentence for the player about a version check, or null when there is nothing to say. */
export function describeVersionCheck(check: VersionCheck): string | null {
	switch (check.status) {
		case 'match':
			return null;
		case 'minor-mismatch':
			return `This save is from version ${check.saved}; you are running ${check.current}. Loading it anyway.`;
		case 'major-mismatch':
			return `This save is from version ${check.saved}; you are running ${check.current}, which may not read it correctly.`;
		case 'unknown':
			return check.saved === undefined
				? 'This save has no version recorded; it predates version stamping.'
				: `This save is from ${check.saved}; the running build (${check.current}) cannot tell whether they match.`;
	}
}

/** What reading a save slot produced: the data with any version warning, or the specific reason it could not be read. */
export type LoadResult =
	| { ok: true; data: SaveData; check: VersionCheck; warning: string | null }
	| { ok: false; error: string };

/** What a save captures: the story's state JSON with the game state and choice history around it. */
export interface Snapshot {
	storyState: string;
	inventoryState?: string;
	bodyState?: string;
	seed?: number;
	choices?: readonly number[];
}

export function save(opts: Snapshot & {
	key?: string;
	/** Overrides the stamped version; tests use it. */
	version?: string;
}): void {
	const data: SaveData = {
		storyState: opts.storyState,
		inventoryState: opts.inventoryState,
		bodyState: opts.bodyState,
		seed: opts.seed,
		choices: opts.choices === undefined ? undefined : [...opts.choices],
		version: opts.version ?? APP_VERSION,
		timestamp: Date.now()
	};
	localStorage.setItem(opts.key ?? SAVE_KEY, JSON.stringify(data));
}

/**
 * Read a save slot and check its version against the running build. A
 * version mismatch never refuses the load: the result carries the data and
 * a warning to show. Only an unreadable slot fails, and then with the reason.
 */
export function loadChecked(key = SAVE_KEY, current: string = APP_VERSION): LoadResult {
	const raw = localStorage.getItem(key);
	if (raw === null) return { ok: false, error: 'There is no save in that slot.' };
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { ok: false, error: 'The save could not be read: it is not valid JSON.' };
	}
	if (typeof parsed !== 'object' || parsed === null || typeof (parsed as SaveData).storyState !== 'string') {
		return { ok: false, error: 'The save could not be read: it has no story state.' };
	}
	const data = parsed as SaveData;
	const check = checkVersion(data.version, current);
	return { ok: true, data, check, warning: describeVersionCheck(check) };
}

/** Read a save slot, or null when it is missing or unreadable. See {@link loadChecked} for the reason. */
export function load(key = SAVE_KEY): SaveData | null {
	const result = loadChecked(key);
	return result.ok ? result.data : null;
}

export function hasSave(key = SAVE_KEY): boolean {
	return localStorage.getItem(key) !== null;
}

export function deleteSave(key = SAVE_KEY): void {
	localStorage.removeItem(key);
}

/** Write the autosave slot. Called after every passage, so it takes the same snapshot a manual save does. */
export function autosave(snapshot: Snapshot): void {
	save({ ...snapshot, key: AUTOSAVE_KEY });
}

export function loadAutosave(): SaveData | null {
	return load(AUTOSAVE_KEY);
}

/** Read the autosave with its version check; see {@link loadChecked}. */
export function loadAutosaveChecked(): LoadResult {
	return loadChecked(AUTOSAVE_KEY);
}

export function hasAutosave(): boolean {
	return hasSave(AUTOSAVE_KEY);
}

export function deleteAutosave(): void {
	deleteSave(AUTOSAVE_KEY);
}
