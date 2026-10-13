import { describe, expect, it } from 'vitest';
import {
	BODY_STATES,
	EXTREME_POINTS,
	NAG_INTERVAL,
	attend,
	createBody,
	extremeOf,
	isBodyAction,
	isBodyState,
	isInterruptSubject,
	levelOf,
	parseBody,
	pendingInterrupts,
	resolveInterrupt,
	serialiseBody,
	setRate
} from './body';
import * as fixtures from '../../../tests/fixtures/body';

describe('createBody', () => {
	it('starts every state at zero with the memory dormant', () => {
		const body = createBody();
		expect(Object.values(body.points)).toEqual([0, 0, 0, 0, 0]);
		expect(Object.values(body.announced)).toEqual([0, 0, 0, 0, 0]);
		expect(body.memory).toBe('dormant');
		expect(body.stores).toEqual({ meals: 3, drinks: 4 });
		expect(Object.values(body.rates)).toEqual([1, 1, 1, 1, 1]);
	});
});

describe('levelOf', () => {
	it('derives levels from points and caps at 3', () => {
		const body = fixtures.bodyWithPoints({ hunger: 29, thirst: 30, cold: 60, fatigue: 90, cramp: 120 });
		expect(BODY_STATES.map((state) => levelOf(body, state))).toEqual([0, 1, 2, 3, 3]);
	});
});

describe('tick: baseline', () => {
	it('raises hunger and thirst by one a tick all night', () => {
		const body = fixtures.ticks(createBody(), 10);
		expect(body.points.hunger).toBe(10);
		expect(body.points.thirst).toBe(10);
	});

	it('leaves cold and fatigue idle before 10pm', () => {
		const body = fixtures.ticks(createBody(), 10, fixtures.tickInput({ hour: 9 }));
		expect(body.points.cold).toBe(0);
		expect(body.points.fatigue).toBe(0);
	});

	it('starts cold and fatigue at 10pm and doubles them from 2am and midnight', () => {
		const at = (hour: number) => fixtures.ticks(createBody(), 1, fixtures.tickInput({ hour })).points;
		expect([at(10).cold, at(10).fatigue]).toEqual([1, 1]);
		expect([at(12).cold, at(12).fatigue]).toEqual([1, 2]);
		expect([at(14).cold, at(14).fatigue]).toEqual([2, 2]);
	});

	it('reaches fatigue extreme around 5am if never tended', () => {
		const body = createBody();
		for (let hour = 7; hour <= 17 && !extremeOf(body); hour += 1) {
			fixtures.ticks(body, 10, fixtures.tickInput({ hour }));
		}
		expect(extremeOf(body)).toBe('fatigue');
	});
});

describe('tick: actions', () => {
	it('adds thirst, hand cramp when writing', () => {
		const body = fixtures.ticks(createBody(), 1, fixtures.tickInput({ action: 'write' }));
		expect(body.points.thirst).toBe(2);
		expect(body.points.cramp).toBe(8);
	});

	it('adds thirst when dwelling and nothing else', () => {
		const body = fixtures.ticks(createBody(), 1, fixtures.tickInput({ action: 'dwell' }));
		expect(body.points.thirst).toBe(2);
		expect(body.points.cramp).toBe(0);
	});

	it('leaves observing, combining and reflecting at baseline', () => {
		for (const action of ['observe', 'combine', 'reflect'] as const) {
			const body = fixtures.ticks(createBody(), 1, fixtures.tickInput({ action }));
			expect(body.points.thirst).toBe(1);
			expect(body.points.cramp).toBe(0);
		}
	});
});

describe('tick: fatigue push', () => {
	it('adds a point of fatigue for each of hunger and thirst at level 2', () => {
		const hour = 9; // fatigue baseline is zero before 10pm
		const one = fixtures.bodyWithPoints({ hunger: 60 });
		const both = fixtures.bodyWithPoints({ hunger: 60, thirst: 60 });
		const neither = fixtures.bodyWithPoints({ hunger: 59, thirst: 59 });
		expect(fixtures.ticks(one, 1, fixtures.tickInput({ hour })).points.fatigue).toBe(1);
		expect(fixtures.ticks(both, 1, fixtures.tickInput({ hour })).points.fatigue).toBe(2);
		expect(fixtures.ticks(neither, 1, fixtures.tickInput({ hour })).points.fatigue).toBe(0);
	});
});

