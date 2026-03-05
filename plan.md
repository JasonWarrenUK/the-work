# Migration Plan: Calico → inkjs + Vite + TypeScript

## What We're Replacing

Calico currently provides:
1. **Story loop** — calls `story.Continue()`, renders text/choices to DOM
2. **Text animation** — fade-in with configurable delays (50ms between lines, 500ms fade)
3. **Keyboard shortcuts** — 1-9/z/x/c for choices, spacebar for single choice
4. **Tag processing** — `#CLEAR` fades out passage, custom tags for styling
5. **Patches** — markdown→HTML, choice styling, drag-to-scroll, autosave, etc.
6. **External function binding** — bridges Ink `EXTERNAL` calls to JS

We keep **all .ink files unchanged**. The narrative and game logic stay in Ink.

## New Architecture

```
the-work/
├── src/
│   ├── main.ts              # Entry point: init story, start game loop
│   ├── engine/
│   │   ├── story-runner.ts   # Core loop: continue, render, handle choices
│   │   ├── renderer.ts       # DOM rendering with fade animations
│   │   ├── tags.ts           # Tag processor (#CLEAR, #class, etc.)
│   │   └── keyboard.ts       # Keyboard shortcut bindings
│   ├── game/
│   │   ├── external-fns.ts   # All EXTERNAL function implementations
│   │   ├── state.ts          # Game state types & helpers
│   │   └── save-load.ts      # localStorage persistence
│   └── style.css             # Migrated from existing style.css
├── story/                    # All .ink files (unchanged)
│   ├── The Work.ink
│   ├── Definitions.ink
│   ├── Functions.ink
│   ├── Database.ink
│   ├── Tunnels.ink
│   ├── Hours/
│   │   ├── d1_1830.ink
│   │   ├── d1_1900.ink
│   │   ├── d1_2000.ink
│   │   └── d2_0800.ink
│   └── patches/
│       └── storylets.ink
├── design/                   # Design docs (moved, unchanged)
├── public/
│   └── The Work.json         # Pre-compiled story (or compile at build time)
├── index.html                # Vite entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Implementation Steps

### Phase 1: Scaffold (get it building)
1. `npm init` + install `inkjs`, `vite`, `typescript`
2. Create `tsconfig.json`, `vite.config.ts`
3. Create minimal `index.html` + `src/main.ts`
4. Move `.ink` files to `story/`, design docs to `design/`
5. Copy compiled `The Work.json` to `public/`
6. Verify `npm run dev` starts Vite

### Phase 2: Story Runner (get it playing)
1. `story-runner.ts` — load JSON, create `Story`, implement continue loop
2. `renderer.ts` — render paragraphs + choices to `#story` div with fade animation
3. `tags.ts` — process `#CLEAR` (fade out + clear passage) and class tags
4. `external-fns.ts` — bind all 8 external functions (`incrementTimeNumber`, `BeginScene`, `updateWorldState`, `updateTimeName`, `updateConvictionDesc`, `printSituation`, `printTimeName`, `printTimeDesc`, `printConviction`)
5. Wire up choice click handlers

### Phase 3: Polish (get it feeling right)
1. `keyboard.ts` — 1-9, z/x/c, spacebar shortcuts
2. `save-load.ts` — localStorage autosave/load
3. `style.css` — port existing styles, adjust for new DOM structure
4. Test full playthrough from `debugMenu` and `gameMenu`

### Phase 4: Verify
1. All scenes reachable and playable
2. External functions produce correct output
3. Animations match original feel
4. Keyboard shortcuts work
5. Save/load works across browser refresh

## What We're NOT Porting (for now)
- `markdowntohtml.js` — only needed if Ink output uses markdown (check usage)
- `parallaxframes.js` — visual effect, add later if wanted
- `musicplayer.js` — no audio files exist yet
- `dragtoscroll.js` — nice-to-have, not critical
- `storylets.js` — check if actively used in current story flow
- `minwordsperline.js` — cosmetic, add later if text wrapping is ugly
- `stepback.js` — undo feature, nice-to-have

## Key Technical Decisions
- **inkjs v2.4.0** — latest, has TypeScript types
- **Vite** — fast dev server, HMR, simple config
- **No framework** (no React/Svelte) — DOM manipulation is simple enough; a framework adds weight for no benefit in a text game
- **Pre-compiled JSON** — compile .ink → .json externally (using Inky or `npx inkjs`), store in `public/`. Can add build-time compilation later.
- **Story as source of truth** — game state lives in Ink variables, not duplicated in TS. External functions read/write via `story.variablesState`.
