/**
 * Bodily state model: pure, rune-free logic for the Writer's body.
 *
 * Five states accumulate points from time and actions; the unbidden memory is
 * a one-off event. Levels (0 to 3) are derived from points and drive
 * interrupts, action failures and the two extremes. Ink owns time and prose;
 * this module owns the numbers. See docs/plans/bodily-states-spike.md.
 *
 * The reactive wrapper lives in body.svelte.ts; this file stays free of
 * Svelte so it can be tested as plain functions.
 */

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

export type BodyStateName = 'hunger' | 'thirst' | 'cold' | 'fatigue' | 'cramp';

/** What the Writer just did; drives the per-action extras. */
export type BodyAction = 'write' | 'observe' | 'dwell' | 'combine' | 'reflect' | 'attend' | 'idle';

/** What an interrupt is about: an escalating state or the one-off memory. */
export type InterruptSubject = BodyStateName | 'memory';

export type MemoryStatus = 'dormant' | 'pending' | 'surfaced';

export interface BodySnapshot {
	/** Accumulated points per state; levels are derived, never stored. */
	points: Record<BodyStateName, number>;
	/** Highest level already interrupted for, so each rise fires once. */
	announced: Record<BodyStateName, number>;
	/** Ticks spent at level 3 since the last interrupt, per state. */
	sinceNag: Record<BodyStateName, number>;
	memory: MemoryStatus;
	/** Remaining room stores; at 0 attending falls back to scraps or tap water. */
	stores: { meals: number; drinks: number };
	/** Rate multipliers (default 1; 1.5 is sooner, 0.5 is held off). Provisions set these. */
	rates: Record<BodyStateName, number>;
}

export interface TickInput {
	/** Ink TimeNumber (7 is 7pm, 12 is midnight, 19 is 7am). */
	hour: number;
	action: BodyAction;
	totalDread: number;
}

export interface AttendResult {
	relief: 'full' | 'fallback';
	/** Time ticks the remedy costs; Ink advances time this many times. */
	ticks: number;
}

// ---------------------------------------------------------------------------
// Tunable constants
// ---------------------------------------------------------------------------

export const BODY_STATES: readonly BodyStateName[] = ['hunger', 'thirst', 'cold', 'fatigue', 'cramp'];

export const BODY_ACTIONS: readonly BodyAction[] = [
	'write',
	'observe',
	'dwell',
	'combine',
	'reflect',
	'attend',
	'idle'
];

/** Points per level: L1 at 30, L2 at 60, L3 at 90. */
export const POINTS_PER_LEVEL = 30;

export const MAX_LEVEL = 3;

/** Points at which fatigue (asleep) or cold (failure ending) become extreme. Also the cap on points. */
export const EXTREME_POINTS = 120;

/** A state at level 3 re-interrupts after this many ticks until tended. */
export const NAG_INTERVAL = 5;

/** One interrupt beat covers at most this many subjects. */
export const MAX_INTERRUPTS = 2;

/** Hunger and thirst at this level or above each add a point of fatigue per tick. */
export const FATIGUE_PUSH_LEVEL = 2;

const FATIGUE_DRIVERS: readonly BodyStateName[] = ['hunger', 'thirst'];

const STARTING_STORES = { meals: 3, drinks: 4 } as const;

/** P-entry holding each subject's observable readings; '' where none is catalogued. */
export const PROMPT_FOR: Record<InterruptSubject, string> = {
	hunger: 'P54',
	fatigue: 'P55',
	cramp: 'P56',
	cold: 'P57',
	memory: 'P58',
	thirst: ''
};

/** Points gained per tick from the clock alone. Hours are Ink TimeNumber. */
function baselinePerTick(state: BodyStateName, hour: number): number {
	switch (state) {
		case 'hunger':
			return 1;
		case 'thirst':
			return 1;
		case 'cold':
			return hour >= 14 ? 2 : hour >= 10 ? 1 : 0;
		case 'fatigue':
			return hour >= 12 ? 2 : hour >= 10 ? 1 : 0;
		case 'cramp':
			return 0;
	}
}

