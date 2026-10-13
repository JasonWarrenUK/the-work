import { describe, expect, it } from 'vitest';
import { processTags } from './tags';

describe('processTags', () => {
	it('returns an empty result for no tags', () => {
		expect(processTags([])).toEqual({ clear: false, classes: [], mood: null });
	});

	it('reads a mood tag', () => {
		expect(processTags(['mood:textual']).mood).toBe('textual');
	});

	it('trims whitespace around tags and values', () => {
		expect(processTags(['  mood: tense  ']).mood).toBe('tense');
	});

	it('flags CLEAR', () => {
		expect(processTags(['CLEAR']).clear).toBe(true);
	});

	it('collects class tags and bare tags as classes', () => {
		expect(processTags(['class:italic', 'dim']).classes).toEqual(['italic', 'dim']);
	});

	it('does not treat a mood tag as a class', () => {
		expect(processTags(['mood:calm']).classes).toEqual([]);
	});
});
