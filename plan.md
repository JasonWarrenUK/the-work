# Migration Plan: Calico → SvelteKit + inkjs + TypeScript

## What We're Replacing

Calico currently provides:
1. **Story loop** — calls `story.Continue()`, renders text/choices to DOM
2. **Text animation** — fade-in with configurable delays (50ms between lines, 500ms fade)
3. **Keyboard shortcuts** — 1-9/z/x/c for choices, spacebar for single choice
4. **Tag processing** — `#CLEAR` fades out passage, custom tags for styling
5. **Patches** — markdown→HTML, choice styling, drag-to-scroll, autosave, etc.
6. **External function binding** — bridges Ink `EXTERNAL` calls to JS

We keep **all .ink files unchanged**. The narrative and game logic stay in Ink.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | **SvelteKit** + `adapter-static` | File-based routing for game/menu/settings, SSG output deploys anywhere (itch.io, Netlify), compiles away to minimal JS |
| **Reactivity** | **Svelte 5 runes** | `$state`, `$derived`, `$effect` — no external state library needed for ~30 ink variables |
| **Story engine** | **inkjs** | Direct integration, TypeScript typed, wrap in a Svelte service |
| **UI components** | **shadcn-svelte** | Copy-paste components (not a dependency), full visual control, built-in dark mode via CSS variables. Built on Bits UI + Melt UI |
| **Styling** | **Tailwind CSS v4** + custom CSS variables | Atmospheric theming — swap palettes by changing variable sets |
| **Text animation** | **GSAP** (free) + SplitText | Word-by-word reveal, typewriter effects, timeline sequencing. Now fully free including all plugins |
| **Built-in transitions** | Svelte `fade`, `fly`, `blur`, `slide` | Passage fades, choice slides, scene transitions — native, zero-dependency |
| **Audio** | **Howler.js** (7KB) | Ambient loops, SFX, crossfading, handles autoplay restrictions |
| **Typography** | **Literata** variable font | Designed for long reading, weight axis animatable for mood shifts |
| **PWA** | **vite-plugin-pwa** | Offline play, installable, service worker auto-generated |

---

## New Architecture

```
the-work/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte        # App shell: vignette, grain overlay, audio context
│   │   ├── +page.svelte           # Game screen
│   │   ├── menu/
│   │   │   └── +page.svelte       # Main menu / title screen
│   │   └── settings/
│   │       └── +page.svelte       # Settings (audio, text speed, accessibility)
│   │
│   ├── lib/
│   │   ├── engine/
│   │   │   ├── story.svelte.ts    # inkjs wrapper: load, continue, choices, variables
│   │   │   ├── tags.ts            # Tag processor (#CLEAR, #class, #mood, etc.)
│   │   │   └── external-fns.ts    # All 8 EXTERNAL function implementations
│   │   │
│   │   ├── components/
│   │   │   ├── Passage.svelte     # Renders text lines with GSAP reveal animation
│   │   │   ├── ChoiceList.svelte  # Renders choices with keyboard shortcuts
│   │   │   ├── StatusBar.svelte   # Time, conviction, progress display
│   │   │   └── Grain.svelte       # CSS film grain + vignette overlay
│   │   │
│   │   ├── game/
│   │   │   ├── state.svelte.ts    # Reactive game state synced with ink variables
│   │   │   ├── save-load.ts       # localStorage persistence
│   │   │   └── audio.ts           # Howler.js wrapper for ambient/SFX
│   │   │
│   │   └── styles/
│   │       └── theme.css          # CSS variables for atmospheric theming
│   │
│   ├── app.html                   # SvelteKit HTML template
│   └── app.css                    # Tailwind imports + base styles
│
├── static/
│   └── The Work.json              # Pre-compiled story
│
├── story/                         # All .ink source files (unchanged)
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
│
├── design/                        # Design docs (moved, unchanged)
│
├── package.json
├── svelte.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Implementation Phases

### Phase 1: Scaffold (get it building)
1. `npx sv create` with Svelte 5 + TypeScript + Tailwind
2. Install: `inkjs`, `gsap`, `howler`, `vite-plugin-pwa`
3. Add `adapter-static` to `svelte.config.js`
4. Set up shadcn-svelte (`npx shadcn-svelte@latest init`)
5. Move `.ink` files to `story/`, design docs to `design/`
6. Copy compiled `The Work.json` to `static/`
7. Create dark atmospheric theme in `theme.css` (CSS variables)
8. Verify `npm run dev` starts

### Phase 2: Story Engine (get it playing)
1. `story.svelte.ts` — load JSON, create inkjs Story, expose reactive continue/choice API
2. `external-fns.ts` — bind all 8 external functions
3. `tags.ts` — process `#CLEAR`, `#class`, and custom tags (extensible for `#mood`, `#sound` later)
4. `state.svelte.ts` — sync ink variables to Svelte reactive state via `$state`
5. Basic `+page.svelte` game route that runs the story loop

