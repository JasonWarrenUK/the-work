import { beforeEach, describe, expect, it } from 'vitest';
import { registerAllIdeas } from './idea-catalog';
import { getPromptDef, inventory } from './ideas.svelte';
import { SENSORY_SLOTS, sensoryPromptAt, sensoryReading, sensoryText } from './sensory';

beforeEach(() => {
	registerAllIdeas();
	inventory.reset();
});

describe('sensoryPromptAt', () => {
	it('names a catalogued sensory prompt for every slot', () => {
		for (const [hour, promptId] of Object.entries(SENSORY_SLOTS)) {
			expect(sensoryPromptAt(Number(hour))).toBe(promptId);
			expect(getPromptDef(promptId)?.location).toBe('sensory');
		}
	});

	it('is empty for an hour without an event', () => {
		expect(sensoryPromptAt(8)).toBe('');
		expect(sensoryPromptAt(13)).toBe('');
	});
});

describe('sensoryText', () => {
	it('presents the neutral prompt line', () => {
		expect(sensoryText('P49')).toBe('Bells. Midnight.');
		expect(sensoryText('P99')).toBe('');
	});
});

describe('sensoryReading', () => {
	it('offers each reading in order and nothing out of range', () => {
		expect([0, 1, 2].map((index) => sensoryReading('P50', index))).toEqual(['O50a', 'O50b', 'O50c']);
		expect(sensoryReading('P50', 3)).toBe('');
		expect(sensoryReading('P50', -1)).toBe('');
	});

	it('withdraws every reading once one of them is held', () => {
		inventory.acquire('O50b');
		expect([0, 1, 2].map((index) => sensoryReading('P50', index))).toEqual(['', '', '']);
		expect(sensoryReading('P49', 0)).toBe('O49a');
	});

	it('is empty for an unknown prompt', () => {
		expect(sensoryReading('P99', 0)).toBe('');
	});
});
