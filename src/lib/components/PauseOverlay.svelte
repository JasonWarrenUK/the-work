<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { hasSave } from '$lib/game/save-load';

	let {
		open,
		onClose,
		onSave
	}: {
		open: boolean;
		onClose: () => void;
		onSave: () => void;
	} = $props();

	let saved = $state(false);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;
	let firstButton: HTMLButtonElement | null = $state(null);

	$effect(() => {
		if (open && firstButton) {
			firstButton.focus();
		}
	});

	function handleSave() {
		onSave();
		saved = true;
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(() => {
			saved = false;
		}, 1500);
	}

	function handleLoadSave() {
		onClose();
		goto(`${base}/?loadSave=1`);
	}

	function handleQuit() {
		onClose();
		goto(`${base}/menu`);
	}

	/** Suppress all keydown events while overlay is open to prevent ChoiceList firing underneath. */
	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
		// Stop other keys (numbers, z/x/c, space) from reaching ChoiceList
		e.stopImmediatePropagation();
	}
</script>

<svelte:window onkeydown={open ? handleOverlayKeydown : undefined} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="presentation" transition:fade={{ duration: 300 }} onclick={onClose}>
		<div
			class="overlay"
			role="dialog"
			aria-modal="true"
			aria-label="Pause menu"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<p class="title">Paused</p>

			<nav class="menu-choices" aria-label="Pause menu options">
				<button
					class="menu-btn"
					bind:this={firstButton}
					onclick={handleSave}
				>
					{saved ? 'Saved' : 'Save'}
				</button>

				{#if hasSave()}
					<button class="menu-btn" onclick={handleLoadSave}>Load Save</button>
				{/if}

				<button class="menu-btn" onclick={handleQuit}>Quit to Menu</button>

				<button class="menu-btn resume" onclick={onClose}>Resume</button>
			</nav>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(5, 5, 10, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 500;
	}

	.overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
	}

	.title {
		font-family: var(--font-body);
		font-weight: 300;
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		color: var(--text);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		opacity: 0.5;
		margin: 0;
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

	.resume {
		color: var(--text-dim);
		font-size: 1rem;
		margin-top: var(--space-sm);
	}
</style>
