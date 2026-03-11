# Plan: Extract Nib to a Separate Repository

## Context

Nib is the generic, reusable Ink+Svelte 5 runtime living at `src/lib/engine/`. It's 3 files (254 lines of TypeScript + README), has zero imports from game code, and a clean integration boundary via its `onInit` callback. This makes it an excellent candidate for extraction into a standalone package.

## Current State

**Engine files** (src/lib/engine/):
- `story.svelte.ts` (197 lines) — core runtime: loads Ink JSON, manages reactive story state with Svelte 5 runes
- `tags.ts` (57 lines) — parses Ink tags into structured data
- `README.md` (88 lines) — documents API and integration pattern

**Dependencies**: `inkjs` (runtime), `svelte` 5 (runes for reactivity)

**Consumers in this project**: `+page.svelte` and `StatusBar.svelte` import from `$lib/engine/story.svelte`

**Integration point**: `loadStory(path, onInit)` where `onInit` receives the raw inkjs `Story` for binding external functions

## Extraction Plan

### Phase 1: Prepare Nib for Standalone Use

#### 1.1 Create the new repository structure

```
nib/
├── src/
│   └── lib/
│       ├── index.ts              # Package entry — re-exports public API
│       ├── story.svelte.ts       # Copied from engine, with import paths adjusted
│       └── tags.ts               # Copied as-is
├── package.json              # New package config (see below)
├── tsconfig.json
├── svelte.config.js          # Minimal config for Svelte package tooling
├── vite.config.ts            # Build config using @sveltejs/package
├── README.md                 # Expanded from current engine README
├── LICENSE
└── .gitignore
```

#### 1.2 Package configuration

The `package.json` should declare:
- **name**: `nib-ink` (or scoped, e.g. `@nib/ink`)
- **type**: `module`
- **peerDependencies**: `svelte` ^5.0.0, `inkjs` ^2.0.0
- **devDependencies**: `svelte`, `inkjs`, `@sveltejs/package`, `typescript`, `vite`, `@sveltejs/vite-plugin-svelte`, `vitest`
- **svelte** and **exports** fields pointing at the built package output
- Build using `@sveltejs/package` which produces a `dist/` with proper Svelte component/runes packaging

#### 1.3 Create `src/lib/index.ts` entry point

```ts
export { loadStory, story } from './story.svelte.js';
export type { Story } from 'inkjs';
export { processTags } from './tags.js';
export type { TagResult } from './tags.js';
```

#### 1.4 Adjust internal imports

`story.svelte.ts` currently imports `./tags` — this stays the same. No other internal imports to adjust. The only change is removing the `$lib/engine/` path alias since the package will use relative imports.

#### 1.5 Add tests

The engine currently has zero tests. Before publishing as a standalone package, add at minimum:
- Unit tests for `processTags()` (pure function, easy to test)
- Integration tests for `loadStory()` and `story` object using a minimal test Ink story
- Framework: Vitest (already compatible with Vite/Svelte ecosystem)

### Phase 2: Publish the Package

#### 2.1 Choose distribution method

Options (in order of simplicity):
1. **Git dependency** — `"nib-ink": "github:user/nib"` in package.json. Zero publishing overhead, good for fast iteration.
2. **npm package** — `npm publish` (public or scoped). Standard, works everywhere. Move to this when the API stabilises.
3. **GitHub Package Registry** — good for private/org-scoped packages.

Recommendation: Start with **git dependency** for fast iteration, move to npm when the API stabilises.

#### 2.2 Build and verify

- Run `@sveltejs/package` to produce the `dist/` directory
- Verify the package works by installing it locally in The Work before publishing
- Run `npx svelte-check` on the built output

### Phase 3: Migrate The Work to Use the Package

#### 3.1 Install Nib as a dependency

```bash
npm install nib-ink   # or github:user/nib
```

#### 3.2 Update imports across the project

Three files need changes:

**src/routes/+page.svelte:**
```diff
- import { story, loadStory } from '$lib/engine/story.svelte';
+ import { story, loadStory } from 'nib-ink';
```

**src/lib/components/StatusBar.svelte:**
```diff
- import { story } from '$lib/engine/story.svelte';
+ import { story } from 'nib-ink';
```

**src/lib/game/init.ts** — uses `Story` type:
```diff
- import type { Story } from '$lib/engine/story.svelte';
+ import type { Story } from 'nib-ink';
```

#### 3.3 Remove the engine directory

Delete `src/lib/engine/` entirely from The Work.

#### 3.4 Update documentation

- Update `CLAUDE.md` — change architecture section, key directories table, Nib vs Game separation rules to reference the external package
- Update `README.md` — reference Nib as an external dependency
- Add a note in the Nib repo's README pointing back to The Work as a reference implementation

### Phase 4: Ongoing Maintenance

#### 4.1 Versioning strategy

Use semver. The API surface is small enough that breaking changes should be rare:
- `loadStory(path, onInit?)` — main entry point
- `story` object — reactive state container
- `processTags(tags)` — tag parser
- `TagResult` / `Story` types

#### 4.2 CI for the Nib repo

- Type checking (`svelte-check`)
- Tests (Vitest)
- Package build (`@sveltejs/package`)
- Optionally publish on tag/release

## Risks and Considerations

1. **Svelte 5 runes in a package**: `@sveltejs/package` handles this, but consumers must be on Svelte 5. This is fine since runes are the current API.

2. **The `$state()` singleton pattern**: The `story` object is a module-level singleton using `$state()`. This works in a package because Svelte's compiler transforms `$state()` at build time in the consumer's bundle. However, it means only one story can be active at a time. A future enhancement could make this instantiable, but that's out of scope for extraction.

3. **Fetch dependency**: `loadStory` uses the global `fetch` API. This works in browsers and in SvelteKit's SSR, but wouldn't work in plain Node without a polyfill. This is fine for the target use case.

4. **Tag conventions are opinionated**: The `#CLEAR`, `#mood:x`, `#class:x` tag format is a convention, not a standard. Document it clearly and consider making it extensible later.

5. **No breaking changes needed**: The current API is clean enough to extract as-is. No refactoring required before extraction.
