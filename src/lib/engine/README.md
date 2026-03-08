# Nib

A small, generic runtime for playing [Ink](https://www.inklestudios.com/ink/) narratives in [SvelteKit](https://svelte.dev/) applications, using Svelte 5 runes for reactivity. Copy this directory into any SvelteKit project and write an `onInit` function to wire in your game logic.

## Files

| File | Purpose |
|------|---------|
| `story.svelte.ts` | Core runtime — loads compiled Ink JSON, manages reactive state, exposes the `story` API |
| `tags.ts` | Parses Ink tags (`#CLEAR`, `#mood:x`, `#class:x`) into structured data for the renderer |

## Quick Start

```ts
import { story, loadStory } from '$lib/engine/story.svelte';

// Load a compiled Ink JSON file (no game-specific setup)
await loadStory('/my-story.json');

// Or with game-specific initialization
await loadStory('/my-story.json', (ink) => {
  // Register external functions, populate data, etc.
  ink.BindExternalFunction('get_score', () => playerScore);
});

// Run the story
const { paragraphs, choices } = story.continue();

// Make a choice
story.choose(choices[0].index);
const next = story.continue();
```

## API

### `loadStory(jsonPath, onInit?)`

Fetches compiled Ink JSON and creates the story instance.

- **`jsonPath`** — URL or path to the `.json` file.
- **`onInit`** — Optional `(ink: Story) => void` callback. Called after the Story is created but before playback begins. This is where game-specific code should bind external functions and register data.

### `story` object

| Member | Description |
|--------|-------------|
| `continue()` | Advances the story until choices or end. Returns `{ paragraphs, choices }`. Processes tags on each line. |
| `choose(index)` | Selects a choice by index to advance the narrative. |
| `canContinue` | Whether the story has more content to continue. |
| `currentTags` | Tags on the most recently continued line. |
| `tick` | Reactive counter incremented after each `continue()`. Use inside `$derived()` to re-evaluate Ink variable reads. |
| `getVariable(name)` | Read an Ink variable. |
| `setVariable(name, value)` | Write an Ink variable. |
| `saveState()` | Serialise the full Ink state to a JSON string. |
| `loadState(json)` | Restore Ink state from a previously saved JSON string. |
| `ink` | Direct access to the raw inkjs `Story` instance. |

### Tag conventions

Tags are processed by `processTags()` from `tags.ts`:

- `#CLEAR` — wipe passage history before this line.
- `#mood:<name>` — set `document.documentElement.dataset.mood` for atmospheric CSS.
- `#class:<name>` — add a CSS class to the paragraph element.
- Bare tags — treated as CSS classes (Calico convention).

## Integration Pattern

The engine has **zero imports from game-specific code**. All game logic is injected through the `onInit` callback:

```
┌─────────────────────────────────────────┐
│  src/lib/engine/     (generic, reusable)│
│  ├── story.svelte.ts                    │
│  └── tags.ts                            │
└────────────────┬────────────────────────┘
                 │  onInit callback
┌────────────────▼────────────────────────┐
│  src/lib/game/       (project-specific) │
│  ├── init.ts         (integration point)│
│  ├── idea-bridge.ts  (external fns)     │
│  ├── ideas.ts        (data model)       │
│  ├── idea-catalog.ts (content)          │
│  └── recipes.ts      (game mechanics)   │
└─────────────────────────────────────────┘
```

To reuse Nib in another project, copy `src/lib/engine/` and write your own `onInit` function.
