<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	let {
		choices,
		onSelect,
		baseDelay = 200
	}: {
		choices: Array<{ index: number; text: string }>;
		onSelect: (index: number) => void;
		baseDelay?: number;
	} = $props();

	const shortcutKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const altKeys = ['z', 'x', 'c'];

	function handleKeydown(e: KeyboardEvent) {
		// Spacebar: select if only one choice
		if (e.key === ' ' && choices.length === 1) {
			e.preventDefault();
			onSelect(choices[0].index);
			return;
		}

		// Number keys 1-9
		const numIndex = shortcutKeys.indexOf(e.key);
		if (numIndex >= 0 && numIndex < choices.length) {
			e.preventDefault();
			onSelect(choices[numIndex].index);
			return;
		}

		// z/x/c for first three choices
		const altIndex = altKeys.indexOf(e.key.toLowerCase());
		if (altIndex >= 0 && altIndex < choices.length) {
			e.preventDefault();
			onSelect(choices[altIndex].index);
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if choices.length > 0}
	<nav class="choices" aria-label="Story choices">
		{#each choices as choice, i (choice.index)}
			<button
				class="choice"
				in:fade={{ duration: 400, delay: baseDelay + i * 80 }}
				onclick={() => onSelect(choice.index)}
				aria-keyshortcuts={i < 9 ? String(i + 1) : undefined}
			>
				<span class="shortcut" aria-hidden="true">{i < 9 ? i + 1 : ''}</span>
				{choice.text}
			</button>
		{/each}
	</nav>
{/if}

<style>
	.choices {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.choice {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		background: none;
		border: none;
		color: var(--choice);
		font-family: var(--font-body);
		font-size: 1.125rem;
		line-height: var(--line-height);
		cursor: pointer;
		text-align: left;
		padding: var(--space-xs) 0;
		opacity: 0.6;
		transition: opacity 0.3s ease, color 0.3s ease;
	}

	.choice:hover,
	.choice:focus-visible {
		opacity: 1;
		color: var(--choice-hover);
	}

	.choice:active {
		color: var(--choice-active);
	}

	.choice:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.shortcut {
		color: var(--text-dim);
		font-size: 0.75rem;
		min-width: 1em;
		font-family: var(--font-ui);
	}
</style>
