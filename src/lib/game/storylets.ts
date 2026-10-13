/**
 * Storylet bindings for the Ink story.
 *
 * `get_storylet` is declared in `story/patches/storylets.ink`. It is currently
 * a stub: it warns and returns an empty string. Task 3EN.1 replaces it with the
 * real implementation (see `docs/calico-patches.md`).
 */

import type { Story } from 'inkjs';

/**
 * Bind the storylet external functions to an Ink story instance.
 * Safe to call on a story compiled without `storylets.ink`: the binding is
 * skipped when the function is not declared.
 */
export function bindStoryletFunctions(ink: Story): void {
	try {
		ink.BindExternalFunction('get_storylet', (index: number) => {
			console.warn(`get_storylet(${index}) called but storylets are not yet implemented`);
			return '';
		});
	} catch {
		// Function not declared in this build of the story — safe to ignore
	}
}
