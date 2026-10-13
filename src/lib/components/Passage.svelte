<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { StoryParagraph } from '$lib/engine/story.svelte';
	import ParallaxFrame from './ParallaxFrame.svelte';

	let { paragraphs }: { paragraphs: StoryParagraph[] } = $props();

	let paragraphId = 0;

	interface KeyedParagraph extends StoryParagraph {
		id: number;
	}

	let keyed: KeyedParagraph[] = $derived(
		paragraphs.map((paragraph) => ({ ...paragraph, id: paragraphId++ }))
	);
</script>

<div class="passage">
	{#each keyed as para, i (para.id)}
		{#if para.frame}
			<div in:fade={{ duration: 500, delay: i * 50 }}>
				<ParallaxFrame frame={para.frame} />
			</div>
		{/if}
		<p class={para.classes} in:fade={{ duration: 500, delay: i * 50 }}>
			{para.text}
		</p>
	{/each}
</div>

<style>
	.passage {
		margin-bottom: var(--space-lg);
	}

	p {
		font-family: var(--font-body);
		font-size: 1.125rem;
		line-height: var(--line-height);
		margin-bottom: var(--space-md);
		color: var(--text);
	}

	/* Paragraph classes set from Ink with #class:<name> */
	p.aside {
		color: var(--text-dim);
		font-style: italic;
	}

	p.emphasis {
		color: var(--accent);
	}

	p.urgent {
		color: var(--danger);
	}
</style>