describe('tick: rates', () => {
	it('multiplies gains by the state rate', () => {
		const body = createBody();
		setRate(body, 'hunger', 1.5);
		setRate(body, 'thirst', 0.5);
		fixtures.ticks(body, 10);
		expect(body.points.hunger).toBe(15);
		expect(body.points.thirst).toBe(5);
	});

	it('caps points at the extreme', () => {
		const body = fixtures.bodyWithPoints({ cold: 119 });
		fixtures.ticks(body, 5, fixtures.tickInput({ hour: 15 }));
		expect(body.points.cold).toBe(EXTREME_POINTS);
	});
});

describe('extremeOf', () => {
	it('is quiet below the threshold', () => {
		expect(extremeOf(fixtures.bodyWithPoints({ fatigue: 119, cold: 119 }))).toBe('');
	});

	it('reports fatigue or cold and prefers fatigue on a tie', () => {
		expect(extremeOf(fixtures.bodyWithPoints({ cold: 120 }))).toBe('cold');
		expect(extremeOf(fixtures.bodyWithPoints({ fatigue: 120 }))).toBe('fatigue');
		expect(extremeOf(fixtures.bodyWithPoints({ fatigue: 120, cold: 120 }))).toBe('fatigue');
	});

	it('ignores states that cannot go extreme', () => {
		expect(extremeOf(fixtures.bodyWithPoints({ hunger: 120, thirst: 120, cramp: 120 }))).toBe('');
	});
});

describe('memory', () => {
	it('becomes pending when fatigue reaches level 2', () => {
		const body = fixtures.bodyWithPoints({ fatigue: 59 });
		fixtures.ticks(body, 1, fixtures.tickInput({ hour: 9 }));
		expect(body.memory).toBe('dormant');
		body.points.fatigue = 60;
		fixtures.ticks(body, 1, fixtures.tickInput({ hour: 9 }));
		expect(body.memory).toBe('pending');
	});

	it('becomes pending when total dread reaches 3', () => {
		const body = createBody();
		fixtures.ticks(body, 1, fixtures.tickInput({ totalDread: 2 }));
		expect(body.memory).toBe('dormant');
		fixtures.ticks(body, 1, fixtures.tickInput({ totalDread: 3 }));
		expect(body.memory).toBe('pending');
	});

	it('fires once and stays surfaced', () => {
		const body = createBody();
		fixtures.ticks(body, 1, fixtures.tickInput({ totalDread: 5 }));
		resolveInterrupt(body, 'memory');
		fixtures.ticks(body, 1, fixtures.tickInput({ totalDread: 5 }));
		expect(body.memory).toBe('surfaced');
		expect(pendingInterrupts(body)).toEqual([]);
	});
});

describe('pendingInterrupts', () => {
	it('is quiet for a fresh body', () => {
		expect(pendingInterrupts(createBody())).toEqual([]);
	});

	it('fires once per level rise', () => {
		const body = fixtures.bodyWithPoints({ hunger: 30 });
		expect(pendingInterrupts(body)).toEqual(['hunger']);
		resolveInterrupt(body, 'hunger');
		expect(pendingInterrupts(body)).toEqual([]);
		body.points.hunger = 60;
		expect(pendingInterrupts(body)).toEqual(['hunger']);
	});

	it('orders by level, then roster order, with the memory last', () => {
		const body = fixtures.bodyWithPoints({ hunger: 30, cold: 60, fatigue: 60, cramp: 30 });
		body.memory = 'pending';
		expect(pendingInterrupts(body)).toEqual(['cold', 'fatigue']);
		resolveInterrupt(body, 'cold');
		resolveInterrupt(body, 'fatigue');
		expect(pendingInterrupts(body)).toEqual(['hunger', 'cramp']);
	});

	it('caps one beat at two subjects and keeps the rest pending', () => {
		const body = fixtures.bodyWithPoints({ hunger: 30, thirst: 30, cold: 30 });
		const first = pendingInterrupts(body);
		expect(first).toEqual(['hunger', 'thirst']);
		first.forEach((subject) => resolveInterrupt(body, subject));
		expect(pendingInterrupts(body)).toEqual(['cold']);
	});

	it('lists the memory when nothing else is due', () => {
		const body = createBody();
		body.memory = 'pending';
		expect(pendingInterrupts(body)).toEqual(['memory']);
	});

	it('nags at level 3 every interval until tended, and not before', () => {
		const body = fixtures.bodyWithPoints({ hunger: 90 });
		expect(pendingInterrupts(body)).toEqual(['hunger']);
		resolveInterrupt(body, 'hunger');
		for (let i = 1; i < NAG_INTERVAL; i += 1) {
			fixtures.ticks(body, 1, fixtures.tickInput({ hour: 9 }));
			expect(pendingInterrupts(body)).toEqual([]);
		}
		fixtures.ticks(body, 1, fixtures.tickInput({ hour: 9 }));
		expect(pendingInterrupts(body)).toEqual(['hunger']);
		resolveInterrupt(body, 'hunger');
		expect(pendingInterrupts(body)).toEqual([]);
	});

	it('does not count nag ticks below level 3', () => {
		const body = fixtures.bodyWithPoints({ hunger: 60 });
		resolveInterrupt(body, 'hunger');
		fixtures.ticks(body, NAG_INTERVAL + 2, fixtures.tickInput({ hour: 9 }));
		expect(levelOf(body, 'hunger')).toBe(2);
		expect(pendingInterrupts(body)).toEqual([]);
	});
});

