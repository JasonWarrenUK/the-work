import { describe, expect, it } from 'vitest';
import {
	DEFAULT_SCROLL_OPTIONS,
	animateScrollTo,
	easeCubic,
	scrollDuration,
	targetScrollTop,
	type Scroller
} from './scroll-after-choice';

/** A scroller whose clock and frames the test drives by hand. */
function fakeScroller(startY = 0) {
	let y = startY;
	let time = 0;
	let nextHandle = 1;
	const pending = new Map<number, (time: number) => void>();
	const userScrollListeners = new Set<() => void>();
	const positions: number[] = [];
	const scroller: Scroller = {
		scrollY: () => y,
		scrollTo: (value) => {
			y = value;
			positions.push(value);
		},
		now: () => time,
		requestFrame: (callback) => {
			const handle = nextHandle++;
			pending.set(handle, callback);
			return handle;
		},
		cancelFrame: (handle) => {
			pending.delete(handle);
		},
		onUserScroll: (callback) => {
			userScrollListeners.add(callback);
			return () => userScrollListeners.delete(callback);
		}
	};
	/** Advance the clock and run every frame queued so far. */
	const tick = (ms: number) => {
		time += ms;
		const frames = [...pending.values()];
		pending.clear();
		for (const frame of frames) frame(time);
	};
	const userScrolls = () => {
		for (const listener of userScrollListeners) listener();
	};
	return { scroller, tick, userScrolls, positions, pendingFrames: () => pending.size, listeners: () => userScrollListeners.size };
}

describe('easeCubic', () => {
	it('is smoothstep: fixed at the ends and halfway in the middle', () => {
		expect(easeCubic(0)).toBe(0);
		expect(easeCubic(0.5)).toBe(0.5);
		expect(easeCubic(1)).toBe(1);
		expect(easeCubic(0.25)).toBeCloseTo(0.15625);
	});
});

describe('scrollDuration', () => {
	it('grows with distance from the base and stops at the cap', () => {
		expect(scrollDuration(0)).toBe(500);
		expect(scrollDuration(100)).toBe(800);
		expect(scrollDuration(-100)).toBe(800);
		expect(scrollDuration(10000)).toBe(1250);
	});
});

describe('targetScrollTop', () => {
	it('puts the element a fifth of the way down the viewport', () => {
		expect(targetScrollTop(1000, 800, 5000)).toBe(840);
	});

	it('clamps to the page', () => {
		expect(targetScrollTop(50, 800, 5000)).toBe(0);
		expect(targetScrollTop(9000, 800, 5000)).toBe(5000);
	});
});

describe('animateScrollTo', () => {
	it('eases from the start to the target over the computed duration', () => {
		const fake = fakeScroller(0);
		animateScrollTo(100, fake.scroller);

		fake.tick(0);
		expect(fake.positions.at(-1)).toBe(0);
		fake.tick(400);
		expect(fake.positions.at(-1)).toBeCloseTo(50);
		fake.tick(400);
		expect(fake.positions.at(-1)).toBe(100);
		expect(fake.pendingFrames()).toBe(0);
		expect(fake.listeners()).toBe(0);
	});

	it('does nothing when already at the target', () => {
		const fake = fakeScroller(250);
		animateScrollTo(250, fake.scroller);
		expect(fake.pendingFrames()).toBe(0);
		expect(fake.positions).toEqual([]);
	});

	it('stops when the reader scrolls by hand', () => {
		const fake = fakeScroller(0);
		animateScrollTo(100, fake.scroller);
		fake.tick(0);
		fake.userScrolls();
		fake.tick(800);
		expect(fake.positions.at(-1)).toBe(0);
		expect(fake.pendingFrames()).toBe(0);
		expect(fake.listeners()).toBe(0);
	});

	it('keeps going through user scrolls when that option is off', () => {
		const fake = fakeScroller(0);
		animateScrollTo(100, fake.scroller, { ...DEFAULT_SCROLL_OPTIONS, breakOnUserScroll: false });
		fake.tick(0);
		fake.userScrolls();
		fake.tick(800);
		expect(fake.positions.at(-1)).toBe(100);
	});

	it('can be cancelled by the caller', () => {
		const fake = fakeScroller(0);
		const cancel = animateScrollTo(100, fake.scroller);
		fake.tick(0);
		cancel();
		fake.tick(800);
		expect(fake.positions.at(-1)).toBe(0);
		expect(fake.pendingFrames()).toBe(0);
	});
});
