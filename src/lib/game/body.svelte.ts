/**
 * Reactive wrapper around the bodily state model (body.ts).
 *
 * Mirrors the `inventory` pattern in ideas.svelte.ts: module-level `$state`
 * plus a plain object of operations, with toJSON/fromJSON for SaveData.
 */

import {
	attend,
	createBody,
	extremeOf,
	levelOf,
	parseBody,
	pendingInterrupts,
	resolveInterrupt,
	serialiseBody,
	setRate,
	tick,
	type AttendResult,
	type BodySnapshot,
	type BodyStateName,
	type InterruptSubject,
	type TickInput
} from './body';

let state: BodySnapshot = $state(createBody());

export const body = {
	/** Advance one time tick. */
	tick(input: TickInput): void {
		tick(state, input);
	},

	level(name: BodyStateName): number {
		return levelOf(state, name);
	},

	extreme(): 'fatigue' | 'cold' | '' {
		return extremeOf(state);
	},

	/** The most pressing interrupts (at most two), most pressing first. */
	interrupts(): InterruptSubject[] {
		return pendingInterrupts(state);
	},

	resolve(subject: InterruptSubject): void {
		resolveInterrupt(state, subject);
	},

	attend(name: BodyStateName): AttendResult {
		return attend(state, name);
	},

	setRate(name: BodyStateName, multiplier: number): void {
		setRate(state, name, multiplier);
	},

	reset(): void {
		state = createBody();
	},

	/** Serialise for SaveData.bodyState. */
	toJSON(): string {
		return serialiseBody(state);
	},

	/** Restore from SaveData.bodyState. Malformed fields fall back to a fresh body's values. */
	fromJSON(json: string): void {
		state = parseBody(json);
	}
};
