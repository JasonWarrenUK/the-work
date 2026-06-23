<script lang="ts">
	import { fade } from 'svelte/transition';
	import { story } from '$lib/engine/story.svelte';
	import { inventory, type IdeaDef, type Domain } from '$lib/game/ideas.svelte';

	let {
		open,
		onClose
	}: {
		open: boolean;
		onClose: () => void;
	} = $props();

	/** Human-readable name for each of the six idea levels. */
	const LEVEL_NAMES: Record<number, string> = {
		1: 'Observation',
		2: 'Inkling',
		3: 'Idea',
		4: 'Concept',
		5: 'Argument',
		6: 'Thesis'
	};

	let dialog: HTMLDivElement | null = $state(null);

	// Reading story.tick inside $derived ensures these re-evaluate after each continue()
	let held = $derived((() => {
		story.tick;
		return inventory.heldIdeas();
	})());
	let writableIds = $derived((() => {
		story.tick;
		return new Set(inventory.writableIdeas().map((d) => d.id));
	})());

	$effect(() => {
		if (open && dialog) {
			dialog.focus();
		}
	});

	/** Format a single domain orthodoxy score with an explicit sign (e.g. "+40", "−15"). */
	function formatScore(score: number): string {
		if (score > 0) return `+${score}`;
		if (score < 0) return `−${Math.abs(score)}`;
		return '0';
	}

	/** Touched domains for an idea, as [domain, score] pairs in declaration order. */
	function orthodoxyEntries(def: IdeaDef): Array<[Domain, number]> {
		return Object.entries(def.concepts) as Array<[Domain, number]>;
	}

	/** Suppress non-Escape, non-toggle keydown so ChoiceList underneath doesn't fire. */
	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' || e.key === 'i') return; // handled by +page.svelte
		e.stopImmediatePropagation();
	}
</script>

<svelte:window onkeydown={open ? handleOverlayKeydown : undefined} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="presentation" transition:fade={{ duration: 300 }} onclick={onClose}>
		<div
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-label="Held ideas"
			tabindex="-1"
			bind:this={dialog}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<p class="title">Your Mind</p>

			{#if held.length === 0}
				<p class="empty">No ideas yet.</p>
			{:else}
				<ul class="ideas">
					{#each held as def (def.id)}
						{@const written = inventory.isWritten(def.id)}
						{@const writable = writableIds.has(def.id)}
						<li class="idea" class:writable class:written>
							<div class="idea-head">
								<span class="level">{LEVEL_NAMES[def.level]}</span>
								{#if written}
									<span class="tag written-tag">✓ written</span>
								{:else if writable}
									<span class="tag writable-tag">writable</span>
								{/if}
							</div>
							<p class="idea-text">{def.text}</p>
							<div class="orthodoxy">
								{#each orthodoxyEntries(def) as [domain, score] (domain)}
									<span class="score" class:radical={score < 0} class:orthodox={score > 0}>
										{domain} {formatScore(score)}
									</span>
								{/each}
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<button class="close-btn" onclick={onClose}>Close</button>
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

	.panel {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-lg);
		width: var(--measure);
		max-width: 80vw;
		max-height: 80vh;
		padding: var(--space-lg);
		overflow-y: auto;
	}

	.title {
		font-family: var(--font-body);
		font-weight: 300;
		font-size: clamp(1.25rem, 3vw, 2rem);
		color: var(--text);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		opacity: 0.5;
		text-align: center;
		margin: 0;
	}

	.empty {
		color: var(--text-dim);
		font-family: var(--font-body);
		font-style: italic;
		text-align: center;
		margin: 0;
	}

	.ideas {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.idea {
		border-left: 2px solid var(--text-dim);
		padding: var(--space-sm) var(--space-md);
		opacity: 0.7;
		transition: opacity 0.3s ease, border-color 0.3s ease;
	}

	.idea.writable {
		border-left-color: var(--accent);
		opacity: 1;
	}

	.idea.written {
		border-left-color: var(--accent-dim);
		opacity: 0.5;
	}

	.idea-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-sm);
	}

	.level {
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-dim);
	}

	.tag {
		font-family: var(--font-ui);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.writable-tag {
		color: var(--accent);
	}

	.written-tag {
		color: var(--accent-dim);
	}

	.idea-text {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--text);
		margin: var(--space-xs) 0;
	}

	.orthodoxy {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.score {
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		color: var(--text-dim);
	}

	.score.orthodox {
		color: var(--choice);
	}

	.score.radical {
		color: var(--danger);
	}

	.close-btn {
		align-self: center;
		background: none;
		border: none;
		color: var(--text-dim);
		font-family: var(--font-body);
		font-size: 1rem;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.3s ease, color 0.3s ease;
		padding: var(--space-xs) var(--space-md);
	}

	.close-btn:hover,
	.close-btn:focus-visible {
		opacity: 1;
		color: var(--choice-hover);
	}

	.close-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
