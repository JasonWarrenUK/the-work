/**
 * Storylet bindings for the Ink story (a port of Calico's storylets patch).
 *
 * A storylet is any knot whose first line is the tag `# storylet`. The Ink
 * side (`story/patches/storylets.ink`) threads each one in turn until one of
 * them adds a choice; the knot's own guard (`{savings < 25: -> DONE}`) decides
 * whether it applies right now. Two externals drive that loop:
 *
 * - `get_storylet(index)` returns the divert target of the index-th storylet
 *   knot, in the order the knots appear in the compiled story.
 * - `storylet_count()` returns how many storylet knots exist, so the loop can
 *   stop; Calico's original loop had no safe end once the index ran past the
 *   last knot.
 *
 * Only top-level knots count: a `# storylet` tag on a stitch is not seen,
 * because stitches are not in the story's named content (Calico had the same
 * limit). Author storylets as knots.
 */

import type { Story } from 'inkjs';
import type { Container } from 'inkjs/engine/Container';

/** The tagged knots are fixed for a compiled story, so each Story is scanned once. */
const knotCache = new WeakMap<Story, string[]>();

/** Names of every knot tagged `# storylet`, in story order. */
export function storyletKnots(ink: Story): string[] {
	const cached = knotCache.get(ink);
	if (cached) return cached;
	const names: string[] = [];
	for (const name of ink.mainContentContainer.namedContent.keys()) {
		if ((ink.TagsForContentAtPath(name) ?? []).includes('storylet')) names.push(name);
	}
	knotCache.set(ink, names);
	return names;
}

/**
 * Bind the storylet external functions to an Ink story instance.
 * Safe to call on a story compiled without `storylets.ink`: a binding is
 * skipped when its function is not declared.
 */
export function bindStoryletFunctions(ink: Story): void {
	const bindings: Array<{ name: string; fn: (...args: unknown[]) => unknown }> = [
		{
			name: 'get_storylet',
			fn: (...args: unknown[]) => {
				const index = Number(args[0]);
				const knots = storyletKnots(ink);
				const knot = Number.isInteger(index) && index >= 0 ? knots[index] : undefined;
				// inkjs turns a Path return into a divert target; -1 is only ever seen past the count guard
				const container = knot ? (ink.mainContentContainer.namedContent.get(knot) as Container | undefined) : undefined;
				return container?.path ?? -1;
			}
		},
		{
			name: 'storylet_count',
			fn: () => storyletKnots(ink).length
		}
	];

	for (const { name, fn } of bindings) {
		try {
			ink.BindExternalFunction(name, fn);
		} catch {
			// Function not declared in this build of the story — safe to ignore
		}
	}
}
