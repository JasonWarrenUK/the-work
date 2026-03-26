<script lang="ts">
	import { fade } from 'svelte/transition';
	import { story } from '$lib/engine/story.svelte';
	import { getDisciplineOfficial } from '$lib/game/disciplines';

	// Reading story.tick inside $derived ensures these re-evaluate after each continue()
	let timeName = $derived((() => { story.tick; return (story.getVariable('TimeName') as string) ?? ''; })());
	let convictionDesc = $derived((() => { story.tick; return (story.getVariable('ConvictionDesc') as string) ?? ''; })());
	let discipline = $derived((() => { story.tick; return getDisciplineOfficial(); })());
</script>

{#if timeName || discipline || convictionDesc}
	<aside class="status-bar" transition:fade={{ duration: 300 }} aria-label="Game status">
		{#if timeName}
			<span class="time">{timeName}</span>
		{/if}
		{#if discipline}
			<span class="discipline">{discipline}</span>
		{/if}
		{#if convictionDesc}
			<span class="conviction">{convictionDesc}</span>
		{/if}
	</aside>
{/if}

<style>
	.status-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-md) var(--space-lg);
		font-family: var(--font-ui, system-ui, sans-serif);
		font-size: 0.8125rem;
		color: var(--text);
		opacity: 0.65;
		pointer-events: none;
		z-index: 100;
	}

	.time {
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.discipline {
		font-variant: small-caps;
		letter-spacing: 0.05em;
	}

	.conviction {
		font-style: italic;
	}
</style>
