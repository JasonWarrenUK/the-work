<script lang="ts">
	import { base } from '$app/paths';
	import { deleteAutosave, deleteSave } from '$lib/game/save-load';

	function resetState() {
		deleteAutosave();
		deleteSave();
		window.location.href = `${base}/menu`;
	}
</script>

<footer class="dev-bar">
	<button class="dev-btn" onclick={resetState}>Reset State</button>
</footer>

<style>
	.dev-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding: var(--space-sm) var(--space-md);
		background: rgba(10, 10, 15, 0.7);
		z-index: 100;
		pointer-events: auto;
	}

	.dev-btn {
		background: none;
		border: 1px solid var(--text-dim);
		color: var(--text-dim);
		font-family: var(--font-ui);
		font-size: 0.6875rem;
		padding: 0.15rem 0.5rem;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		opacity: 0.6;
		transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
	}

	.dev-btn:hover,
	.dev-btn:focus-visible {
		opacity: 1;
		color: var(--danger);
		border-color: var(--danger);
	}

	.dev-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
