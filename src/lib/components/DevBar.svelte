<script lang="ts">
	import { base } from '$app/paths';
	import { save, deleteAutosave, deleteSave } from '$lib/game/save-load';
	import { story } from '$lib/engine/story.svelte';
	import { inventory } from '$lib/game/ideas.svelte';
	import { body } from '$lib/game/body.svelte';

	let saved = $state(false);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	/** Only show the save button when the story is loaded and playing */
	let storyActive = $derived(story.ink !== null);

	let issues = $derived(story.issues);
	let errorCount = $derived(issues.filter((issue) => issue.level === 'error').length);
	let warningCount = $derived(issues.length - errorCount);
	let latestIssue = $derived(issues.at(-1) ?? null);
	let issuesOpen = $state(false);

	function manualSave() {
		try {
			save({ storyState: story.saveState(), inventoryState: inventory.toJSON(), bodyState: body.toJSON() });
			saved = true;
			if (saveTimer) clearTimeout(saveTimer);
			saveTimer = setTimeout(() => {
				saved = false;
			}, 1500);
		} catch {
			// Silently fail
		}
	}

	function resetState() {
		deleteAutosave();
		deleteSave();
		window.location.href = `${base}/menu`;
	}
</script>

<footer class="dev-bar">
	{#if issuesOpen && issues.length > 0}
		<ul class="issue-list" aria-label="Ink issues">
			{#each issues as issue, i (i)}
				<li class={issue.level}>{issue.level === 'error' ? 'Error' : 'Warning'}: {issue.message}</li>
			{/each}
		</ul>
	{/if}
	<div class="dev-row">
		{#if storyActive}
			<button class="dev-btn" onclick={manualSave}>{saved ? 'Saved' : 'Save'}</button>
		{/if}
		<button class="dev-btn" onclick={resetState}>Reset State</button>
		{#if issues.length > 0}
			<button
				class="dev-btn issues"
				class:has-error={errorCount > 0}
				aria-expanded={issuesOpen}
				onclick={() => { issuesOpen = !issuesOpen; }}
			>
				Ink: {errorCount} {errorCount === 1 ? 'error' : 'errors'}, {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
			</button>
			<button class="dev-btn" onclick={() => { story.clearIssues(); issuesOpen = false; }}>Clear</button>
			{#if !issuesOpen && latestIssue}
				<span class="latest" class:error={latestIssue.level === 'error'}>{latestIssue.message}</span>
			{/if}
		{/if}
	</div>
</footer>

<style>
	.dev-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: rgba(10, 10, 15, 0.7);
		z-index: 100;
		pointer-events: auto;
	}

	.dev-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
		justify-content: center;
	}

	.dev-btn.issues {
		opacity: 1;
		color: var(--accent);
		border-color: var(--accent);
	}

	.dev-btn.issues.has-error {
		color: var(--danger);
		border-color: var(--danger);
	}

	.latest {
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		color: var(--accent);
		max-width: 40ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.latest.error {
		color: var(--danger);
	}

	.issue-list {
		list-style: none;
		margin: 0;
		padding: 0;
		max-height: 30vh;
		overflow-y: auto;
		width: min(100%, var(--measure));
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		color: var(--accent);
	}

	.issue-list li {
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--accent-dim);
	}

	.issue-list li.error {
		color: var(--danger);
	}

	.dev-btn {
		background: none;
		border: 1px solid var(--text-dim);
		color: var(--text-dim);
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		padding: 0.15rem 0.5rem;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		opacity: 0.6;
		transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
	}

	.dev-btn:hover,
	.dev-btn:focus-visible {
		opacity: 1;
		color: var(--danger);
		border-color: var(--danger);
	}

	.dev-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