/** Extra points gained by what the Writer just did. */
const ACTION_EXTRAS: Partial<Record<BodyAction, Partial<Record<BodyStateName, number>>>> = {
	write: { thirst: 1, cramp: 8 },
	dwell: { thirst: 1 }
};

interface Remedy {
	relief: number;
	ticks: number;
}

interface RemedyOptions {
	full: Remedy;
	/** Used once the matching store is empty. */
	fallback?: Remedy;
	store?: keyof BodySnapshot['stores'];
}

const REMEDIES: Record<BodyStateName, RemedyOptions> = {
	hunger: { full: { relief: 45, ticks: 1 }, fallback: { relief: 25, ticks: 2 }, store: 'meals' },
	thirst: { full: { relief: 45, ticks: 1 }, fallback: { relief: 25, ticks: 2 }, store: 'drinks' },
	cold: { full: { relief: 30, ticks: 1 } },
	fatigue: { full: { relief: 20, ticks: 3 } },
	cramp: { full: { relief: 40, ticks: 1 } }
};

// ---------------------------------------------------------------------------
// Guards (Ink hands the bridge plain strings)
// ---------------------------------------------------------------------------

export function isBodyState(value: string): value is BodyStateName {
	return (BODY_STATES as readonly string[]).includes(value);
}

export function isBodyAction(value: string): value is BodyAction {
	return (BODY_ACTIONS as readonly string[]).includes(value);
}

