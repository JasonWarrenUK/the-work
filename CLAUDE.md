# The Work — Development Guide

## Build & Check Commands

```bash
# Compile Ink story to JSON (required after any .ink file changes)
node node_modules/inkjs/bin/inkjs-compiler.js -o static/"The Work.json" story/"The Work.ink"

# TypeScript checking
npx svelte-check --tsconfig ./tsconfig.json

# Dev server
npm run dev

# Build
npm run build
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
| `story/Hours/` | Per-hour chapter files (d1_1830.ink through d2_0800.ink) |
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
- **Game-specific Ink external function bindings go in `src/lib/game/idea-bridge.ts`**, not in the engine.
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

## TypeScript Patterns

- **Svelte 5 runes**: use `$state()`, `$derived()` — not Svelte 4 stores
- **idea-bridge.ts function signatures**: all use `(...args: unknown[])` to satisfy TypeScript since Ink passes unknown types. Use helper `s()` to cast to string.
- **Game initialization**: `registerAllIdeas()`, `registerAuthoredRecipes()`, and `bindIdeaFunctions()` are called in `initGameSystems()` (src/lib/game/init.ts), which is passed to `loadStory()` as its `onInit` callback.

## Current State & Known Gaps

- Writing action in Tunnels.ink still uses domain-level write rather than true per-idea selective writing (see TODO comment in code)
- Sensory events (P49-P53), bodily states (P54-P58), and hidden/nested objects (P59-P67) are cataloged but NOT in Observations.ink — they need different trigger mechanisms
- Level 3+ ideas need authoring for writable content in playtesting
- Hours d1_2100 through d2_0700 are empty stubs (chain forward)

## Writing Style

- **PR descriptions** should use natural paragraphs, not hard-wrapped lines. They render as markdown, so let the renderer handle line breaks.
- **Commit messages** can follow the traditional 72-character wrap convention.

## Documentation Maintenance

- **When gameplay or mechanics change** — update the "Current State" section in `README.md` and the "Current State & Known Gaps" section above. If idea levels, domains, dreads, recipes, or disciplines are added/changed, update the relevant sections in both `README.md` and the design docs.
- **When Nib (the engine) changes** — update `src/lib/engine/README.md` with any new API surface, changed behaviour, or new tag conventions. If the integration pattern changes, update the architecture diagrams in both `README.md` and this file.
