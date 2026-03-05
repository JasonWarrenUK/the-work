<script lang="ts">
	import { fade } from 'svelte/transition';
	import { story } from '$lib/engine/story.svelte';

	let timeName = $derived((story.getVariable('TimeName') as string) ?? '');
	let convictionDesc = $derived((story.getVariable('ConvictionDesc') as string) ?? '');
</script>

{#if timeName || convictionDesc}
	<aside class="status-bar" transition:fade={{ duration: 300 }} aria-label="Game status">
		{#if timeName}
			<span class="time">{timeName}</span>
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
		padding: var(--space-sm) var(--space-lg);
		font-family: var(--font-ui, system-ui, sans-serif);
		font-size: 0.75rem;
		color: var(--text-dim);
		pointer-events: none;
		z-index: 100;
	}

	.time {
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.conviction {
		font-style: italic;
	}
</style>
