/**
 * Discipline system — maps domain pairs to named academic disciplines.
 *
 * A discipline is the field of study that emerges from the Writer's thesis.
 * It is always defined by a pair of domains: the two strongest domains in
 * the written work determine the dominant discipline.
 *
 * Each discipline has an official name (used by the committee) and a private
 * name (the Writer's internal recognition, revealed only at the ending).
 */

import { inventory, type Domain } from '$lib/game/ideas.svelte';

export interface Discipline {
	official: string;
	private: string;
}

/**
 * Lookup table keyed by alphabetically-sorted domain pair (e.g. "Art,Class").
 * Order-insensitive: always sort before looking up.
 */
const DISCIPLINE_TABLE: Record<string, Discipline> = {
	'Art,Class': { official: 'Cultural Economy', private: 'The Price of Something Beautiful' },
	'Art,Faith': { official: 'Sacred Aesthetics', private: 'The Colour of a Hymn No One Believes' },
	'Art,Morality': { official: 'Ethical Aesthetics', private: 'The Poem That Knows What You Should Have Done' },
	'Art,Nature': { official: 'Aesthetic Naturalism', private: "The Painting the Moth Doesn't Know It's Sitting In" },
	'Art,Rule': { official: 'Civil Rhetoric', private: 'The Grammar of Permitted Beauty' },
	'Art,Truth': { official: 'Rhetoric and Letters', private: 'The Truth That Only Metaphors Can Carry' },
	'Class,Faith': { official: 'Ecclesiology', private: 'The Wealth of the Meek' },
	'Class,Morality': { official: 'Social Philosophy', private: 'The Ethics of Being Cold While They Are Warm' },
	'Class,Nature': { official: 'Agricultural Philosophy', private: "The Soil That Doesn't Know It Was Nationalised" },
	'Class,Rule': { official: 'Political Economy', private: 'The Arithmetic of Who Keeps What' },
	'Class,Truth': { official: 'Sociology of Knowledge', private: 'The Catalogue of Who Gets to Think' },
	'Faith,Morality': { official: 'Moral Theology', private: 'The Conscience That Belongs to Everyone Else' },
	'Faith,Nature': { official: 'Natural Theology', private: 'The God Buried in the Specimen Jar' },
	'Faith,Rule': { official: 'Political Theology', private: 'The Doctrine of Obedient Bells' },
	'Faith,Truth': { official: 'Scholastic Philosophy', private: "The Argument God Makes When He Isn't Listening" },
	'Morality,Nature': { official: 'Natural Ethics', private: "The Conscience That Doesn't Need Permission" },
	'Morality,Rule': { official: 'Moral Governance', private: 'The Shape of Duty When Nobody Believes' },
	'Morality,Truth': { official: 'Moral Philosophy', private: 'The Argument You Have With Yourself at Four in the Morning' },
	'Nature,Rule': { official: 'Administrative Natural Philosophy', private: 'The Republic of Measurable Things' },
	'Nature,Truth': { official: 'Natural Philosophy', private: 'The Weight of Everything Visible' },
	'Rule,Truth': { official: 'Jurisprudence', private: 'The Architecture of Approved Conclusions' },
};

/**
 * Look up the discipline for an arbitrary domain pair.
 * Order-insensitive.
 */
export function lookupDiscipline(a: Domain, b: Domain): Discipline | null {
	const key = [a, b].sort().join(',');
	return DISCIPLINE_TABLE[key] ?? null;
}

/**
 * Get the dominant discipline based on the player's current written work.
 * Returns null if fewer than two domains have written ideas.
 */
export function getDiscipline(): Discipline | null {
	const pair = inventory.getDominantPair();
	if (!pair) return null;
	return lookupDiscipline(pair[0], pair[1]);
}

/**
 * Get the official (institutional) name of the dominant discipline.
 * Returns empty string if no discipline has emerged yet.
 */
export function getDisciplineOfficial(): string {
	return getDiscipline()?.official ?? '';
}

/**
 * Get the private (Writer's internal) name of the dominant discipline.
 * Returns empty string if no discipline has emerged yet.
 */
export function getDisciplinePrivate(): string {
	return getDiscipline()?.private ?? '';
}
