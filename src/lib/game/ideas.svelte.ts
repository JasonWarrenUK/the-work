/**
 * Idea system — the core gameplay data model.
 *
 * Ideas are the entities of play. Each idea has orthodoxy scores per concept
 * domain. The player accumulates ideas in their mental inventory and
 * selectively writes them into the thesis. The committee evaluates only
 * what's written.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Domain = 'Rule' | 'Faith' | 'Truth' | 'Class' | 'Art' | 'Nature' | 'Morality';
export type DreadType = 'Existential' | 'Academic' | 'Economic';

export const DOMAINS: Domain[] = ['Rule', 'Faith', 'Truth', 'Class', 'Art', 'Nature', 'Morality'];

export interface IdeaDef {
	id: string;
	text: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	/** Orthodoxy scores per domain. Only domains this idea touches are present. */
	concepts: Partial<Record<Domain, number>>;
	/** Dread triggered by acquiring this idea, if any. */
	dread?: DreadType;
	/**
	 * Source idea IDs.
	 * - Empty for observations (sourced from examining objects).
	 * - Single ID for development ("dev" — dwelling on one idea).
	 * - Two IDs for combination ("combo" — colliding two ideas).
	 */
	source: string[];
}

/** An observation prompt — the neutral sensory fact an object presents. */
export interface PromptDef {
	/** Prompt ID, e.g. "P1" */
	id: string;
	/** The object or situation described */
	objectName: string;
	/** The neutral prompt text */
	text: string;
	/** IDs of the 3 reading options (observation ideas) */
	readings: [string, string, string];
	/** Location category */
	location: 'work-area' | 'shelves' | 'kitchenette' | 'bed' | 'bathroom' | 'walls' | 'sensory' | 'bodily' | 'hidden';
}

// ---------------------------------------------------------------------------
// Reactive inventory state
// ---------------------------------------------------------------------------

interface InventoryState {
	/** Set of idea IDs the player has acquired (their mind). */
	held: Set<string>;
	/** Set of idea IDs written into the thesis. */
	written: Set<string>;
	/** Dread counters. */
	dread: Record<DreadType, number>;
}

let state: InventoryState = $state({
	held: new Set(),
	written: new Set(),
	dread: { Existential: 0, Academic: 0, Economic: 0 }
});

// ---------------------------------------------------------------------------
// Catalog (populated by catalog module)
// ---------------------------------------------------------------------------

const ideaCatalog = new Map<string, IdeaDef>();
const promptCatalog = new Map<string, PromptDef>();

export function registerIdea(def: IdeaDef): void {
	ideaCatalog.set(def.id, def);
}

export function registerPrompt(def: PromptDef): void {
	promptCatalog.set(def.id, def);
}

export function getIdeaDef(id: string): IdeaDef | undefined {
	return ideaCatalog.get(id);
}

export function getPromptDef(id: string): PromptDef | undefined {
	return promptCatalog.get(id);
}

export function getAllPrompts(): PromptDef[] {
	return Array.from(promptCatalog.values());
}

// ---------------------------------------------------------------------------
// Inventory operations
// ---------------------------------------------------------------------------

