<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let { paragraphs }: { paragraphs: string[] } = $props();
</script>

<div class="passage">
	{#each paragraphs as text, i (text + i)}
		<p
			in:fade={{ duration: 500, delay: i * 50 }}
		>
			{@html text}
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
