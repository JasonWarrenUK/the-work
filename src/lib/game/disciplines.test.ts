import { afterEach, describe, expect, it, vi } from 'vitest';
import { DOMAINS, inventory, type Domain } from './ideas.svelte';
import { chairForDomain, committeeChair, getCommitteeChair, lookupDiscipline } from './disciplines';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('lookupDiscipline', () => {
	it('names every pair of domains, in either order', () => {
		for (const a of DOMAINS) {
			for (const b of DOMAINS) {
				if (a === b) continue;
				const discipline = lookupDiscipline(a, b);
				expect(discipline, `${a} and ${b}`).not.toBeNull();
				expect(lookupDiscipline(b, a)).toEqual(discipline);
			}
		}
	});
});

describe('chairForDomain', () => {
	it('follows the chair table, with Morality contested', () => {
		expect(chairForDomain('Faith')).toBe('Cleric');
		for (const domain of ['Truth', 'Nature', 'Art'] as Domain[]) expect(chairForDomain(domain)).toBe('Professor');
		for (const domain of ['Rule', 'Class'] as Domain[]) expect(chairForDomain(domain)).toBe('Bureaucrat');
		expect(chairForDomain('Morality')).toBeNull();
	});
});

describe('committeeChair', () => {
	it('is uncontested when both domains point to the same chair', () => {
		expect(committeeChair(['Truth', 'Nature'])).toBe('Professor');
		expect(committeeChair(['Class', 'Rule'])).toBe('Bureaucrat');
	});

	it('gives the chair to the dominant domain when they differ', () => {
		expect(committeeChair(['Faith', 'Truth'])).toBe('Cleric');
		expect(committeeChair(['Truth', 'Faith'])).toBe('Professor');
	});

	it('lets the other domain decide when one is Morality', () => {
		expect(committeeChair(['Morality', 'Faith'])).toBe('Cleric');
		expect(committeeChair(['Rule', 'Morality'])).toBe('Bureaucrat');
		expect(committeeChair(['Morality', 'Art'])).toBe('Professor');
	});

	it('resolves every possible pair to a chair', () => {
		for (const a of DOMAINS) {
			for (const b of DOMAINS) {
				if (a === b) continue;
				expect(['Cleric', 'Professor', 'Bureaucrat']).toContain(committeeChair([a, b]));
			}
		}
	});
});

describe('getCommitteeChair', () => {
	it('is empty until two domains have written work', () => {
		vi.spyOn(inventory, 'getDominantPair').mockReturnValue(null);
		expect(getCommitteeChair()).toBe('');
	});

	it('uses the dominant pair, dominant domain first', () => {
		vi.spyOn(inventory, 'getDominantPair').mockReturnValue(['Rule', 'Faith']);
		expect(getCommitteeChair()).toBe('Bureaucrat');
	});
});