export const inventory = {
	/** Acquire an idea. Returns the idea's text, or empty string if unknown. */
	acquire(id: string): string {
		const def = ideaCatalog.get(id);
		if (!def) {
			console.warn(`Unknown idea: ${id}`);
			return '';
		}
		state.held.add(id);
		if (def.dread) {
			state.dread[def.dread] += 1;
		}
		return def.text;
	},

	/** Check if the player holds an idea. */
	has(id: string): boolean {
		return state.held.has(id);
	},

	/** Write an idea into the thesis. Must already be held. */
	write(id: string): boolean {
		if (!state.held.has(id)) return false;
		const def = ideaCatalog.get(id);
		if (!def || def.level < 3) return false;
		state.written.add(id);
		return true;
	},

	/** Check if an idea has been written. */
	isWritten(id: string): boolean {
		return state.written.has(id);
	},

	/** Get all held idea IDs. */
	heldIds(): string[] {
		return Array.from(state.held);
	},

	/** Get all written idea IDs. */
	writtenIds(): string[] {
		return Array.from(state.written);
	},

	/** Get held ideas as full definitions. */
	heldIdeas(): IdeaDef[] {
		return this.heldIds()
			.map((id) => ideaCatalog.get(id))
			.filter((d): d is IdeaDef => d !== undefined);
	},

	/** Get written ideas as full definitions. */
	writtenIdeas(): IdeaDef[] {
		return this.writtenIds()
			.map((id) => ideaCatalog.get(id))
			.filter((d): d is IdeaDef => d !== undefined);
	},

	/** Get held ideas that are writable (level >= 3 and not yet written). */
	writableIdeas(): IdeaDef[] {
		return this.heldIdeas().filter((d) => d.level >= 3 && !state.written.has(d.id));
	},

	/**
	 * Highest idea level the player holds in a given domain.
	 * Returns 0 if the player has no ideas touching that domain.
	 */
	getHighestLevel(domain: Domain): number {
		let max = 0;
		for (const id of state.held) {
			const def = ideaCatalog.get(id);
			if (def && domain in def.concepts && def.level > max) {
				max = def.level;
			}
		}
		return max;
	},

	/**
	 * Highest written idea level in a given domain.
	 */
	getWrittenLevel(domain: Domain): number {
		let max = 0;
		for (const id of state.written) {
			const def = ideaCatalog.get(id);
			if (def && domain in def.concepts && def.level > max) {
				max = def.level;
			}
		}
		return max;
	},

	/**
	 * Aggregate orthodoxy for a domain across all written ideas.
	 * Returns the average score weighted by idea level.
	 */
	getWrittenOrthodoxy(domain: Domain): number {
		let totalScore = 0;
		let totalWeight = 0;
		for (const id of state.written) {
			const def = ideaCatalog.get(id);
			if (def && domain in def.concepts) {
				const score = def.concepts[domain]!;
				const weight = def.level;
				totalScore += score * weight;
				totalWeight += weight;
			}
		}
		return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
	},

	/**
	 * Full orthodoxy profile of the thesis — all domains that appear in written ideas.
	 */
	getThesisProfile(): Partial<Record<Domain, number>> {
		const profile: Partial<Record<Domain, number>> = {};
		for (const domain of DOMAINS) {
			const level = this.getWrittenLevel(domain);
			if (level > 0) {
				profile[domain] = this.getWrittenOrthodoxy(domain);
			}
		}
		return profile;
	},

	/**
	 * Get the two dominant domains in the thesis (by highest written level,
	 * tie-broken by number of written ideas in that domain).
	 */
	getDominantPair(): [Domain, Domain] | null {
		const domainScores: Array<{ domain: Domain; level: number; count: number }> = [];
		for (const domain of DOMAINS) {
			const level = this.getWrittenLevel(domain);
			if (level > 0) {
				let count = 0;
				for (const id of state.written) {
					const def = ideaCatalog.get(id);
					if (def && domain in def.concepts) count++;
				}
				domainScores.push({ domain, level, count });
			}
		}
		domainScores.sort((a, b) => b.level - a.level || b.count - a.count);
		if (domainScores.length < 2) return null;
		return [domainScores[0].domain, domainScores[1].domain];
	},

	/** Dread values. */
	getDread(type: DreadType): number {
		return state.dread[type];
	},

	getTotalDread(): number {
		return state.dread.Existential + state.dread.Academic + state.dread.Economic;
	},

	/** Reset all state (for new game). */
	reset(): void {
		state.held = new Set();
		state.written = new Set();
		state.dread = { Existential: 0, Academic: 0, Economic: 0 };
	},

	/** Serialise inventory for save/load. */
	toJSON(): string {
		return JSON.stringify({
			held: Array.from(state.held),
			written: Array.from(state.written),
			dread: state.dread
		});
	},

	/** Restore inventory from saved JSON. */
	fromJSON(json: string): void {
		const data = JSON.parse(json);
		state.held = new Set(data.held);
		state.written = new Set(data.written);
		state.dread = data.dread;
	}
};
