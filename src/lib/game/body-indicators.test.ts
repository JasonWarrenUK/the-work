import { describe, expect, it } from 'vitest';
import { bodyChips, dreadChip } from './body-indicators';
import type { BodyStateName } from './body';

const levels = (overrides: Partial<Record<BodyStateName, number>> = {}): Record<BodyStateName, number> => ({
	hunger: 0,
	thirst: 0,
	cold: 0,
	fatigue: 0,
	cramp: 0,
	...overrides
});

describe('bodyChips', () => {
	it('shows nothing for a fresh body', () => {
		expect(bodyChips(levels())).toEqual([]);
	});

	it('shows one chip per state at level 1 or above, in roster order', () => {
		const chips = bodyChips(levels({ fatigue: 1, hunger: 2 }));
		expect(chips.map((c) => c.state)).toEqual(['hunger', 'fatigue']);
		expect(chips[0]).toEqual({ state: 'hunger', level: 2, dots: '●●○', label: 'hunger, level 2 of 3' });
		expect(chips[1].dots).toBe('●○○');
	});

	it('caps at the maximum level and ignores fractions', () => {
		expect(bodyChips(levels({ cold: 7 }))[0].dots).toBe('●●●');
		expect(bodyChips(levels({ cramp: 1.9 }))[0].level).toBe(1);
	});
});

describe('dreadChip', () => {
	it('is none at zero', () => {
		expect(dreadChip(0)).toEqual({ total: 0, tier: 'none', label: 'dread 0' });
	});

	it('steps through the tiers the story reacts to', () => {
		expect(dreadChip(1).tier).toBe('low');
		expect(dreadChip(2).tier).toBe('low');
		expect(dreadChip(3).tier).toBe('uneasy');
		expect(dreadChip(5).tier).toBe('uneasy');
		expect(dreadChip(6).tier).toBe('severe');
		expect(dreadChip(9).label).toBe('dread 9');
	});
});
