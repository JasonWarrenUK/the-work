<script lang="ts">
	import '../app.css';
	import Grain from '$lib/components/Grain.svelte';

	let { children } = $props();
</script>

<Grain />

<main>
	{@render children()}
</main>

<style>
	main {
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
