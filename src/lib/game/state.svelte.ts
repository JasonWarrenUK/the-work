import { story } from '$lib/engine/story.svelte';

/**
 * Reactive game state derived from ink variables.
 * Read-only view — mutations happen through ink choices.
 */
export function getGameState() {
	return {
		get timeName(): string {
			return (story.getVariable('TimeName') as string) ?? '';
		},
		get timeDesc(): string {
			return (story.getVariable('TimeDesc') as string) ?? '';
		},
		get convictionScore(): number {
			return (story.getVariable('ConvictionScore') as number) ?? 5;
		},
		get convictionDesc(): string {
			return (story.getVariable('ConvictionDesc') as string) ?? '';
		},
		get theWork(): string {
			return (story.getVariable('TheWork') as string) ?? '';
		},
		get thoughtZenith(): number {
			return (story.getVariable('ThoughtZenith') as number) ?? 0;
		}
	};
}
