<script lang="ts">
	import { fade } from 'svelte/transition';

	let visible = $state(false);
	let message = $state('Saved');
	let tone = $state<'status' | 'warning'>('status');
	let timer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Flash a short notice. Call via bind:this. With no arguments it is the
	 * "Saved" confirmation; a warning (a save from another version, a save
	 * that could not be read) stays up longer and reads as a warning.
	 */
	export function flash(text = 'Saved', kind: 'status' | 'warning' = 'status') {
		message = text;
		tone = kind;
		visible = true;
		if (timer) clearTimeout(timer);
		timer = setTimeout(
			() => {
				visible = false;
			},
			kind === 'warning' ? 6000 : 1500
		);
	}
</script>

{#if visible}
	<div class="save-toast" class:warning={tone === 'warning'} transition:fade={{ duration: 200 }} role="status" aria-live="polite">
		{message}
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
		max-width: min(60ch, calc(100vw - 2 * var(--space-lg)));
		text-align: right;
	}

	.save-toast.warning {
		text-transform: none;
		letter-spacing: normal;
		font-size: 0.8rem;
		color: var(--danger, var(--accent));
	}
</style>
