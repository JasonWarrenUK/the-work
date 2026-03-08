<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { story, loadStory } from '$lib/engine/story.svelte';
	import { initGameSystems } from '$lib/game/init';
	import { autosave, loadAutosave, hasAutosave } from '$lib/game/save-load';
	import Passage from '$lib/components/Passage.svelte';
	import ChoiceList from '$lib/components/ChoiceList.svelte';

	const CATEGORY_MOODS: Record<string, string> = {
		'Attend to The Work': 'textual',
		'Consider your circumstances': 'physical',
		'Exercise the mind': 'mental'
	};
	const CATEGORY_NAMES = Object.keys(CATEGORY_MOODS);

	let paragraphs: string[] = $state([]);
	let choices: Array<{ index: number; text: string }> = $state([]);
	let loading = $state(true);
	let ended = $state(false);

	onMount(async () => {
		await loadStory(`${base}/The Work.json`, initGameSystems);

		const skip = page.url.searchParams.get('skip') === '1';

		if (skip) {
			// Jump past the prologue directly to the main gameplay loop
			const ink = story.ink;
			if (ink) {
				story.setVariable('myLightSource', 'candle');
				story.setVariable('myLightLevel', 1);
				story.setVariable('myLightColour', 'orange');
				story.setVariable('myDrink', 'water');
				ink.ChoosePathString('d1_2000');
			}
		} else if (hasAutosave()) {
			// Restore autosave if available
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

		// Clear mood when back at the core action menu
		const choiceTexts = choices.map((c) => c.text);
		const atCoreMenu = CATEGORY_NAMES.every((name) => choiceTexts.includes(name));
		if (atCoreMenu && typeof document !== 'undefined') {
			delete document.documentElement.dataset.mood;
		}

		// Autosave after each passage
		try {
			autosave(story.saveState());
		} catch {
			// Silently fail — don't break gameplay
		}
	}

	function selectChoice(index: number) {
		// Check if this choice is an action category and set mood
		const selected = choices.find((c) => c.index === index);
		if (selected && selected.text in CATEGORY_MOODS && typeof document !== 'undefined') {
			document.documentElement.dataset.mood = CATEGORY_MOODS[selected.text];
		}

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
