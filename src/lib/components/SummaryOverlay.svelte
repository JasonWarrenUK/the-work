<script lang="ts">
	import { fade } from 'svelte/transition';
	import { story } from '$lib/engine/story.svelte';
	import { inventory } from '$lib/game/ideas.svelte';
	import { getDiscipline } from '$lib/game/disciplines';

	let {
		open,
		initialTab,
		onClose
	}: {
		open: boolean;
		initialTab: 'ideas' | 'thesis';
		onClose: () => void;
	} = $props();

	let tab = $state<'ideas' | 'thesis'>('thesis');
	let closeButton: HTMLButtonElement | null = $state(null);

	$effect(() => {
		if (open) {
			tab = initialTab;
			if (closeButton) closeButton.focus();
		}
	});

	let written = $derived((() => { story.tick; return inventory.writtenIdeas(); })());
	let writable = $derived((() => { story.tick; return inventory.writableIdeas(); })());
	let profile = $derived((() => { story.tick; return inventory.getThesisProfile(); })());
	let discipline = $derived((() => { story.tick; return getDiscipline(); })());

	const LEVEL_NAMES: Record<number, string> = {
		3: 'Idea',
		4: 'Concept',
		5: 'Argument',
		6: 'Thesis'
	};

	function sortedWritten() {
		return [...written].sort((a, b) => b.level - a.level || a.id.localeCompare(b.id));
	}

	function sortedWritable() {
		return [...writable].sort((a, b) => b.level - a.level || a.id.localeCompare(b.id));
	}

	function barFillStyle(score: number): string {
		const clamped = Math.max(-100, Math.min(100, score));
		if (clamped >= 0) {
			return `left: 50%; width: ${(clamped / 100) * 50}%;`;
		}
		const pct = (Math.abs(clamped) / 100) * 50;
		return `left: ${50 - pct}%; width: ${pct}%;`;
	}

	function barPositive(score: number): boolean {
		return score >= 0;
	}

	function handleTabKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			tab = 'ideas';
			e.preventDefault();
		} else if (e.key === 'ArrowRight') {
			tab = 'thesis';
			e.preventDefault();
		}
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') return; // handled by +page.svelte
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
			aria-label="Summary"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<header class="summary-header">
				<p class="title">{tab === 'ideas' ? 'Ideas' : 'Thesis'}</p>
				{#if discipline}
					<p class="discipline-name">{discipline.official}</p>
				{/if}
			</header>

			<div class="tab-strip" onkeydown={handleTabKeydown} role="tablist" tabindex="-1">
				<button
					class="tab-btn"
					class:active={tab === 'ideas'}
					role="tab"
					aria-selected={tab === 'ideas'}
					onclick={() => { tab = 'ideas'; }}
				>Ideas</button>
				<button
					class="tab-btn"
					class:active={tab === 'thesis'}
					role="tab"
					aria-selected={tab === 'thesis'}
					onclick={() => { tab = 'thesis'; }}
				>Thesis</button>
			</div>

			{#if tab === 'ideas'}
				{#if writable.length === 0}
					<p class="empty">No writable ideas yet. Develop your inklings to L3 or higher.</p>
				{:else}
					<section class="ideas-section" aria-label="Writable ideas">
						{#each sortedWritable() as idea (idea.id)}
							<article class="idea-card">
								<p class="idea-text">{idea.text}</p>
								<p class="idea-level">L{idea.level} — {LEVEL_NAMES[idea.level] ?? 'Idea'}</p>
								{#if Object.keys(idea.concepts).length > 0}
									<div class="idea-domains">
										{#each Object.entries(idea.concepts) as [domain, score]}
											<div class="domain-row">
												<span class="domain-label">{domain}</span>
												<div class="bar-track" aria-hidden="true">
													<span class="bar-centre-tick"></span>
													<span
														class="bar-fill"
														class:positive={barPositive(score as number)}
														class:negative={!barPositive(score as number)}
														style={barFillStyle(score as number)}
													></span>
												</div>
												<span class="score-value">{(score as number) > 0 ? '+' : ''}{score}</span>
											</div>
										{/each}
									</div>
								{/if}
							</article>
						{/each}
					</section>
				{/if}
			{:else}
				{#if written.length === 0}
					<p class="empty">No ideas written yet.</p>
				{:else}
					<section class="profile-section" aria-label="Domain profile">
						<h2 class="section-heading">Profile</h2>
						{#each Object.entries(profile) as [domain, score]}
							<div class="domain-row">
								<span class="domain-label">{domain}</span>
								<div class="bar-track" aria-hidden="true">
									<span class="bar-centre-tick"></span>
									<span
										class="bar-fill"
										class:positive={barPositive(score)}
										class:negative={!barPositive(score)}
										style={barFillStyle(score)}
									></span>
								</div>
								<span class="score-value">{score > 0 ? '+' : ''}{score}</span>
							</div>
						{/each}
					</section>

					<section class="ideas-section" aria-label="Written ideas">
						<h2 class="section-heading">Written ideas</h2>
						{#each sortedWritten() as idea (idea.id)}
							<article class="idea-card">
								<p class="idea-text">{idea.text}</p>
								<p class="idea-level">L{idea.level} — {LEVEL_NAMES[idea.level] ?? 'Idea'}</p>
								{#if Object.keys(idea.concepts).length > 0}
									<div class="idea-domains">
										{#each Object.entries(idea.concepts) as [domain, score]}
											<div class="domain-row">
												<span class="domain-label">{domain}</span>
												<div class="bar-track" aria-hidden="true">
													<span class="bar-centre-tick"></span>
													<span
														class="bar-fill"
														class:positive={barPositive(score as number)}
														class:negative={!barPositive(score as number)}
														style={barFillStyle(score as number)}
													></span>
												</div>
												<span class="score-value">{(score as number) > 0 ? '+' : ''}{score}</span>
											</div>
										{/each}
									</div>
								{/if}
							</article>
						{/each}
					</section>
				{/if}
			{/if}

			<button class="menu-btn" bind:this={closeButton} onclick={onClose}>Close</button>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(5, 5, 10, 0.92);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		overflow-y: auto;
		z-index: 500;
		padding: var(--space-xl) var(--space-md);
	}

	.overlay {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-lg);
		width: min(var(--measure), 90vw);
		padding: var(--space-lg) 0;
	}

	.summary-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
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

	.discipline-name {
		font-family: var(--font-ui);
		font-variant: small-caps;
		font-size: 1.1rem;
		color: var(--accent);
		letter-spacing: 0.08em;
		margin: 0;
	}

	.tab-strip {
		display: flex;
		justify-content: center;
		gap: var(--space-md);
	}

	.tab-btn {
		background: none;
		border: none;
		border-bottom: 1px solid transparent;
		cursor: pointer;
		font-family: var(--font-ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-dim);
		opacity: 0.4;
		padding: 0 0 var(--space-xs) 0;
		transition:
			opacity 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.tab-btn.active {
		color: var(--accent);
		opacity: 1;
		border-bottom-color: var(--accent);
	}

	.tab-btn:hover:not(.active) {
		opacity: 0.7;
	}

	.tab-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.empty {
		font-family: var(--font-body);
		font-style: italic;
		color: var(--text-dim);
		text-align: center;
		margin: 0;
	}

	.section-heading {
		font-family: var(--font-ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-dim);
		margin: 0 0 var(--space-sm) 0;
	}

	.profile-section,
	.ideas-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.domain-row {
		display: grid;
		grid-template-columns: 7em 1fr 3.5em;
		align-items: center;
		gap: var(--space-sm);
	}

	.domain-label {
		font-family: var(--font-ui);
		font-size: 0.8125rem;
		color: var(--text-dim);
		text-align: right;
	}

	.bar-track {
		position: relative;
		height: 4px;
		background: var(--bg-surface);
		border-radius: 2px;
		overflow: visible;
	}

	.bar-centre-tick {
		position: absolute;
		left: 50%;
		top: -2px;
		width: 1px;
		height: 8px;
		background: var(--text-dim);
		opacity: 0.4;
		transform: translateX(-50%);
	}

	.bar-fill {
		position: absolute;
		top: 0;
		height: 100%;
		border-radius: 2px;
	}

	.bar-fill.positive {
		background: var(--accent);
	}

	.bar-fill.negative {
		background: var(--accent-dim);
	}

	.score-value {
		font-family: var(--font-ui);
		font-size: 0.75rem;
		color: var(--text-dim);
		text-align: left;
	}

	.idea-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		border-top: 1px solid var(--bg-surface);
		padding-top: var(--space-sm);
	}

	.idea-text {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--text);
		margin: 0;
		line-height: var(--line-height);
	}

	.idea-level {
		font-family: var(--font-ui);
		font-size: 0.75rem;
		color: var(--accent-dim);
		font-style: italic;
		margin: 0;
	}

	.idea-domains {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.menu-btn {
		align-self: center;
		background: none;
		border: none;
		color: var(--choice);
		font-family: var(--font-body);
		font-size: 1.25rem;
		cursor: pointer;
		opacity: 0.6;
		transition:
			opacity 0.3s ease,
			color 0.3s ease;
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
