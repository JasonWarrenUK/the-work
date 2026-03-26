const SAVE_KEY = 'the-work-save';
const AUTOSAVE_KEY = 'the-work-autosave';

export interface SaveData {
	storyState: string;
	/** Serialised inventory state from `inventory.toJSON()`. Absent in saves created before inventory persistence was added. */
	inventoryState?: string;
	timestamp: number;
}

export function save(opts: {
	storyState: string;
	inventoryState?: string;
	key?: string;
}): void {
	const data: SaveData = {
		storyState: opts.storyState,
		inventoryState: opts.inventoryState,
		timestamp: Date.now()
	};
	localStorage.setItem(opts.key ?? SAVE_KEY, JSON.stringify(data));
}

export function load(key = SAVE_KEY): SaveData | null {
	const raw = localStorage.getItem(key);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as SaveData;
	} catch {
		return null;
	}
}

export function hasSave(key = SAVE_KEY): boolean {
	return localStorage.getItem(key) !== null;
}

export function deleteSave(key = SAVE_KEY): void {
	localStorage.removeItem(key);
}

export function autosave(storyStateJson: string, inventoryStateJson?: string): void {
	save({ storyState: storyStateJson, inventoryState: inventoryStateJson, key: AUTOSAVE_KEY });
}

export function loadAutosave(): SaveData | null {
	return load(AUTOSAVE_KEY);
}

export function hasAutosave(): boolean {
	return hasSave(AUTOSAVE_KEY);
}

export function deleteAutosave(): void {
	deleteSave(AUTOSAVE_KEY);
}
