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
import { inventory, getIdeaDef, getPromptDef, DOMAINS, type Domain } from '$lib/game/ideas.svelte';
import { getCommitteeChair, getDisciplineOfficial, getDisciplinePrivate } from '$lib/game/disciplines';
import { body } from '$lib/game/body.svelte';
import { PROMPT_FOR, isBodyAction, isBodyState, isInterruptSubject } from '$lib/game/body';
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
			name: 'get_discipline',
			fn: (): string => getDisciplineOfficial()
		},
		{
			name: 'get_discipline_private',
			fn: (): string => getDisciplinePrivate()
		},
		{
			name: 'get_chair',
			fn: (): string => getCommitteeChair()
		},
		{
			name: 'combine_domains',
			fn: (...args: unknown[]): string => {
				const [idA, idB] = findCombinablePair(s(args[0]), s(args[1]));
				if (!idA || !idB) return '';
				return combineIdeas(idA, idB);
			}
		},
		// Catalogue prompts, for Ink that offers a prompt's readings without authoring them inline
		{
			name: 'prompt_text',
			fn: (...args: unknown[]): string => getPromptDef(s(args[0]))?.text ?? ''
		},
		{
			name: 'prompt_reading',
			fn: (...args: unknown[]): string => {
				// A prompt's readings, offered until the player holds one of them
				const prompt = getPromptDef(s(args[0]));
				if (!prompt || prompt.readings.some((id) => inventory.has(id))) return '';
				const index = Number(args[1]);
				return index >= 0 && index < prompt.readings.length ? prompt.readings[index] : '';
			}
		},
		// Bodily states (body.svelte.ts). Unknown names from Ink are ignored.
		{
			name: 'body_tick',
			fn: (...args: unknown[]): number => {
				const action = s(args[0]);
				body.tick({
					action: isBodyAction(action) ? action : 'idle',
					hour: Number(args[1]),
					totalDread: inventory.getTotalDread()
				});
				return 0;
			}
		},
		{
			name: 'body_level',
			fn: (...args: unknown[]): number => {
				const name = s(args[0]);
				return isBodyState(name) ? body.level(name) : 0;
			}
		},
		{
			name: 'body_extreme',
			fn: (): string => body.extreme()
		},
		{
			name: 'body_interrupt',
			fn: (...args: unknown[]): string => body.interrupts()[Number(args[0])] ?? ''
		},
		{
			name: 'body_resolve',
			fn: (...args: unknown[]): number => {
				const subject = s(args[0]);
				if (isInterruptSubject(subject)) body.resolve(subject);
				return 0;
			}
		},
		{
			name: 'body_attend',
			fn: (...args: unknown[]): number => {
				// Returns the tick cost; Ink advances time that many times
				const name = s(args[0]);
				return isBodyState(name) ? body.attend(name).ticks : 0;
			}
		},
		{
			name: 'body_reading',
			fn: (...args: unknown[]): string => {
				// A subject's P54–P58 readings, offered until the player holds one of them
				const subject = s(args[0]);
				if (!isInterruptSubject(subject)) return '';
				const prompt = getPromptDef(PROMPT_FOR[subject]);
				if (!prompt || prompt.readings.some((id) => inventory.has(id))) return '';
				const index = Number(args[1]);
				return index >= 0 && index < prompt.readings.length ? prompt.readings[index] : '';
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
