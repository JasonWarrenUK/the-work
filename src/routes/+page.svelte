<script lang="ts">
	import { onMount } from 'svelte';
	import { story, loadStory } from '$lib/engine/story.svelte';
	import { autosave, loadAutosave, hasAutosave } from '$lib/game/save-load';
	import Passage from '$lib/components/Passage.svelte';
	import ChoiceList from '$lib/components/ChoiceList.svelte';

	let paragraphs: string[] = $state([]);
	let choices: Array<{ index: number; text: string }> = $state([]);
	let loading = $state(true);
	let ended = $state(false);

	onMount(async () => {
		await loadStory('/The Work.json');

		// Restore autosave if available
		if (hasAutosave()) {
			const save = loadAutosave();
			if (save) {
				try {
					story.loadState(save.storyState);
				} catch {
					// Corrupted save — start fresh
				}
			}
		}

		loading = false;
		continueStory();
	});

	function continueStory() {
		const result = story.continue();
		paragraphs = result.paragraphs;
		choices = result.choices;
		ended = !story.canContinue && choices.length === 0;

		// Autosave after each passage
		try {
			autosave(story.saveState());
		} catch {
			// Silently fail — don't break gameplay
		}
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

		{#if choices.length > 0}
			<ChoiceList {choices} onSelect={selectChoice} />
		{:else if ended}
			<p class="ended">The end.</p>
		{/if}
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

	.loading,
	.ended {
		color: var(--text-dim);
		font-style: italic;
		margin-top: 10vh;
	}
</style>
