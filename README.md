# The Work

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/JasonWarrenUK/the-work)

A narrative game built with **SvelteKit** and **Ink**, where a Writer must compose a thesis in a single night. Examine objects in a cramped bedsit, form observations, develop ideas, and defend your work before a committee that adapts to what you've written.

> Further reading: [World & Setting](design/World.md) | [Nib Engine](src/lib/engine/README.md) | [Development Guide](CLAUDE.md) | [Migration Plan](plan.md)

---

## Current State

The game is in **early development**. Core systems are in place but most content is unwritten.

**What works now:**
- The first two hours of narrative are playable (6:30pm–8:00pm) — the Writer arrives, settles in, and begins examining objects
- The idea system is functional end-to-end: examining objects produces observations, which can be developed into higher-level ideas
- 67 observations (with 201 domain readings) and 40 inklings are cataloged and wired into Ink
- Orthodoxy scoring tracks how conventional or radical each idea is
- Development and combination recipes can transform ideas through authored paths
- The **Nib** engine (generic Ink/Svelte runtime) is stable and reusable independently

**What's missing or incomplete:**
- Hours d1_2100 through d2_0700 are empty stubs — the bulk of the night is unwritten
- The thesis defence (d2_0800) has structure but needs the committee dynamics that emerge from what the player writes
- Writing action still operates at the domain level, not true per-idea selective writing
- Sensory events, bodily states, and hidden/nested objects are designed but have no trigger mechanisms in Ink yet
- Level 3+ ideas need authored content for the writing interface
- No save/load UI yet (the engine supports it, the game doesn't surface it)

---

## The Game

The Writer is poor, educated beyond their economic station, and has deferred the thesis defence twice. This is the last chance. From 6:30pm to 8:00am, the player examines objects around the room, chooses how to interpret what they find, and builds a thesis from the ground up.

Every object implies a world — a post-revolutionary republic, a compromised church, a war that won't end, a university that controls what can be known. The player never leaves the desk. The world arrives through details.

> Further reading: [World & Setting](design/World.md)

### Ideas

Ideas are the units of play. They progress through six levels — from raw **Observation** to defensible **Thesis** — each tagged with domains and an orthodoxy score that places them on a spectrum from establishment alignment to dangerous rejection.

| Level | Name | Description |
|-------|------|-------------|
| 1 | Observation | You notice something. A surface detail. |
| 2 | Inkling | A vague sense that something connects. |
| 3 | Idea | A clear thought. Can be written into the thesis. |
| 4 | Concept | Structured understanding. |
| 5 | Argument | A defensible position. |
| 6 | Thesis | Complete, rigorous, yours. |

Ideas are produced by examining [objects](design/Objects.md), developed by dwelling on them, and combined through authored [recipes](design/Recipes.md).

> Further reading: [Ideas](design/Ideas.md) | [Objects](design/Objects.md) | [Recipes](design/Recipes.md)

### Domains & Disciplines

Seven domains shape the intellectual landscape: **Rule**, **Faith**, **Truth**, **Class**, **Art**, **Nature**, **Morality**. Three dreads erode the Writer's ability to work: **Existential**, **Academic**, **Economic**.

The Writer's discipline is not chosen — it emerges. Every pairing of two domains defines one of 21 disciplines, from Political Theology (Rule + Faith) to Moral Ecology (Nature + Morality). The dominant discipline in the written work determines which committee member becomes chair.

> Further reading: [Disciplines](design/Disciplines.md) | [World — Established Doctrine & Counter-Doctrine](design/World.md#the-established-doctrine-100)

---

## Architecture

The codebase separates **Nib** (a generic, reusable Ink/Svelte runtime) from **game-specific logic**. Nib knows nothing about ideas, domains, or orthodoxy. Game systems are injected through a single `onInit` callback.

```
┌─────────────────────────────────────────┐
│  Nib — src/lib/engine/  (generic, copy) │
│  ├── story.svelte.ts  — Ink runtime     │
│  └── tags.ts          — tag processing  │
└────────────────┬────────────────────────┘
                 │  onInit callback
┌────────────────▼────────────────────────┐
│  src/lib/game/       (project-specific) │
│  ├── init.ts         — integration point│
│  ├── idea-bridge.ts  — Ink externals    │
│  ├── ideas.ts        — data model       │
│  ├── idea-catalog.ts — 67 observations  │
│  └── recipes.ts      — game mechanics   │
└─────────────────────────────────────────┘
```

### What is Nib?

**Nib** is the generic Ink+Svelte engine that lives in `src/lib/engine/`. It handles story loading, reactive state management (Svelte 5 runes), tag processing, and save/load — with zero knowledge of any particular game's mechanics. To use Nib in another project, copy `src/lib/engine/` and write your own `onInit` function to bind game logic.

> Further reading: [Nib API & Integration Pattern](src/lib/engine/README.md) | [Development Guide — Architecture](CLAUDE.md#architecture)

### Key Directories

| Path | Purpose | Docs |
|------|---------|------|
| `story/` | Ink source files (`The Work.ink` is the root) | [Ink Patterns](CLAUDE.md#ink-patterns--gotchas) |
| `story/Hours/` | Per-hour chapter files (d1_1830 through d2_0800) | — |
| `src/lib/engine/` | **Nib** — generic Ink+Svelte runtime (zero game imports) | [Nib README](src/lib/engine/README.md) |
| `src/lib/game/` | Idea system, inventory, orthodoxy, recipes | [Development Guide](CLAUDE.md#architecture) |
| `src/lib/components/` | Svelte UI components (Passage, ChoiceList, StatusBar) | — |
| `design/` | Game design documents | See below |
| `static/The Work.json` | Compiled Ink story (generated, not edited) | — |

### Design Documents

| Document | Contents |
|----------|----------|
| [Ideas.md](design/Ideas.md) | 67 observations, 40 inklings, orthodoxy scores, level definitions |
| [Objects.md](design/Objects.md) | 54 physical items, sensory events, bodily states, nested objects |
| [Recipes.md](design/Recipes.md) | Development and combination recipe framework |
| [Disciplines.md](design/Disciplines.md) | 21 disciplines, committee dynamics, endings |
| [World.md](design/World.md) | Setting, established doctrine, counter-doctrine, design principles |

---

## Getting Started

### Prerequisites

- Node.js (or Bun)

### Setup

```bash
npm install
```

### Compile the Ink Story

Required after any changes to `.ink` files:

```bash
node node_modules/inkjs/bin/inkjs-compiler.js -o static/"The Work.json" story/"The Work.ink"
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview   # preview the built output
```

### Type Checking

```bash
npx svelte-check --tsconfig ./tsconfig.json
```

> Further reading: [Development Guide — Build & Check Commands](CLAUDE.md#build--check-commands)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit + `adapter-static` |
| Narrative engine | Ink (via inkjs), wrapped by **Nib** (`src/lib/engine/`) |
| Reactivity | Svelte 5 runes (`$state`, `$derived`) |
| Language | TypeScript |
| Build tool | Vite |

> Further reading: [Migration Plan — Tech Stack](plan.md)
