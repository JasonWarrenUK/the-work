<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { story, loadStory, type StoryChoice, type StoryParagraph } from '$lib/engine/story.svelte';
	import { processTags } from '$lib/engine/tags';
	import { initGameSystems } from '$lib/game/init';
	import { inventory } from '$lib/game/ideas.svelte';
	import { body } from '$lib/game/body.svelte';
	import { type SaveData, type Snapshot, type LoadResult, loadChecked, save, autosave, loadAutosaveChecked, hasAutosave } from '$lib/game/save-load';
	import Passage from '$lib/components/Passage.svelte';
	import ChoiceList from '$lib/components/ChoiceList.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import PauseOverlay from '$lib/components/PauseOverlay.svelte';
	import SummaryOverlay from '$lib/components/SummaryOverlay.svelte';
	import SaveToast from '$lib/components/SaveToast.svelte';
	import { scrollAfterChoice } from '$lib/components/scroll-after-choice';

	let paragraphs: StoryParagraph[] = $state([]);
	let choices: StoryChoice[] = $state([]);
	let loading = $state(true);
	let ended = $state(false);
	let paused = $state(false);
	let summaryOpen = $state(false);
	let summaryTab = $state<'held' | 'ideas' | 'thesis'>('thesis');
	let toast: SaveToast;

	/** Everything a save needs: Ink state, game state and the choice history that can rebuild both. */
	function snapshot(): Snapshot {
		return {
			storyState: story.saveState(),
			inventoryState: inventory.toJSON(),
			bodyState: body.toJSON(),
			seed: story.seed ?? undefined,
			choices: story.choiceLog
		};
	}

	function manualSave() {
		if (!story.ink) return;
		try {
			save(snapshot());
			toast.flash();
		} catch {
			// Silently fail
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		if (loading) return;

		if (e.key === 'Escape') {
			if (summaryOpen) {
				summaryOpen = false;
			} else {
				paused = !paused;
			}
			return;
		}

		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			manualSave();
			return;
		}

		if (!e.ctrlKey && !e.metaKey && !e.altKey && !paused) {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
				if (e.key === 't' || e.key === 'T') {
					if (summaryOpen && summaryTab !== 'thesis') {
						summaryTab = 'thesis';
					} else {
						summaryTab = 'thesis';
						summaryOpen = !summaryOpen;
					}
				} else if (e.key === 'i' || e.key === 'I') {
					if (summaryOpen && summaryTab !== 'ideas') {
						summaryTab = 'ideas';
					} else {
						summaryTab = 'ideas';
						summaryOpen = !summaryOpen;
					}
				} else if (e.key === 'h' || e.key === 'H') {
					if (summaryOpen && summaryTab !== 'held') {
						summaryTab = 'held';
					} else {
						summaryTab = 'held';
						summaryOpen = !summaryOpen;
					}
				}
			}
		}
	}

	/** Restore Ink state, inventory, body and the choice history from a save. Call inside a try/catch. */
	function restoreFromSave(saveData: SaveData): void {
		// Saves from before the history was stored restore with an empty log
		story.loadState(saveData.storyState, saveData.choices);
		if (saveData.inventoryState) {
			inventory.fromJSON(saveData.inventoryState);
		}
		// Saves from before bodily states keep the fresh body from reset()
		if (saveData.bodyState) body.fromJSON(saveData.bodyState);
	}

	/**
	 * Restore a slot's save, telling the player when its version differs from
	 * this build (the load still goes ahead) or when it cannot be read or
	 * restored (the night starts fresh, and they are told why rather than
	 * finding themselves silently back at 6:30pm).
	 */
	function restoreChecked(result: LoadResult, slot: string): void {
		if (!result.ok) {
			toast.flash(`${slot} not loaded. ${result.error}`, 'warning');
			return;
		}
		try {
			restoreFromSave(result.data);
			if (result.warning) toast.flash(result.warning, 'warning');
		} catch (error) {
			// A save this build cannot restore: start fresh, and say so
			inventory.reset();
			body.reset();
			const detail = error instanceof Error ? error.message : String(error);
			const version = result.data.version ?? 'an unknown version';
			toast.flash(`${slot} from ${version} could not be restored (${detail}). Starting a new night.`, 'warning');
		}
	}

	onMount(async () => {
		await loadStory(`${base}/The Work.json`, initGameSystems);

		// Ensure a clean inventory before any restore (guards against stale state
		// from client-side navigation without a full page reload)
		inventory.reset();
		body.reset();

		const skip = page.url.searchParams.get('skip') === '1';
		const loadManualSave = page.url.searchParams.get('loadSave') === '1';

		if (skip) {
			// Jump past the prologue directly to the main gameplay loop
			const ink = story.ink;
			if (ink) {
				story.setVariable('myLightSource', 'candle');
				story.setVariable('myLightLevel', 1);
				story.setVariable('myLightColour', 'orange');
				story.setVariable('myDrink', 'water');
				// A path jump is not logged, so autosaves from a skipped run carry a seed and
				// log that cannot replay; restoring still works through the state JSON
				ink.ChoosePathString('d1_2000');
			}
		} else if (loadManualSave) {
			// Load manual save checkpoint
			restoreChecked(loadChecked(), 'Save');
		} else if (hasAutosave()) {
			// Restore autosave if available
			restoreChecked(loadAutosaveChecked(), 'Autosave');
		}

		loading = false;
		continueStory();
	});

	function continueStory() {
		const result = story.continue();
		paragraphs = result.paragraphs;
		choices = result.choices;
		ended = !story.canContinue && choices.length === 0;

		// A choice set that offers moods is the core action menu: no mood is active there
		const atCoreMenu = choices.some((c) => processTags(c.tags).mood);
		if (atCoreMenu && typeof document !== 'undefined') {
			delete document.documentElement.dataset.mood;
		}

		// Autosave after each passage, choice history included
		try {
			autosave(snapshot());
		} catch {
			// Silently fail — don't break gameplay
		}
	}

	let cancelScroll: () => void = () => {};

	async function selectChoice(index: number) {
		story.choose(index);
		continueStory();

		// Bring the new passage into view once it is in the DOM; a fresh choice supersedes an animation in flight
		cancelScroll();
		await tick();
		const firstParagraph = document.querySelector<HTMLElement>('#story .passage > p');
		if (firstParagraph) cancelScroll = scrollAfterChoice(firstParagraph);
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<SaveToast bind:this={toast} />

<StatusBar
	onOpenHeld={() => { summaryTab = 'held'; summaryOpen = true; }}
	onOpenIdeas={() => { summaryTab = 'ideas'; summaryOpen = true; }}
	onOpenThesis={() => { summaryTab = 'thesis'; summaryOpen = true; }}
/>

<PauseOverlay
	open={paused}
	onClose={() => { paused = false; }}
	onSave={manualSave}
/>

<SummaryOverlay
	open={summaryOpen}
	initialTab={summaryTab}
	onClose={() => { summaryOpen = false; }}
/>

<div id="story" role="log" aria-live="polite" aria-label="Story text">
	{#if loading}
		<p class="loading">Loading...</p>
	{:else}
		<Passage {paragraphs} />

		{#if choices.length > 0}
			<ChoiceList {choices} onSelect={selectChoice} baseDelay={Math.max(0, paragraphs.length - 1) * 50 + 500} />
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
