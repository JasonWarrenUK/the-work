# The Work — Development Guide

## Build & Check Commands

```bash
# Compile Ink story to JSON (required after any .ink file changes)
node node_modules/inkjs/bin/inkjs-compiler.js -o static/"The Work.json" story/"The Work.ink"

# TypeScript checking
bun run check

# Tests (Vitest; the story tests read the compiled static/"The Work.json", so compile first)
# Story-level tests share the harness in tests/story-session.ts (startAt, atMenu, pick, run, settle)
bun run test

# Dev server
bun run dev

# Build
bun run build
```

## Architecture

**SvelteKit + Ink (inkjs)** — narrative game where a Writer must compose a thesis overnight.

- **Ink** (story/*.ink) — narrative flow, choices, time management
- **Nib** (src/lib/engine/) — generic, reusable Ink runtime with Svelte 5 runes (see [Nib README](src/lib/engine/README.md))
- **Game** (src/lib/game/) — idea system, inventory, orthodoxy, recipes, Ink external function bindings
- **Integration** (src/lib/game/init.ts) — single entry point connecting game systems to the engine via `onInit` callback

### Key directories

| Path | Purpose |
|------|---------|
| `story/` | Ink source files (The Work.ink is the root) |
| `story/Hours/` | Per-hour chapter files — d1_1830 (setup), d1_1900 (prologue), d1_2000 through d2_0700 (gameplay loop, one file per hour), d2_0800 (ending) |
| `src/lib/engine/` | **Nib** — generic Ink runtime, story state, tag processing (zero game imports) |
| `src/lib/game/init.ts` | Game initialization — wires idea system into the engine |
| `src/lib/game/idea-bridge.ts` | Binds TypeScript functions as Ink EXTERNAL functions |
| `src/lib/game/ideas.ts` | Idea data model, inventory state, orthodoxy calculation |
| `src/lib/game/idea-catalog.ts` | Static catalog of all 67 observations (201 readings) + 40 inklings |
| `src/lib/game/recipes.ts` | Development and combination recipe engine |
| `design/` | Design documents (Ideas.md, Objects.md, Recipes.md, Disciplines.md, World.md) |
| `static/The Work.json` | Compiled Ink story (regenerate after .ink changes) |

### Nib vs Game Separation

**Nib** (`src/lib/engine/`) is the **generic, reusable Ink+Svelte runtime** with no knowledge of this game's mechanics. The `src/lib/game/` directory contains all game-specific logic. These rules maintain the boundary:

- **Nib (`src/lib/engine/`) must have zero imports from `$lib/game/`** — if you find yourself importing game code into the engine, the logic belongs in `game/` instead.
- **Game-specific Ink external function bindings go in `src/lib/game/`**, never in the engine: `idea-bridge.ts` for the idea system, `storylets.ts` for storylets. Each is called from `initGameSystems()`.
- **The `onInit` callback is the only integration point** — `loadStory(path, onInit)` passes the raw inkjs Story to game code for binding external functions and registering data.
- **Nib files must be documented with JSDoc** — every exported function and type needs a doc comment.
- To reuse Nib in another project, copy `src/lib/engine/` and write a new `onInit` function.

## Game Design Concepts

- **7 domains**: Rule, Faith, Truth, Class, Art, Nature, Morality
- **3 dreads**: Existential, Academic, Economic
- **6 idea levels**: Observation (1) → Inkling (2) → Idea (3) → Concept (4) → Argument (5) → Thesis (6)
- **21 disciplines**: every pairing of 7 domains, determines committee dynamics
- **Orthodoxy**: per-idea score (-100 to +100) per domain; thesis orthodoxy is derived from written ideas, never tracked directly
- **Selective writing**: player curates which specific ideas enter the thesis (level 3+)

## Ink Patterns & Gotchas

- **Tunnel pattern**: `-> observe ->` calls a knot that returns with `->->`. The caller continues after the `->`.
- **temp variable scoping**: `temp` vars cannot be redeclared across choice branches in the same stitch. Use inline `{fn()}` or separate stitches instead.
- **EXTERNAL functions**: declared in `story/IdeaSystem.ink`, bound in `src/lib/game/idea-bridge.ts`. Ink only supports string and number return values.
- **Inline function calls**: use `{functionName(args)}` to call and print result inline. Use `~ functionName(args)` to call without printing.
- **CHOICE_COUNT()**: used to show fallback options when no gated choices are available.
- **Sticky choices**: `+` is one-time, `*` is... wait, reversed: `*` is one-time (consumed), `+` is sticky (repeatable).
- **No externals in choice text**: inkjs raises a runtime error when a non-lookahead-safe external runs inside choice text (`[{get_idea_text(x)}]`), even when the choice's condition is false. Fetch the value into a `~ temp` before the choices and use `[{t}]`. Externals bound in `idea-bridge.ts` are not lookahead-safe.

## TypeScript Patterns

- **Svelte 5 runes**: use `$state()`, `$derived()` — not Svelte 4 stores
- **idea-bridge.ts function signatures**: all use `(...args: unknown[])` to satisfy TypeScript since Ink passes unknown types. Use helper `s()` to cast to string.
- **Game initialization**: `registerAllIdeas()`, `registerAuthoredRecipes()`, and `bindIdeaFunctions()` are called in `initGameSystems()` (src/lib/game/init.ts), which is passed to `loadStory()` as its `onInit` callback.

## Current State & Known Gaps

- Writing action in Tunnels.ink still uses domain-level write rather than true per-idea selective writing (see TODO comment in code)
- Timed sensory events (P49-P53) fire from `story/Sensory.ink`: `sensory_check` runs after `body_check` on every action, the hour→prompt slots live in `src/lib/game/sensory.ts` and the armed/handled hours are Ink VARs (saved with the story). The event lands after the first full action of its hour and offers its readings like an observation. Random events (Objects.md section H) and the per-hour variant tables without catalogue readings are not wired.
- Hidden/nested objects (P59-P67) are offered from the location menus in Observations.ink once their parent object's stitch has been visited (an Ink visit-count gate per choice); the shared `observe_hidden(prompt)` knot reads the prompt line and readings from the catalogue through the `prompt_text` and `prompt_reading` externals.
- Bodily states (3GS.2) live in `src/lib/game/body.ts` (pure logic, all tunable constants; tested by `body.test.ts`, run with `bun run test`) with a `$state` wrapper in `body.svelte.ts`. Ink ticks the body through `advanceTime(action)` and runs `body_check` after every action (`story/Body.ink`); P54-P58 readings are offered from the interrupt beat, so they are not in Observations.ink. Prose is placeholder. The StatusBar shows a chip per state at level 1 or above and a dread chip once dread is non-zero (`src/lib/game/body-indicators.ts` builds the chip data). Provisions and reading pools are 3GS.5 and 3GS.6. Design record: `docs/plans/bodily-states-spike.md`.
- **Ink weave gotcha**: a `--` gather inside a choice's body splits sibling `++` choices into separate choice sets, so a set whose choices are all unavailable ends the story ("ran out of content"). Keep one `++` set and let the bodies fall through to the single closing gather.
- Nib records every `story.choose()` into `story.choiceLog` and exposes the run's `story.seed`; `story.replay(seed, choices)` rebuilds a run silently (5EN.1). Nothing persists the log yet: `SaveData` still stores state JSON, and the caller must reset inventory and body before replaying (see `src/lib/game/replay.test.ts`)
- Nib has an audio player (`src/lib/engine/audio.ts`, Howler.js, 5PL.4) and `#play:`, `#stop`, `#pause:`, `#resume:` and `#volume:` tags drive it once the page calls `story.setAudio()` (5PL.5). The page does not attach one yet, no hour file carries an audio tag and there are no files under `static/audio/`; asset preloading is 5PL.6
- Saves are stamped with `APP_VERSION` (`src/lib/game/save-load.ts`), which `vite.config.ts` injects as `__APP_VERSION__` from `git describe --tags --always` (the deploy workflow fetches full history so tags are in reach). `loadChecked()` compares major.minor: a mismatch warns through `SaveToast` and still loads; an unreadable or unrestorable save reports its reason and the night starts fresh (5EN.3). Tests run with `APP_VERSION` as whatever the local checkout describes. `tests/save-fixtures.test.ts` loads one real save per tagged release from `tests/fixtures/saves/` and asserts that policy; capture a new fixture after each tag with `CAPTURE_SAVE_FIXTURE=<tag> bun run test tests/save-fixtures.test.ts` (5EN.7)
- Level 3+ ideas need authoring for writable content in playtesting
- Hours d1_2100 through d2_0700 are minimal loop stubs — each owns one hour of the night, guards on its own TimeNumber threshold, and chains to the next file when time advances. Per-hour narrative content goes here.

## Writing Style

- **PR descriptions** should use natural paragraphs, not hard-wrapped lines. They render as markdown, so let the renderer handle line breaks.
- **Commit messages** can follow the traditional 72-character wrap convention.

## Documentation Maintenance

- **When gameplay or mechanics change** — update the "Current State" section in `README.md` and the "Current State & Known Gaps" section above. If idea levels, domains, dreads, recipes, or disciplines are added/changed, update the relevant sections in both `README.md` and the design docs.
- **When Nib (the engine) changes** — update `src/lib/engine/README.md` with any new API surface, changed behaviour, or new tag conventions. If the integration pattern changes, update the architecture diagrams in both `README.md` and this file.
