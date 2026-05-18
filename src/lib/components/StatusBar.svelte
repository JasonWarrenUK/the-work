<script lang="ts">
	import { fade } from 'svelte/transition';
	import { story } from '$lib/engine/story.svelte';
	import { getDisciplineOfficial } from '$lib/game/disciplines';
	import { inventory } from '$lib/game/ideas.svelte';

	let { onOpenThesis }: { onOpenThesis: () => void } = $props();

	// Reading story.tick inside $derived ensures these re-evaluate after each continue()
	let timeName = $derived((() => { story.tick; return (story.getVariable('TimeName') as string) ?? ''; })());
	let convictionDesc = $derived((() => { story.tick; return (story.getVariable('ConvictionDesc') as string) ?? ''; })());
	let discipline = $derived((() => { story.tick; return getDisciplineOfficial(); })());
	let writtenCount = $derived((() => { story.tick; return inventory.writtenIds().length; })());
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
		<button class="thesis-btn" onclick={onOpenThesis} aria-label="View thesis summary">
			{#if writtenCount > 0}
				<span class="thesis-count">{writtenCount}</span>
			{/if}
			<span class="thesis-glyph">⁋</span>
		</button>
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

	.thesis-btn {
		pointer-events: auto;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.25em;
		padding: 0;
		color: var(--text);
		opacity: 0.5;
		transition: opacity 0.2s ease;
		font-family: var(--font-ui);
		font-size: 0.8125rem;
	}

	.thesis-btn:hover,
	.thesis-btn:focus-visible {
		opacity: 1;
	}

	.thesis-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.thesis-count {
		font-variant-numeric: tabular-nums;
	}

	.thesis-glyph {
		font-size: 1rem;
		line-height: 1;
	}
</style>
