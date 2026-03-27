<script lang="ts">
	import { fade } from 'svelte/transition';

	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	/** Flash the "Saved" confirmation briefly. Call via bind:this. */
	export function flash() {
		visible = true;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			visible = false;
		}, 1500);
	}
</script>

{#if visible}
	<div class="save-toast" transition:fade={{ duration: 200 }} role="status" aria-live="polite">
		Saved
	</div>
{/if}

<style>
	.save-toast {
		position: fixed;
		top: 3.5rem;
		right: var(--space-lg);
		font-family: var(--font-ui);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent-dim);
		pointer-events: none;
		z-index: 200;
	}
</style>
