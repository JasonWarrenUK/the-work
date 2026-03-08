/**
 * Game-specific story initialization for "The Work".
 *
 * This module is the single integration point between the generic Ink engine
 * and the game's idea system. Pass {@link initGameSystems} as the `onInit`
 * callback to `loadStory()`.
 */

import type { Story } from 'inkjs';
import { registerAllIdeas } from './idea-catalog';
import { registerAuthoredRecipes } from './recipes';
import { bindIdeaFunctions } from './idea-bridge';

/**
 * Register all game data and bind external functions to the Ink story.
 * Called by the engine after the story is loaded but before playback begins.
 */
export function initGameSystems(ink: Story): void {
	registerAllIdeas();
	registerAuthoredRecipes();
	bindIdeaFunctions(ink);
}