describe('attend', () => {
	it('relieves hunger and thirst from the room stores', () => {
		const body = fixtures.bodyWithPoints({ hunger: 100, thirst: 100 });
		expect(attend(body, 'hunger')).toEqual({ relief: 'full', ticks: 1 });
		expect(attend(body, 'thirst')).toEqual({ relief: 'full', ticks: 1 });
		expect(body.points.hunger).toBe(55);
		expect(body.points.thirst).toBe(55);
		expect(body.stores).toEqual({ meals: 2, drinks: 3 });
	});

	it('falls back to scraps and tap water once the stores run dry', () => {
		const body = fixtures.bodyWithPoints({ hunger: 100, thirst: 100 });
		body.stores = { meals: 0, drinks: 0 };
		expect(attend(body, 'hunger')).toEqual({ relief: 'fallback', ticks: 2 });
		expect(attend(body, 'thirst')).toEqual({ relief: 'fallback', ticks: 2 });
		expect(body.points.hunger).toBe(75);
		expect(body.stores).toEqual({ meals: 0, drinks: 0 });
	});

	it('gives free remedies for cold, fatigue and cramp without touching stores', () => {
		const body = fixtures.bodyWithPoints({ cold: 100, fatigue: 100, cramp: 100 });
		expect(attend(body, 'cold')).toEqual({ relief: 'full', ticks: 1 });
		expect(attend(body, 'fatigue')).toEqual({ relief: 'full', ticks: 3 });
		expect(attend(body, 'cramp')).toEqual({ relief: 'full', ticks: 1 });
		expect([body.points.cold, body.points.fatigue, body.points.cramp]).toEqual([70, 80, 60]);
		expect(body.stores).toEqual({ meals: 3, drinks: 4 });
	});

	it('never takes points below zero', () => {
		const body = fixtures.bodyWithPoints({ cramp: 5 });
		attend(body, 'cramp');
		expect(body.points.cramp).toBe(0);
	});

	it('lets a state interrupt again after relief drops its level', () => {
		const body = fixtures.bodyWithPoints({ cold: 95 });
		resolveInterrupt(body, 'cold');
		attend(body, 'cold'); // 65 points: level 2
		expect(pendingInterrupts(body)).toEqual([]);
		body.points.cold = 90;
		expect(pendingInterrupts(body)).toEqual(['cold']);
	});
});

describe('persistence', () => {
	it('round-trips a body', () => {
		const original = parseBody(fixtures.SAVED_BODY_JSON);
		expect(parseBody(serialiseBody(original))).toEqual(original);
		expect(original.memory).toBe('surfaced');
		expect(original.rates.hunger).toBe(0.5);
	});

	it('does not re-fire announced levels after a reload', () => {
		const body = fixtures.bodyWithPoints({ hunger: 30 });
		resolveInterrupt(body, 'hunger');
		const reloaded = parseBody(serialiseBody(body));
		expect(pendingInterrupts(reloaded)).toEqual([]);
	});

	it('falls back field by field on damaged saves', () => {
		const body = parseBody(fixtures.DAMAGED_BODY_JSON);
		expect(body.points.hunger).toBe(0);
		expect(body.points.thirst).toBe(10);
		expect(body.memory).toBe('dormant');
		expect(body.stores).toEqual({ meals: 3, drinks: 4 });
	});

	it('returns a fresh body for text that is not JSON or not an object', () => {
		expect(parseBody('not json')).toEqual(createBody());
		expect(parseBody('42')).toEqual(createBody());
		expect(parseBody('null')).toEqual(createBody());
	});
});

describe('guards', () => {
	it('accept known names and reject the rest', () => {
		expect(isBodyState('cold')).toBe(true);
		expect(isBodyState('eyes')).toBe(false);
		expect(isBodyAction('write')).toBe(true);
		expect(isBodyAction('sleep')).toBe(false);
		expect(isInterruptSubject('memory')).toBe(true);
		expect(isInterruptSubject('hunger')).toBe(true);
		expect(isInterruptSubject('')).toBe(false);
	});
});
