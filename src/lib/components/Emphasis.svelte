<script lang="ts">
	import { parseEmphasis } from '$lib/engine/emphasis';

	/** Story text with `*emphasis*` and `**strong**` rendered as real elements; never as raw HTML. */
	let { text }: { text: string } = $props();

	let segments = $derived(parseEmphasis(text));
</script>

{#each segments as segment, i (i)}
	{#if segment.strong && segment.em}
		<strong><em>{segment.text}</em></strong>
	{:else if segment.strong}
		<strong>{segment.text}</strong>
	{:else if segment.em}
		<em>{segment.text}</em>
	{:else}
		{segment.text}
	{/if}
{/each}
