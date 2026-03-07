<script lang="ts">
	import '../app.css';
	import Grain from '$lib/components/Grain.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import DevBar from '$lib/components/DevBar.svelte';

	let { children } = $props();
</script>

<Grain />
<StatusBar />
<DevBar />

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
