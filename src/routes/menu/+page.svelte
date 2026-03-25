<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { hasAutosave, deleteAutosave } from '$lib/game/save-load';

	let canContinue = $state(false);

	onMount(() => {
		canContinue = hasAutosave();
	});

	function newGame() {
		deleteAutosave();
		goto(`${base}/`);
	}

	function continueGame() {
		goto(`${base}/`);
	}

	function skipPrologue() {
		deleteAutosave();
		goto(`${base}/?skip=1`);
	}
</script>

<div class="menu" in:fade={{ duration: 800 }}>
	<h1 class="title">The Work</h1>

	<nav class="menu-choices" aria-label="Main menu">
		{#if canContinue}
			<button class="menu-btn" onclick={continueGame}>Continue</button>
		{/if}
		<button class="menu-btn" onclick={newGame}>New Game</button>
		<button class="menu-btn" onclick={skipPrologue}>Skip Prologue</button>
	</nav>
</div>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: var(--space-xl);
	}

	.title {
		font-family: var(--font-body);
		font-weight: 300;
		font-size: clamp(2rem, 6vw, 4rem);
		color: var(--text);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.menu-choices {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
	}

	.menu-btn {
		background: none;
		border: none;
		color: var(--choice);
		font-family: var(--font-body);
		font-size: 1.25rem;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.3s ease, color 0.3s ease;
		padding: var(--space-xs) var(--space-md);
	}

	.menu-btn:hover,
	.menu-btn:focus-visible {
		opacity: 1;
		color: var(--choice-hover);
	}

	.menu-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
