<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import type { FrameSpec } from '$lib/engine/tags';

	/**
	 * Layered image frame that drifts against the pointer (Calico parallaxframes).
	 * `shift` is the full travel in px of a depth-1 layer; a layer at depth d moves shift/d.
	 */
	let { frame, shift = 24 }: { frame: FrameSpec; shift?: number } = $props();

	/** Frame images live in static/frames; a full path or URL is used as written. */
	const srcFor = (src: string): string => (/^(https?:)?\//.test(src) ? src : `${base}/frames/${src}`);

	// Pointer position as a fraction of the viewport, centred on 0
	let dx = $state(0);
	let dy = $state(0);
	let tracking = $state(false);

	function track(x: number, y: number): void {
		dx = x / window.innerWidth - 0.5;
		dy = y / window.innerHeight - 0.5;
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyPreference = () => {
			tracking = !reducedMotion.matches;
			if (!tracking) {
				dx = 0;
				dy = 0;
			}
		};
		applyPreference();

		const onMouse = (event: MouseEvent) => {
			if (tracking) track(event.clientX, event.clientY);
		};
		const onTouch = (event: TouchEvent) => {
			const touch = event.touches[0];
			if (tracking && touch) track(touch.clientX, touch.clientY);
		};
		reducedMotion.addEventListener('change', applyPreference);
		window.addEventListener('mousemove', onMouse);
		window.addEventListener('touchmove', onTouch, { passive: true });
		return () => {
			reducedMotion.removeEventListener('change', applyPreference);
			window.removeEventListener('mousemove', onMouse);
			window.removeEventListener('touchmove', onTouch);
		};
	});

	// Layers move against the pointer; deeper layers move less
	const offset = (depth: number): string =>
		`translate(${((-dx * shift) / depth).toFixed(2)}px, ${((-dy * shift) / depth).toFixed(2)}px)`;
</script>

<div class="frame" style:height={`${(frame.height ?? 0.3) * 100}vh`} style:--shift={`${shift}px`} aria-hidden="true">
	{#each frame.layers as layer, i (i)}
		<img class="layer" src={srcFor(layer.src)} alt="" draggable="false" style:transform={offset(layer.depth)} />
	{/each}
</div>

<style>
	.frame {
		position: relative;
		overflow: hidden;
		width: 100%;
		margin-bottom: var(--space-md);
		background: var(--bg-surface);
	}

	/* Each layer overhangs the frame by the full shift so movement never shows an edge */
	.layer {
		position: absolute;
		inset: calc(-1 * var(--shift));
		width: calc(100% + 2 * var(--shift));
		height: calc(100% + 2 * var(--shift));
		object-fit: cover;
		pointer-events: none;
		user-select: none;
		will-change: transform;
		transition: transform 80ms linear;
	}
</style>
