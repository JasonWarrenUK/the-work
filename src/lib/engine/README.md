# Nib

A small runtime for playing [Ink](https://www.inklestudios.com/ink/) narratives in [SvelteKit](https://svelte.dev/) applications, using Svelte 5 runes for reactivity. Copy this directory into any SvelteKit project and write an `onInit` function to wire in your game logic.

## Files

| File | Purpose |
|------|---------|
| `story.svelte.ts` | Core runtime — loads compiled Ink JSON, manages reactive state, exposes the `story` API |
| `tags.ts` | Parses Ink tags (`#CLEAR`, `#mood:x`, `#class:x`, `#frame:`) into structured data for the renderer |
| `emphasis.ts` | Splits story text with `*emphasis*` and `**strong**` into styled segments, so a renderer builds real elements instead of injecting HTML (the game's `Emphasis.svelte` does this for paragraphs and choices) |
| `audio.ts` | Named-track audio player on Howler.js (a port of Calico's `musicplayer.js`): looping tracks, fade-in and fade-out, pause as mute, one track at a time by default. No tag handling; that layer sits on top |

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
| `loadState(json, choices?)` | Restore Ink state from a previously saved JSON string. `seed` is read back out of the loaded state and `choiceLog` is replaced with `choices`, the log saved alongside the JSON; without it the log is emptied. |
| `choiceLog` | The indices of the choices made through `choose()` since the story loaded, was last replayed or was restored with a log (a copy). Save it next to the state JSON and pass it back to `loadState()`. |
| `seed` | The random seed the current run started with; `null` before a story is loaded. |
| `replay(seed, choices)` | Rebuild a run silently: reset the story, restore the seed and re-make each choice without producing passages. The next `continue()` returns the passage after the last choice. Throws if a logged choice is not on offer at its step. See below. |
| `setAudio(player)` / `audio` | Attach the `AudioPlayer` that audio tags drive (null detaches). Loading, restoring or replaying a story never touches the player; detach before a silent replay. |
| `ink` | Direct access to the raw inkjs `Story` instance. |

### Replaying a run

`story.seed` and `story.choiceLog` together are enough to rebuild a run: inkjs is deterministic for a given seed and sequence of choices, so `replay()` reproduces the story's own state, `RANDOM` rolls and shuffles included. A save made of these two values stays small and survives story edits that do not change the choice structure; a state JSON does not survive edits at all.

Replay re-runs every external function, so anything a bound function mutates outside Ink is mutated again. Reset that state first (the game resets its inventory and body), then replay. Choices made with `ChoosePathString` or through the raw `ink` instance are not logged and cannot replay.

### Audio: `createAudioPlayer(options?, factory?)`

```ts
import { createAudioPlayer } from '$lib/engine/audio';

const audio = createAudioPlayer({ basePath: '/audio', volume: 0.5 });
audio.play('rain'); // /audio/rain.ogg, then /audio/rain.mp3; loops, fades in over 2s
audio.play('bells', { fadeIn: 500 }); // rain fades out first; bells starts when that fade ends
audio.pause('bells'); // muted, still playing; resume() picks up mid-loop
audio.stop(); // fade everything out and release it
```

| Member | Description |
|--------|-------------|
| `play(name, { fadeIn? })` | Start a named track, looping, fading in from silence. Already-started names are ignored. With `allowMultipleTracks` false (the default) every other track fades out first and the new one starts once those fades finish. |
| `stop(name?, { fadeOut? })` | Fade a track out and unload it; with no name, every track. A track queued behind a fade is dropped. |
| `pause(name)` / `resume(name)` | Mute a track in place and restore it, Calico's semantics: the loop keeps running underneath. |
| `setVolume(level)` | The volume every track plays at, clamped to 0 to 1 and applied at once to anything not paused. |
| `tracks` | Names of the started tracks, in start order. |
| `dispose()` | Stop and unload everything immediately, no fades. |

Options and their defaults: `basePath` `/audio`, `formats` `['ogg', 'mp3']`, `allowMultipleTracks` `false`, `fadeIn` `2000`, `fadeOut` `2000`, `volume` `0.5`. `trackSources(name, options)` gives the candidate files for a name, for anything that wants to preload them.

Browsers refuse to start audio before a user gesture, so the first `play()` should follow a click or a choice. The `factory` parameter swaps the `Howl` constructor for a stand-in; the tests use it and nothing else should need to.

### Tag conventions

Tags are processed by `processTags()` from `tags.ts`:

- `#CLEAR` — wipe passage history before this line.
- `#mood:<name>` — set `document.documentElement.dataset.mood` for atmospheric CSS.
- `#class:<name>` — add a CSS class to the paragraph element. `continue()` returns it in the paragraph's `classes`; the renderer applies it (the game's `Passage.svelte` sets it on the `<p>`).
- `#frame: a.png:6, b.png, c.gif:1.5; height:0.2` — a layered parallax frame for the paragraph (Calico `parallaxframes` syntax). Each comma-separated entry is a layer; `:<depth>` sets how little that layer moves (higher = less, default 1); options follow `;` (`height` is a fraction of the viewport; the game's renderer uses 0.3 when none is given). The tag may sit on its own line above the paragraph: inkjs attaches it to the next line of output. Calico wrote the separator as `|`, which the Ink compiler rejects inside a tag; the parser accepts either. `continue()` returns it parsed as the paragraph's `frame` (`FrameSpec`); the renderer draws it (the game's `ParallaxFrame.svelte` resolves names under `static/frames/` and tracks the pointer, disabled under `prefers-reduced-motion`).
- `#play: rain; fadein: 500`, `#stop: rain; fadeout: 100`, `#stop`, `#pause: rain`, `#resume: rain`, `#volume: 0.3` — audio instructions in Calico `musicplayer` syntax (options after `;`, or Calico's `|`). `continue()` and `choose()` carry them out on the player attached with `story.setAudio()`, in story order, and drop them when none is attached. A tag that names no track where one is needed, or a volume that is not a number, is ignored. Timing: `continue()` reads a whole passage before the renderer shows any of it, so a cue fires when its passage is produced, not when the reader reaches its line; put a cue on the passage's first line or on the choice that leads to it. `#volume:` sets the player-wide volume (Calico's notes give no per-track form).
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
