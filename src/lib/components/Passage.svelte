<script lang="ts">
	import { fade } from 'svelte/transition';

	let { paragraphs }: { paragraphs: string[] } = $props();

	let paragraphId = 0;

	interface KeyedParagraph {
		id: number;
		text: string;
	}

	let keyed: KeyedParagraph[] = $derived(
		paragraphs.map((text) => ({ id: paragraphId++, text }))
	);
</script>

<div class="passage">
	{#each keyed as para (para.id)}
		<p in:fade={{ duration: 500, delay: para.id * 50 }}>
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
</style>
