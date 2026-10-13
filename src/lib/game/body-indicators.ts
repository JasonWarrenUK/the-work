/**
 * Display data for the status bar's bodily-state and dread indicators.
 *
 * Pure functions over the numbers the game already tracks, so the chips the
 * StatusBar shows are testable without a component.
 */

import { BODY_STATES, MAX_LEVEL, type BodyStateName } from './body';

export interface BodyChip {
	state: BodyStateName;
	/** 1 to MAX_LEVEL; level 0 states are not shown. */
	level: number;
	/** Filled and empty dots, one per level, e.g. `●●○`. */
	dots: string;
	/** Screen-reader text, e.g. `hunger, level 2 of 3`. */
	label: string;
}

/** Dread thresholds the story itself reacts to (see `Tunnels.ink`): 3 makes writing harder, 6 shakes the hand. */
export const DREAD_UNEASY = 3;
export const DREAD_SEVERE = 6;

export type DreadTier = 'none' | 'low' | 'uneasy' | 'severe';

export interface DreadChip {
	total: number;
	tier: DreadTier;
	label: string;
}

/** One chip per bodily state at level 1 or above, in roster order. */
export function bodyChips(levels: Record<BodyStateName, number>): BodyChip[] {
	const chips: BodyChip[] = [];
	for (const state of BODY_STATES) {
		const level = Math.max(0, Math.min(MAX_LEVEL, Math.floor(levels[state] ?? 0)));
		if (level === 0) continue;
		chips.push({
			state,
			level,
			dots: '●'.repeat(level) + '○'.repeat(MAX_LEVEL - level),
			label: `${state}, level ${level} of ${MAX_LEVEL}`
		});
	}
	return chips;
}

/** The dread chip for a total; tier `none` means nothing to show. */
export function dreadChip(total: number): DreadChip {
	const clamped = Math.max(0, Math.floor(total));
	const tier: DreadTier =
		clamped === 0 ? 'none' : clamped >= DREAD_SEVERE ? 'severe' : clamped >= DREAD_UNEASY ? 'uneasy' : 'low';
	return { total: clamped, tier, label: `dread ${clamped}` };
}
