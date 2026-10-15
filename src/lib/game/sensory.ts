/**
 * Timed sensory events: the world intruding on the Writer between actions.
 *
 * Each hour of the night may own one sensory prompt (design/Objects.md,
 * section G). The Ink side (`story/Sensory.ink`) asks which prompt the
 * current hour owns, prints it once that hour and offers its readings like
 * any other observation. Which hours fire is data here; when they fire and
 * what the player sees is Ink's job, so the timing state lives in Ink
 * variables and is saved with the story.
 *
 * Random events (section H) and the per-hour variant tables that lack
 * catalogue readings are not wired yet.
 */

import type { Story } from 'inkjs';
import { getPromptDef, inventory } from '$lib/game/ideas.svelte';

/** The prompt each hour fires, by TimeNumber (7 = 7pm, 12 = midnight, 19 = 7am). */
export const SENSORY_SLOTS: Readonly<Record<number, string>> = {
	9: 'P50', // Rain
	12: 'P49', // Church bells
	14: 'P52', // Gas lamp dims
	15: 'P51', // Distant artillery
	19: 'P53' // Dawn light
};

/** The prompt id owned by an hour, or '' when the hour has none. */
export function sensoryPromptAt(hour: number): string {
	return SENSORY_SLOTS[hour] ?? '';
}

/** The neutral sensory line a prompt presents, or '' for an unknown prompt. */
export function sensoryText(promptId: string): string {
	return getPromptDef(promptId)?.text ?? '';
}

/**
 * The index-th reading of a prompt, offered until the player holds one of
 * them (the same rule as the body readings). '' when out of range, unknown
 * or already taken.
 */
export function sensoryReading(promptId: string, index: number): string {
	const prompt = getPromptDef(promptId);
	if (!prompt || prompt.readings.some((id) => inventory.has(id))) return '';
	return index >= 0 && index < prompt.readings.length ? prompt.readings[index] : '';
}

/**
 * Bind the sensory external functions to an Ink story instance.
 * Safe to call on a story compiled without `Sensory.ink`: a binding is
 * skipped when the story does not declare it.
 */
export function bindSensoryFunctions(ink: Story): void {
	const bindings: Array<{ name: string; fn: (...args: unknown[]) => unknown }> = [
		{
			name: 'sensory_prompt',
			fn: (...args: unknown[]): string => sensoryPromptAt(Number(args[0]))
		},
		{
			name: 'sensory_text',
			fn: (...args: unknown[]): string => sensoryText(String(args[0]))
		},
		{
			name: 'sensory_reading',
			fn: (...args: unknown[]): string => sensoryReading(String(args[0]), Number(args[1]))
		}
	];

	for (const { name, fn } of bindings) {
		try {
			ink.BindExternalFunction(name, fn);
		} catch {
			// Function not declared in this build of the story: safe to ignore
		}
	}
}
