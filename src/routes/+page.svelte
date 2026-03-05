<script lang="ts">
	import { onMount } from 'svelte';
	import { story, loadStory } from '$lib/engine/story.svelte';
	import Passage from '$lib/components/Passage.svelte';
	import ChoiceList from '$lib/components/ChoiceList.svelte';

	let paragraphs: string[] = $state([]);
	let choices: Array<{ index: number; text: string }> = $state([]);
	let loading = $state(true);

	onMount(async () => {
		await loadStory('/The Work.json');
		loading = false;
		continueStory();
	});

	function continueStory() {
		const result = story.continue();
		paragraphs = result.paragraphs;
		choices = result.choices;
	}

	function selectChoice(index: number) {
		story.choose(index);
		continueStory();
	}
</script>

<div id="story" role="log" aria-live="polite" aria-label="Story text">
	{#if loading}
		<p class="loading">Loading...</p>
	{:else}
		<Passage {paragraphs} />
		<ChoiceList {choices} onSelect={selectChoice} />
	{/if}
</div>

<style>
	#story {
		position: relative;
		margin: 0 auto;
		width: var(--measure);
		max-width: 80vw;
		padding: var(--space-lg) var(--space-md);
		min-height: 100vh;
	}

	#story :global(> *:first-child) {
		margin-top: 10vh;
	}

	#story :global(> *:last-child) {
		margin-bottom: 15vh;
	}

	.loading {
		color: var(--text-dim);
		font-style: italic;
		margin-top: 10vh;
	}
</style>
