# Nib

A small runtime for playing [Ink](https://www.inklestudios.com/ink/) narratives in [SvelteKit](https://svelte.dev/) applications, using Svelte 5 runes for reactivity. Copy this directory into any SvelteKit project and write an `onInit` function to wire in your game logic.

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
| `continue()` | Advances the story until choices or end. Returns `{ paragraphs, choices }`, where each paragraph is a `StoryParagraph` (`{ text, classes, frame }`) and each choice is a `StoryChoice` (`{ index, text, tags }`). Processes tags on each line. |
| `choose(index)` | Selects a choice by index to advance the narrative. Applies a `#mood:` tag on that choice before advancing. |
| `canContinue` | Whether the story has more content to continue. |
| `currentTags` | Tags on the most recently continued line. |
| `variable(name)` | Read an Ink variable reactively. The first read registers an inkjs variable observer, so a `$derived()` calling it re-evaluates whenever the story assigns that variable. Undeclared names read as `undefined`. |
| `issues` | Reactive list of `StoryIssue` (`{ level: 'error' \| 'warning', message }`) the Ink runtime has reported since load. Author and runtime errors are `error`; only inkjs `Warning` is `warning`. Still echoed to the console. |
| `clearIssues()` | Empties `issues`. A fresh `loadStory()` also empties it. |
| `getVariable(name)` | Read an Ink variable once, without reactivity. |
| `setVariable(name, value)` | Write an Ink variable. |
| `saveState()` | Serialise the full Ink state to a JSON string. |
| `loadState(json)` | Restore Ink state from a previously saved JSON string. |
| `ink` | Direct access to the raw inkjs `Story` instance. |

### Tag conventions

Tags are processed by `processTags()` from `tags.ts`:

- `#CLEAR` — wipe passage history before this line.
- `#mood:<name>` — set `document.documentElement.dataset.mood` for atmospheric CSS.
- `#class:<name>` — add a CSS class to the paragraph element. `continue()` returns it in the paragraph's `classes`; the renderer applies it (the game's `Passage.svelte` sets it on the `<p>`).
- `#frame: a.png:6, b.png, c.gif:1.5; height:0.2` — a layered parallax frame for the paragraph (Calico `parallaxframes` syntax). Each comma-separated entry is a layer; `:<depth>` sets how little that layer moves (higher = less, default 1); options follow `;` (`height` is a fraction of the viewport; the game's renderer uses 0.3 when none is given). The tag may sit on its own line above the paragraph: inkjs attaches it to the next line of output. Calico wrote the separator as `|`, which the Ink compiler rejects inside a tag; the parser accepts either. `continue()` returns it parsed as the paragraph's `frame` (`FrameSpec`); the renderer draws it (the game's `ParallaxFrame.svelte` resolves names under `static/frames/` and tracks the pointer, disabled under `prefers-reduced-motion`).
- Bare tags — treated as CSS classes (Calico convention).

Tags can also sit on a choice (`+ Attend to The Work #mood:textual`). They arrive in `choices[].tags`, and `choose()` applies a choice's `#mood:` when that choice is selected. The renderer decides what a mood-tagged choice set means; Nib only applies the mood.

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