export function isInterruptSubject(value: string): value is InterruptSubject {
	return value === 'memory' || isBodyState(value);
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

function zeroed(): Record<BodyStateName, number> {
	return { hunger: 0, thirst: 0, cold: 0, fatigue: 0, cramp: 0 };
}

/** Fresh body for a new game. */
export function createBody(): BodySnapshot {
	return {
		points: zeroed(),
		announced: zeroed(),
		sinceNag: zeroed(),
		memory: 'dormant',
		stores: { ...STARTING_STORES },
		rates: { hunger: 1, thirst: 1, cold: 1, fatigue: 1, cramp: 1 }
	};
}

/** Level 0 to 3 for a state, derived from its points. */
export function levelOf(body: BodySnapshot, state: BodyStateName): number {
	return Math.min(MAX_LEVEL, Math.floor(body.points[state] / POINTS_PER_LEVEL));
}

/** The state that has gone extreme, or '' if none. Fatigue wins ties. */
export function extremeOf(body: BodySnapshot): 'fatigue' | 'cold' | '' {
	if (body.points.fatigue >= EXTREME_POINTS) return 'fatigue';
	if (body.points.cold >= EXTREME_POINTS) return 'cold';
	return '';
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

/** Advance the body by one time tick. Mutates and returns the snapshot. */
export function tick(body: BodySnapshot, input: TickInput): BodySnapshot {
	// Drivers read levels from before this tick, so the result ignores state order
	const fatiguePush = FATIGUE_DRIVERS.filter((driver) => levelOf(body, driver) >= FATIGUE_PUSH_LEVEL).length;

	for (const state of BODY_STATES) {
		let gain = baselinePerTick(state, input.hour) + (ACTION_EXTRAS[input.action]?.[state] ?? 0);
		if (state === 'fatigue') gain += fatiguePush;
		body.points[state] = Math.min(EXTREME_POINTS, body.points[state] + gain * body.rates[state]);

		body.sinceNag[state] = levelOf(body, state) === MAX_LEVEL ? body.sinceNag[state] + 1 : 0;
	}

	if (body.memory === 'dormant' && (levelOf(body, 'fatigue') >= 2 || input.totalDread >= 3)) {
		body.memory = 'pending';
	}
	return body;
}

// ---------------------------------------------------------------------------
// Interrupts
// ---------------------------------------------------------------------------

/**
 * The most pressing interrupts, at most {@link MAX_INTERRUPTS}.
 *
 * A state is due when its level has risen past the one already announced, or
 * when it sits at level 3 and has been ignored for {@link NAG_INTERVAL} ticks.
 * Highest level first, then roster order; the memory comes last.
 */
export function pendingInterrupts(body: BodySnapshot): InterruptSubject[] {
	const due: Array<{ state: BodyStateName; level: number }> = [];
	for (const state of BODY_STATES) {
		const level = levelOf(body, state);
		if (level === 0) continue;
		const rose = level > body.announced[state];
		const nag = level === MAX_LEVEL && body.sinceNag[state] >= NAG_INTERVAL;
		if (rose || nag) due.push({ state, level });
	}
	// Array.prototype.sort is stable, so equal levels keep roster order
	due.sort((a, b) => b.level - a.level);

	const subjects: InterruptSubject[] = due.map((entry) => entry.state);
	if (body.memory === 'pending') subjects.push('memory');
	return subjects.slice(0, MAX_INTERRUPTS);
}

/** Record that a subject has been dealt with so it does not re-fire until it rises again. */
export function resolveInterrupt(body: BodySnapshot, subject: InterruptSubject): void {
	if (subject === 'memory') {
		body.memory = 'surfaced';
		return;
	}
	body.announced[subject] = levelOf(body, subject);
	body.sinceNag[subject] = 0;
}

// ---------------------------------------------------------------------------
// Tending
// ---------------------------------------------------------------------------

/** Tend a state: reduce its points and draw on stores where relevant. */
export function attend(body: BodySnapshot, state: BodyStateName): AttendResult {
	const options = REMEDIES[state];
	const storeEmpty = options.store !== undefined && body.stores[options.store] <= 0;
	const useFallback = storeEmpty && options.fallback !== undefined;
	const remedy = useFallback ? options.fallback! : options.full;

	if (options.store !== undefined && !storeEmpty) body.stores[options.store] -= 1;
	body.points[state] = Math.max(0, body.points[state] - remedy.relief);

	// Relief lowers the level; let it interrupt again when it climbs back
	body.announced[state] = Math.min(body.announced[state], levelOf(body, state));
	body.sinceNag[state] = 0;

	return { relief: useFallback ? 'fallback' : 'full', ticks: remedy.ticks };
}

/** Set a rate multiplier (provisions hook). */
export function setRate(body: BodySnapshot, state: BodyStateName, multiplier: number): void {
	body.rates[state] = multiplier;
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export function serialiseBody(body: BodySnapshot): string {
	return JSON.stringify(body);
}

function readPerState(value: unknown, fallback: Record<BodyStateName, number>): Record<BodyStateName, number> {
	const source = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
	const result = { ...fallback };
	for (const state of BODY_STATES) {
		const candidate = source[state];
		if (typeof candidate === 'number' && Number.isFinite(candidate)) result[state] = candidate;
	}
	return result;
}

function readCount(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** Restore a body from saved JSON. Malformed or missing fields fall back to a fresh body's values. */
export function parseBody(json: string): BodySnapshot {
	const fresh = createBody();
	let data: unknown;
	try {
		data = JSON.parse(json);
	} catch {
		return fresh;
	}
	if (typeof data !== 'object' || data === null) return fresh;
	const raw = data as Record<string, unknown>;
	const stores = typeof raw.stores === 'object' && raw.stores !== null ? (raw.stores as Record<string, unknown>) : {};

	return {
		points: readPerState(raw.points, fresh.points),
		announced: readPerState(raw.announced, fresh.announced),
		sinceNag: readPerState(raw.sinceNag, fresh.sinceNag),
		memory: raw.memory === 'pending' || raw.memory === 'surfaced' ? raw.memory : 'dormant',
		stores: {
			meals: readCount(stores.meals, fresh.stores.meals),
			drinks: readCount(stores.drinks, fresh.stores.drinks)
		},
		rates: readPerState(raw.rates, fresh.rates)
	};
}
