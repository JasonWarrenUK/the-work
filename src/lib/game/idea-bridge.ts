/**
 * Bridge between Ink story and the TypeScript idea system.
 *
 * Binds external functions that Ink can call to interact with the
 * idea inventory, recipe engine, and orthodoxy calculations.
 *
 * Ink external functions can only return strings or numbers,
 * so the API is designed around that constraint.
 */

import type { Story } from 'inkjs';
import { inventory, getIdeaDef, DOMAINS, type Domain } from '$lib/game/ideas';
import {
	developIdea,
	combineIdeas,
	getFailureText,
	hasDevelopmentPath,
	findDevelopableInDomain,
	canDevelopInDomain,
	findCombinablePair
} from '$lib/game/recipes';

function s(v: unknown): string {
	return String(v);
}

/**
 * Bind all idea-system external functions to an Ink story instance.
 * Call this after the story is loaded but before continuing.
 *
 * Each function is wrapped in a try/catch so that stories compiled
 * without the EXTERNAL declarations don't crash.
 */
export function bindIdeaFunctions(ink: Story): void {
	const bindings: Array<{ name: string; fn: (...args: unknown[]) => unknown }> = [
		{
			name: 'acquire_idea',
			fn: (...args: unknown[]): string => inventory.acquire(s(args[0]))
		},
		{
			name: 'has_idea',
			fn: (...args: unknown[]): number => inventory.has(s(args[0])) ? 1 : 0
		},
		{
			name: 'get_idea_text',
			fn: (...args: unknown[]): string => {
				const def = getIdeaDef(s(args[0]));
				return def ? def.text : '';
			}
		},
		{
			name: 'get_idea_level',
			fn: (...args: unknown[]): number => {
				const def = getIdeaDef(s(args[0]));
				return def ? def.level : 0;
			}
		},
		{
			name: 'get_domain_level',
			fn: (...args: unknown[]): number => {
				const domain = s(args[0]);
				if (!DOMAINS.includes(domain as Domain)) return 0;
				return inventory.getHighestLevel(domain as Domain);
			}
		},
		{
			name: 'get_written_level',
			fn: (...args: unknown[]): number => {
				const domain = s(args[0]);
				if (!DOMAINS.includes(domain as Domain)) return 0;
				return inventory.getWrittenLevel(domain as Domain);
			}
		},
		{
			name: 'develop_idea',
			fn: (...args: unknown[]): string => developIdea(s(args[0]))
		},
		{
			name: 'can_develop',
			fn: (...args: unknown[]): number => hasDevelopmentPath(s(args[0])) ? 1 : 0
		},
		{
			name: 'combine_ideas',
			fn: (...args: unknown[]): string => combineIdeas(s(args[0]), s(args[1]))
		},
		{
			name: 'get_combine_failure',
			fn: (...args: unknown[]): string => getFailureText(s(args[0]), s(args[1]))
		},
		{
			name: 'write_idea',
			fn: (...args: unknown[]): number => inventory.write(s(args[0])) ? 1 : 0
		},
		{
			name: 'is_idea_written',
			fn: (...args: unknown[]): number => inventory.isWritten(s(args[0])) ? 1 : 0
		},
		{
			name: 'get_written_orthodoxy',
			fn: (...args: unknown[]): number => {
				const domain = s(args[0]);
				if (!DOMAINS.includes(domain as Domain)) return 0;
				return inventory.getWrittenOrthodoxy(domain as Domain);
			}
		},
		{
			name: 'get_dread',
			fn: (...args: unknown[]): number => {
				const type = s(args[0]);
				if (type === 'Existential') return inventory.getDread('Existential');
				if (type === 'Academic') return inventory.getDread('Academic');
				if (type === 'Economic') return inventory.getDread('Economic');
				return 0;
			}
		},
		{
			name: 'get_total_dread',
			fn: (): number => inventory.getTotalDread()
		},
		{
			name: 'find_developable',
			fn: (...args: unknown[]): string => findDevelopableInDomain(s(args[0]))
		},
		{
			name: 'can_develop_domain',
			fn: (...args: unknown[]): number => canDevelopInDomain(s(args[0])) ? 1 : 0
		},
		{
			name: 'develop_in_domain',
			fn: (...args: unknown[]): string => {
				const id = findDevelopableInDomain(s(args[0]));
				if (!id) return '';
				return developIdea(id);
			}
		},
		{
			name: 'writable_idea_at',
			fn: (...args: unknown[]): string => {
				const index = Number(args[0]);
				const writable = inventory.writableIdeas();
				return index >= 0 && index < writable.length ? writable[index].id : '';
			}
		},
		{
			name: 'writable_idea_count',
			fn: (): number => inventory.writableIdeas().length
		},
		{
			name: 'combine_domains',
			fn: (...args: unknown[]): string => {
				const [idA, idB] = findCombinablePair(s(args[0]), s(args[1]));
				if (!idA || !idB) return '';
				return combineIdeas(idA, idB);
			}
		}
	];

	for (const { name, fn } of bindings) {
		try {
			ink.BindExternalFunction(name, fn);
		} catch {
			// Function not declared in this build of the story — safe to ignore
		}
	}
}
