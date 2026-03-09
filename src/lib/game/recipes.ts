/**
 * Recipe engine — how ideas produce other ideas.
 *
 * Two recipe types:
 * - Development: dwelling on one idea produces a specific higher-level idea
 * - Combination: two ideas collide to produce a third
 *
 * Recipes are authored, not algorithmic. Discovery is part of the game.
 */

import { getIdeaDef, inventory, DOMAINS, type Domain } from './ideas.svelte';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DevelopmentRecipe {
	sourceId: string;
	resultId: string;
}

export interface CombinationRecipe {
	/** Order-independent pair. Stored sorted alphabetically. */
	inputIds: [string, string];
	resultId: string;
}

// ---------------------------------------------------------------------------
// Recipe registries
// ---------------------------------------------------------------------------

/** sourceId → resultId */
const developmentRecipes = new Map<string, string>();

/** "idA|idB" (sorted) → resultId */
const combinationRecipes = new Map<string, string>();

function comboKey(a: string, b: string): string {
	return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function registerDevelopmentRecipe(recipe: DevelopmentRecipe): void {
	developmentRecipes.set(recipe.sourceId, recipe.resultId);
}

export function registerCombinationRecipe(recipe: CombinationRecipe): void {
	const [a, b] = recipe.inputIds;
	combinationRecipes.set(comboKey(a, b), recipe.resultId);
}

// ---------------------------------------------------------------------------
// Recipe lookup
// ---------------------------------------------------------------------------

/**
 * Attempt to develop an idea by dwelling on it.
 * Returns the result idea ID, or empty string if no recipe exists.
 * Acquires the result idea into inventory automatically.
 */
export function developIdea(sourceId: string): string {
	if (!inventory.has(sourceId)) return '';

	const resultId = developmentRecipes.get(sourceId);
	if (!resultId) return '';

	const resultDef = getIdeaDef(resultId);
	if (!resultDef) return '';

	// Don't produce duplicates
	if (inventory.has(resultId)) return '';

	inventory.acquire(resultId);
	return resultId;
}

/**
 * Attempt to combine two ideas.
 * Returns the result idea ID, or empty string if no recipe exists.
 * Acquires the result idea into inventory automatically.
 */
export function combineIdeas(idA: string, idB: string): string {
	if (!inventory.has(idA) || !inventory.has(idB)) return '';
	if (idA === idB) return '';

	const resultId = combinationRecipes.get(comboKey(idA, idB));
	if (!resultId) return '';

	const resultDef = getIdeaDef(resultId);
	if (!resultDef) return '';

	// Don't produce duplicates
	if (inventory.has(resultId)) return '';

	inventory.acquire(resultId);
	return resultId;
}

/**
 * Get a failure message for a combination that has no recipe.
 */
export function getFailureText(idA: string, idB: string): string {
	const defA = getIdeaDef(idA);
	const defB = getIdeaDef(idB);

	if (!defA || !defB) return 'You hold them together, but nothing catches. Not yet.';

	// Check if they share a concept
	const conceptsA = new Set(Object.keys(defA.concepts) as Domain[]);
	const conceptsB = new Set(Object.keys(defB.concepts) as Domain[]);
	const shared = [...conceptsA].filter((c) => conceptsB.has(c));

	if (shared.length > 0 && shared.length === conceptsA.size && shared.length === conceptsB.size) {
		return "The thoughts are too similar. They don't create friction.";
	}

	// Check level gap
	if (Math.abs(defA.level - defB.level) >= 3) {
		return "One thought overwhelms the other. They can't meet as equals.";
	}

	return "You hold them together, but nothing catches. Not yet.";
}

/**
 * Check if an idea has a development recipe (for UI gating).
 */
export function hasDevelopmentPath(sourceId: string): boolean {
	const resultId = developmentRecipes.get(sourceId);
	if (!resultId) return false;
	// Don't show if already developed
	return !inventory.has(resultId);
}

/**
 * Find a held idea in a domain that can be developed.
 * Returns the idea ID, or empty string if none found.
 * Prefers ideas at lower levels (develop observations before inklings).
 */
export function findDevelopableInDomain(domain: string): string {
	if (!DOMAINS.includes(domain as Domain)) return '';

	const candidates: Array<{ id: string; level: number }> = [];
	for (const id of inventory.heldIds()) {
		const def = getIdeaDef(id);
		if (!def) continue;
		if (!(domain in def.concepts)) continue;
		if (!hasDevelopmentPath(id)) continue;
		candidates.push({ id, level: def.level });
	}

	if (candidates.length === 0) return '';
	// Prefer lowest level — develop observations first
	candidates.sort((a, b) => a.level - b.level);
	return candidates[0].id;
}

/**
 * Check if there's any developable idea in a domain.
 */
export function canDevelopInDomain(domain: string): boolean {
	return findDevelopableInDomain(domain) !== '';
}

/**
 * Try to find a valid combination between ideas in two domains.
 * Returns [idA, idB, resultId] or empty strings if none found.
 */
export function findCombinablePair(domainA: string, domainB: string): [string, string, string] {
	if (!DOMAINS.includes(domainA as Domain) || !DOMAINS.includes(domainB as Domain)) {
		return ['', '', ''];
	}

	const idsA: string[] = [];
	const idsB: string[] = [];

	for (const id of inventory.heldIds()) {
		const def = getIdeaDef(id);
		if (!def) continue;
		if (domainA in def.concepts) idsA.push(id);
		if (domainB in def.concepts) idsB.push(id);
	}

	for (const a of idsA) {
		for (const b of idsB) {
			if (a === b) continue;
			const key = a < b ? `${a}|${b}` : `${b}|${a}`;
			const resultId = combinationRecipes.get(key);
			if (resultId && !inventory.has(resultId)) {
				return [a, b, resultId];
			}
		}
	}

	return ['', '', ''];
}

/**
 * Check if there's any valid combination between ideas in two domains.
 */
export function canCombineDomains(domainA: string, domainB: string): boolean {
	const [, , result] = findCombinablePair(domainA, domainB);
	return result !== '';
}

// ---------------------------------------------------------------------------
// Sample recipes — observation → inkling development paths
// from Ideas.md source mappings
// ---------------------------------------------------------------------------

export function registerAuthoredRecipes(): void {
	// Development recipes: observation → inkling
	// These map the "dev" paths from Ideas.md

	// Rule inklings from development
	registerDevelopmentRecipe({ sourceId: 'O1c', resultId: 'I1' });
	registerDevelopmentRecipe({ sourceId: 'O8c', resultId: 'I1' });
	registerDevelopmentRecipe({ sourceId: 'O20b', resultId: 'I2' });
	registerDevelopmentRecipe({ sourceId: 'O20c', resultId: 'I2' });
	registerDevelopmentRecipe({ sourceId: 'O5b', resultId: 'I3' });
	registerDevelopmentRecipe({ sourceId: 'O5c', resultId: 'I3' });
	registerDevelopmentRecipe({ sourceId: 'O4b', resultId: 'I4' });
	registerDevelopmentRecipe({ sourceId: 'O4c', resultId: 'I4' });
	registerDevelopmentRecipe({ sourceId: 'O1a', resultId: 'I5' });
	registerDevelopmentRecipe({ sourceId: 'O20a', resultId: 'I5' });

	// Faith inklings from development
	registerDevelopmentRecipe({ sourceId: 'O15c', resultId: 'I6' });
	registerDevelopmentRecipe({ sourceId: 'O49c', resultId: 'I7' });
	registerDevelopmentRecipe({ sourceId: 'O23b', resultId: 'I8' });
	registerDevelopmentRecipe({ sourceId: 'O34a', resultId: 'I8' });
	registerDevelopmentRecipe({ sourceId: 'O49a', resultId: 'I9' });
	registerDevelopmentRecipe({ sourceId: 'O14a', resultId: 'I9' });

	// Dread inklings from development
	registerDevelopmentRecipe({ sourceId: 'O44b', resultId: 'I10' });
	registerDevelopmentRecipe({ sourceId: 'O44c', resultId: 'I10' });
	registerDevelopmentRecipe({ sourceId: 'O65b', resultId: 'I10' });
	registerDevelopmentRecipe({ sourceId: 'O65c', resultId: 'I10' });
	registerDevelopmentRecipe({ sourceId: 'O9b', resultId: 'I11' });
	registerDevelopmentRecipe({ sourceId: 'O9c', resultId: 'I11' });
	registerDevelopmentRecipe({ sourceId: 'O58b', resultId: 'I11' });
	registerDevelopmentRecipe({ sourceId: 'O58c', resultId: 'I11' });
	registerDevelopmentRecipe({ sourceId: 'O39c', resultId: 'I12' });
	registerDevelopmentRecipe({ sourceId: 'O36b', resultId: 'I12' });
	registerDevelopmentRecipe({ sourceId: 'O36c', resultId: 'I12' });
	registerDevelopmentRecipe({ sourceId: 'O40c', resultId: 'I13' });

	// Class inklings from development
	registerDevelopmentRecipe({ sourceId: 'O3c', resultId: 'I14' });
	registerDevelopmentRecipe({ sourceId: 'O33c', resultId: 'I14' });
	registerDevelopmentRecipe({ sourceId: 'O57c', resultId: 'I14' });

	// Art inklings from development
	registerDevelopmentRecipe({ sourceId: 'O17b', resultId: 'I16' });
	registerDevelopmentRecipe({ sourceId: 'O13c', resultId: 'I17' });
	registerDevelopmentRecipe({ sourceId: 'O17a', resultId: 'I19' });
	registerDevelopmentRecipe({ sourceId: 'O7a', resultId: 'I19' });

	// Nature inklings from development
	registerDevelopmentRecipe({ sourceId: 'O54b', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O54c', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O56b', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O56c', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O57b', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O57c', resultId: 'I20' });
	registerDevelopmentRecipe({ sourceId: 'O19c', resultId: 'I21' });
	registerDevelopmentRecipe({ sourceId: 'O66b', resultId: 'I21' });
	registerDevelopmentRecipe({ sourceId: 'O66c', resultId: 'I21' });
	registerDevelopmentRecipe({ sourceId: 'O16a', resultId: 'I22' });
	registerDevelopmentRecipe({ sourceId: 'O22a', resultId: 'I22' });

	// Morality inklings from development
	registerDevelopmentRecipe({ sourceId: 'O38c', resultId: 'I23' });
	registerDevelopmentRecipe({ sourceId: 'O21b', resultId: 'I24' });
	registerDevelopmentRecipe({ sourceId: 'O21c', resultId: 'I24' });
	registerDevelopmentRecipe({ sourceId: 'O35b', resultId: 'I24' });
	registerDevelopmentRecipe({ sourceId: 'O35c', resultId: 'I24' });
	registerDevelopmentRecipe({ sourceId: 'O29a', resultId: 'I25' });
	registerDevelopmentRecipe({ sourceId: 'O54a', resultId: 'I25' });

	// Development recipes: inkling → idea
	registerDevelopmentRecipe({ sourceId: 'I1', resultId: 'C1' });
	registerDevelopmentRecipe({ sourceId: 'I4', resultId: 'C1' });
	registerDevelopmentRecipe({ sourceId: 'I3', resultId: 'C3' });
	registerDevelopmentRecipe({ sourceId: 'I5', resultId: 'C2' });
	registerDevelopmentRecipe({ sourceId: 'I6', resultId: 'C4' });
	registerDevelopmentRecipe({ sourceId: 'I8', resultId: 'C5' });
	registerDevelopmentRecipe({ sourceId: 'I9', resultId: 'C5' });
	registerDevelopmentRecipe({ sourceId: 'I14', resultId: 'C6' });
	registerDevelopmentRecipe({ sourceId: 'I34', resultId: 'C6' });
	registerDevelopmentRecipe({ sourceId: 'I15', resultId: 'C7' });
	registerDevelopmentRecipe({ sourceId: 'I16', resultId: 'C8' });
	registerDevelopmentRecipe({ sourceId: 'I17', resultId: 'C8' });
	registerDevelopmentRecipe({ sourceId: 'I19', resultId: 'C9' });
	registerDevelopmentRecipe({ sourceId: 'I21', resultId: 'C10' });
	registerDevelopmentRecipe({ sourceId: 'I22', resultId: 'C11' });
	registerDevelopmentRecipe({ sourceId: 'I38', resultId: 'C11' });
	registerDevelopmentRecipe({ sourceId: 'I23', resultId: 'C12' });
	registerDevelopmentRecipe({ sourceId: 'I24', resultId: 'C12' });
	registerDevelopmentRecipe({ sourceId: 'I25', resultId: 'C13' });
	registerDevelopmentRecipe({ sourceId: 'I10', resultId: 'C15' });
	registerDevelopmentRecipe({ sourceId: 'I12', resultId: 'C15' });
	registerDevelopmentRecipe({ sourceId: 'I11', resultId: 'C16' });
	registerDevelopmentRecipe({ sourceId: 'I13', resultId: 'C16' });

	// Combination recipes: inkling + inkling → idea (cross-domain)
	registerCombinationRecipe({ inputIds: ['I26', 'I27'], resultId: 'C14' });
	registerCombinationRecipe({ inputIds: ['I1', 'I6'], resultId: 'C14' });

	// Combination recipes: observation + observation → inkling
	// These map the "combo" paths from Ideas.md

	registerCombinationRecipe({ inputIds: ['O33a', 'O12b'], resultId: 'I15' });
	registerCombinationRecipe({ inputIds: ['O29a', 'O55a'], resultId: 'I18' });

	// Cross-concept combinations
	registerCombinationRecipe({ inputIds: ['O1b', 'O23a'], resultId: 'I26' });
	registerCombinationRecipe({ inputIds: ['O1b', 'O23b'], resultId: 'I26' });
	registerCombinationRecipe({ inputIds: ['O1c', 'O23a'], resultId: 'I26' });
	registerCombinationRecipe({ inputIds: ['O1c', 'O23b'], resultId: 'I26' });

	registerCombinationRecipe({ inputIds: ['O18a', 'O24c'], resultId: 'I27' });
	registerCombinationRecipe({ inputIds: ['O18b', 'O24c'], resultId: 'I27' });
	registerCombinationRecipe({ inputIds: ['O18c', 'O24c'], resultId: 'I27' });

	registerCombinationRecipe({ inputIds: ['O19b', 'O17b'], resultId: 'I28' });
	registerCombinationRecipe({ inputIds: ['O19b', 'O17c'], resultId: 'I28' });

	registerCombinationRecipe({ inputIds: ['O56b', 'O12b'], resultId: 'I29' });
	registerCombinationRecipe({ inputIds: ['O56b', 'O12c'], resultId: 'I29' });
	registerCombinationRecipe({ inputIds: ['O56c', 'O12b'], resultId: 'I29' });
	registerCombinationRecipe({ inputIds: ['O56c', 'O12c'], resultId: 'I29' });

	registerCombinationRecipe({ inputIds: ['O34c', 'O38a'], resultId: 'I30' });
	registerCombinationRecipe({ inputIds: ['O34c', 'O38b'], resultId: 'I30' });

	registerCombinationRecipe({ inputIds: ['O67b', 'O13b'], resultId: 'I31' });
	registerCombinationRecipe({ inputIds: ['O67b', 'O13c'], resultId: 'I31' });
	registerCombinationRecipe({ inputIds: ['O67c', 'O13b'], resultId: 'I31' });
	registerCombinationRecipe({ inputIds: ['O67c', 'O13c'], resultId: 'I31' });

	registerCombinationRecipe({ inputIds: ['O50c', 'O43b'], resultId: 'I32' });
	registerCombinationRecipe({ inputIds: ['O50c', 'O43c'], resultId: 'I32' });

	registerCombinationRecipe({ inputIds: ['O22c', 'O35a'], resultId: 'I33' });
	registerCombinationRecipe({ inputIds: ['O22c', 'O35b'], resultId: 'I33' });

	registerCombinationRecipe({ inputIds: ['O3b', 'O43b'], resultId: 'I34' });
	registerCombinationRecipe({ inputIds: ['O3b', 'O43c'], resultId: 'I34' });
	registerCombinationRecipe({ inputIds: ['O3c', 'O43b'], resultId: 'I34' });
	registerCombinationRecipe({ inputIds: ['O3c', 'O43c'], resultId: 'I34' });

	registerCombinationRecipe({ inputIds: ['O32c', 'O12b'], resultId: 'I35' });
	registerCombinationRecipe({ inputIds: ['O32c', 'O12c'], resultId: 'I35' });

	registerCombinationRecipe({ inputIds: ['O21b', 'O62b'], resultId: 'I36' });
	registerCombinationRecipe({ inputIds: ['O21b', 'O62c'], resultId: 'I36' });
	registerCombinationRecipe({ inputIds: ['O21c', 'O62b'], resultId: 'I36' });
	registerCombinationRecipe({ inputIds: ['O21c', 'O62c'], resultId: 'I36' });

	registerCombinationRecipe({ inputIds: ['O25c', 'O40b'], resultId: 'I37' });
	registerCombinationRecipe({ inputIds: ['O25c', 'O40c'], resultId: 'I37' });

	registerCombinationRecipe({ inputIds: ['O18b', 'O16b'], resultId: 'I38' });
	registerCombinationRecipe({ inputIds: ['O18b', 'O16c'], resultId: 'I38' });
	registerCombinationRecipe({ inputIds: ['O18c', 'O16b'], resultId: 'I38' });
	registerCombinationRecipe({ inputIds: ['O18c', 'O16c'], resultId: 'I38' });

	registerCombinationRecipe({ inputIds: ['O64c', 'O42c'], resultId: 'I39' });

	registerCombinationRecipe({ inputIds: ['O14c', 'O8b'], resultId: 'I40' });
}