### Phase 3: Presentation (get it looking right)
1. `Passage.svelte` — text lines with GSAP SplitText word-by-word reveal
2. `ChoiceList.svelte` — choices with fade-in, hover effects, keyboard shortcuts (1-9, z/x/c, spacebar)
3. `Grain.svelte` — CSS film grain overlay + vignette (pure CSS, zero perf cost)
4. Atmospheric CSS: mood-based background colour shifts via ink tags (`body[data-mood]`)
5. Typography: Literata variable font, `text-wrap: pretty`, careful spacing
6. Accessibility: `aria-live="polite"` on story container, semantic HTML, `prefers-reduced-motion`, `:focus-visible`

### Phase 4: Polish (get it feeling complete)
1. `save-load.ts` — localStorage autosave + manual save/load
2. `audio.ts` — Howler.js wrapper, ambient crossfading triggered by scene tags
3. Menu route (`/menu`) — title screen, new game, continue, settings
4. Settings route (`/settings`) — text speed, audio volume, high contrast toggle
5. `StatusBar.svelte` — time display, conviction meter
6. PWA setup via `vite-plugin-pwa` — offline play, installable

### Phase 5: Verify
1. Full playthrough from `debugMenu` and `gameMenu`
2. All external functions produce correct output
3. Animations feel atmospheric (not distracting)
4. Keyboard shortcuts work throughout
5. Save/load persists across browser refresh
6. Accessibility audit: screen reader, keyboard-only, reduced motion
7. Build and test static output (`npm run build && npm run preview`)

---

## Atmospheric Effects (CSS-only, added in Phase 3)

**Film grain** — CSS pseudo-element with noise SVG, `steps()` animation
**Vignette** — `box-shadow: inset 0 0 150px rgba(0,0,0,0.7)`
**Mood colours** — `body[data-mood="tense"] { background-color: #1a0a0a }` with 2s transition
**Typography** — Literata variable font, `font-variant-numeric: oldstyle-nums`, `::selection` themed

All respect `prefers-reduced-motion` and `prefers-contrast: more`.

---

## What We're Deferring
- **tsParticles** — ambient dust/fireflies, add for specific moments if wanted
- **Storylets patch** — check if actively used, port if needed
- **Markdown rendering** — check if ink output uses markdown
- **Step-back/undo** — nice-to-have, not critical for initial build
- **Analytics** — Plausible or custom beacon, add when playtesting with others
- **Cloud save sync** — localStorage is enough for now

---

## Key Technical Decisions

- **SvelteKit over plain Vite** — routing, SSG, preloading earn their keep for a polished game with menus/settings
- **shadcn-svelte** — components are copied into project (not a dependency), full control over every pixel, dark mode built-in
- **GSAP for text** — now fully free, SplitText + ScrambleText give word-by-word and cipher reveal effects that elevate the atmosphere
- **Svelte 5 runes for state** — `$state` with deep reactivity handles ~30 game variables without XState or external stores
- **Ink as source of truth** — game state lives in ink variables, `state.svelte.ts` syncs them reactively to the UI
- **Pre-compiled JSON** — compile `.ink` → `.json` externally (Inky or inklecate), store in `static/`. Build-time compilation can be added later
- **No Three.js/WebGL** — CSS-only atmospheric effects are sufficient for a text game and cost zero performance
- **Howler.js over Tone.js** — pre-recorded ambient audio, not procedural synthesis
