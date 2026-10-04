import { createBody, tick, type BodySnapshot, type BodyStateName, type TickInput } from '../../src/lib/game/body';

/** A fresh body with some states already at given points. */
export function bodyWithPoints(points: Partial<Record<BodyStateName, number>>): BodySnapshot {
	const body = createBody();
	Object.assign(body.points, points);
	return body;
}

/** A tick input at 7pm doing nothing in particular, with overrides. */
export function tickInput(overrides: Partial<TickInput> = {}): TickInput {
	return { hour: 7, action: 'idle', totalDread: 0, ...overrides };
}

/** Run `count` identical ticks on a body. */
export function ticks(body: BodySnapshot, count: number, input: TickInput = tickInput()): BodySnapshot {
	for (let i = 0; i < count; i += 1) tick(body, input);
	return body;
}

export const SAVED_BODY_JSON = JSON.stringify({
	points: { hunger: 50, thirst: 10, cold: 0, fatigue: 95, cramp: 32 },
	announced: { hunger: 1, thirst: 0, cold: 0, fatigue: 3, cramp: 1 },
	sinceNag: { hunger: 0, thirst: 0, cold: 0, fatigue: 2, cramp: 0 },
	memory: 'surfaced',
	stores: { meals: 1, drinks: 2 },
	rates: { hunger: 0.5, thirst: 1, cold: 1.5, fatigue: 1, cramp: 1 }
});

/** An old-style save with a mangled field: parse must fall back per field. */
export const DAMAGED_BODY_JSON = JSON.stringify({
	points: { hunger: 'lots', thirst: 10 },
	memory: 'whenever',
	stores: { meals: -4 }
});
