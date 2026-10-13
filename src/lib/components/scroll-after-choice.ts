/**
 * Smooth scroll to newly revealed story text after a choice (Calico
 * `scrollafterchoice`). The maths and the animation loop are pure and take an
 * injectable {@link Scroller}, so they are testable without a DOM; the
 * {@link scrollAfterChoice} entry point binds them to `window`.
 */

export interface ScrollOptions {
	/** Where the new content's top lands, as a fraction of the viewport height from the top. */
	viewportFraction: number;
	/** Minimum animation length in ms. */
	durationBase: number;
	/** Extra ms per pixel of distance. */
	durationMultiplier: number;
	/** Cap on the animation length in ms. */
	maxDuration: number;
	/** Stop animating as soon as the reader scrolls by hand. */
	breakOnUserScroll: boolean;
}

export const DEFAULT_SCROLL_OPTIONS: ScrollOptions = {
	viewportFraction: 0.2,
	durationBase: 500,
	durationMultiplier: 3,
	maxDuration: 1250,
	breakOnUserScroll: true
};

/** Smoothstep easing, 3t² - 2t³, as Calico uses. */
export const easeCubic = (t: number): number => t * t * (3 - 2 * t);

/** Animation length for a scroll of `distance` pixels, in ms. */
export function scrollDuration(distance: number, options: ScrollOptions = DEFAULT_SCROLL_OPTIONS): number {
	return Math.min(options.maxDuration, options.durationBase + Math.abs(distance) * options.durationMultiplier);
}

/**
 * The scroll position that places `elementTop` (page offset) at
 * `viewportFraction` of the viewport from the top, clamped to what the page can scroll.
 */
export function targetScrollTop(
	elementTop: number,
	viewportHeight: number,
	maxScroll: number,
	options: ScrollOptions = DEFAULT_SCROLL_OPTIONS
): number {
	const wanted = elementTop - viewportHeight * options.viewportFraction;
	return Math.max(0, Math.min(maxScroll, Math.round(wanted)));
}

/** The pieces of the browser the animation touches, so a test can fake them. */
export interface Scroller {
	scrollY(): number;
	scrollTo(y: number): void;
	now(): number;
	requestFrame(callback: (time: number) => void): number;
	cancelFrame(handle: number): void;
	/** Subscribe to the reader scrolling by hand; returns an unsubscribe. */
	onUserScroll(callback: () => void): () => void;
}

/**
 * Animate from the current scroll position to `target`. Returns a cancel
 * function. Resolves instantly (no frames) when there is nothing to move.
 */
export function animateScrollTo(
	target: number,
	scroller: Scroller,
	options: ScrollOptions = DEFAULT_SCROLL_OPTIONS
): () => void {
	const start = scroller.scrollY();
	const distance = target - start;
	if (distance === 0) return () => {};

	const duration = scrollDuration(distance, options);
	const startedAt = scroller.now();
	let frame: number | null = null;
	let stopUserScroll = () => {};

	const cancel = () => {
		if (frame !== null) scroller.cancelFrame(frame);
		frame = null;
		stopUserScroll();
	};

	if (options.breakOnUserScroll) stopUserScroll = scroller.onUserScroll(cancel);

	const step = () => {
		const progress = Math.min(1, (scroller.now() - startedAt) / duration);
		scroller.scrollTo(start + distance * easeCubic(progress));
		if (progress < 1) {
			frame = scroller.requestFrame(step);
		} else {
			frame = null;
			stopUserScroll();
		}
	};
	frame = scroller.requestFrame(step);
	return cancel;
}

/** Keys that scroll the page by themselves; other keys (choice numbers, overlay shortcuts) do not count as scrolling. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** Whether a `KeyboardEvent.key` is one the browser scrolls the page with. */
export const isScrollKey = (key: string): boolean => SCROLL_KEYS.has(key);

/** A {@link Scroller} over the real window. */
function windowScroller(): Scroller {
	return {
		scrollY: () => window.scrollY,
		scrollTo: (y) => window.scrollTo(0, y),
		now: () => performance.now(),
		requestFrame: (callback) => window.requestAnimationFrame(callback),
		cancelFrame: (handle) => window.cancelAnimationFrame(handle),
		onUserScroll: (callback) => {
			// Our own scrollTo() fires 'scroll', so listen for the reader's input instead
			const onPointer = () => callback();
			const onKey = (event: KeyboardEvent) => {
				if (isScrollKey(event.key)) callback();
			};
			window.addEventListener('wheel', onPointer, { passive: true });
			window.addEventListener('touchmove', onPointer, { passive: true });
			window.addEventListener('keydown', onKey);
			return () => {
				window.removeEventListener('wheel', onPointer);
				window.removeEventListener('touchmove', onPointer);
				window.removeEventListener('keydown', onKey);
			};
		}
	};
}

/**
 * Scroll so `element` sits `viewportFraction` down the viewport, smoothly, or
 * instantly when the reader prefers reduced motion. Returns a cancel function.
 */
export function scrollAfterChoice(element: HTMLElement, options: ScrollOptions = DEFAULT_SCROLL_OPTIONS): () => void {
	const scroller = windowScroller();
	const elementTop = element.getBoundingClientRect().top + window.scrollY;
	const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
	const target = targetScrollTop(elementTop, window.innerHeight, maxScroll, options);

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		scroller.scrollTo(target);
		return () => {};
	}
	return animateScrollTo(target, scroller, options);
}
