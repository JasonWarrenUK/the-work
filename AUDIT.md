# Audit: inkjs Integration Branch

Scope: 6 commits on this branch (from `8d6c70f` to `71c89ab`).
Focus: Implementation correctness, inkjs best practices, security.

---

## Critical

### 1. XSS via unsanitised `{@html}` in Passage.svelte

**File:** `src/lib/components/Passage.svelte:13`

```svelte
{@html text}
```

Ink's `Continue()` returns raw strings. The `{@html}` tag injects them into the DOM without sanitisation. Svelte's own documentation warns: "Svelte does not sanitize expressions before injecting HTML." While the `.ink` source is author-controlled today, ink output can include interpolated variable values and external function return values — any of which could contain angle brackets or script tags if the story logic ever produces unexpected output.

**Fix:** Either render with `{text}` (escaping HTML entities) or sanitise with DOMPurify before passing to `{@html}`. If the ink story genuinely needs HTML formatting (e.g. bold, italic), use DOMPurify with an allowlist.

**References:**
- [Svelte `{@html}` XSS warning](https://github.com/sveltejs/svelte/issues/7253)
- [svelte/no-at-html-tags ESLint rule](https://sveltejs.github.io/eslint-plugin-svelte/rules/no-at-html-tags/)

---

### 2. Missing `onError` handler on the Story instance

**File:** `src/lib/engine/story.svelte.ts:17`

The inkjs documentation [strongly recommends](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md) assigning an error handler immediately after creating a Story:

```js
story.onError = (message, type) => { ... };
```

Without this, any runtime ink error (bad variable access, invalid flow, etc.) throws an unhandled `StoryException` that will crash the game with a cryptic stack trace. The current code has no error handler.

---

### 3. Missing external function binding for `EXTERNAL get_storylet(index)`

**File:** `story/patches/storylets.ink:41`

The ink source declares `EXTERNAL get_storylet(index)`. The plan (`plan.md`) references `external-fns.ts` for "all 8 EXTERNAL function implementations", but this file does not exist and no `BindExternalFunction` calls are made anywhere in the codebase.

Per [inkjs best practices](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md), external functions **must** be bound before the story runs, or inkjs will throw a `StoryException`. The storylets patch is not currently INCLUDEd in `The Work.ink`, so this doesn't crash yet — but if it's ever included, it will.

---

## High

### 4. StatusBar `$derived` will never reactively update

**File:** `src/lib/components/StatusBar.svelte:5-6`

```ts
let timeName = $derived((story.getVariable('TimeName') as string) ?? '');
let convictionDesc = $derived((story.getVariable('ConvictionDesc') as string) ?? '');
```

This looks reactive but isn't. `story.getVariable()` reads from `state.inkStory.variablesState`, which is a plain inkjs object — not a Svelte `$state` proxy. Svelte 5's `$derived` tracks property access on `$state` objects, but ink's `variablesState` is opaque to Svelte's reactivity system. These derived values will compute once (when `state.inkStory` is first assigned) and then **never update** when ink variables change during gameplay.

**Fix options:**
- Use inkjs's `ObserveVariable()` API to push variable changes into `$state` values.
- Re-derive after each `continue()` call by bumping a reactive counter/signal.
- Use `$effect` polling on a reactive "tick" that increments after each story step.

### 5. `state.svelte.ts` is dead code with the same reactivity bug

**File:** `src/lib/game/state.svelte.ts`

`getGameState()` is exported but never imported anywhere. It also suffers from the same non-reactivity issue as the StatusBar — the getter functions call `story.getVariable()` which reads from non-reactive inkjs internals.

---

### 6. Save/load uses `LoadJsonObj` with redundant `JSON.parse`

**File:** `src/lib/engine/story.svelte.ts:102`

```ts
ink.state.LoadJsonObj(JSON.parse(json));
```

The `json` parameter is already a string (from `toJson()` → `localStorage` → back). The idiomatic inkjs API for loading from a string is:

```ts
ink.state.LoadJson(json);
```

`LoadJson` handles parsing internally. Using `LoadJsonObj(JSON.parse(json))` works, but bypasses `LoadJson`'s internal post-load callbacks (like `onDidLoadState`). This is not just a style issue — it may cause subtle state inconsistencies.

**Reference:** [inkjs save/load documentation](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md)

---

## Medium

### 7. No error handling on story JSON fetch

**File:** `src/lib/engine/story.svelte.ts:15-17`

```ts
const response = await fetch(jsonPath);
const json = await response.text();
state.inkStory = new Story(json);
```

If the fetch returns a 404 (e.g. the path is wrong, or the static file is missing), `response.text()` returns the error page HTML, which `new Story(html)` will attempt to parse as ink JSON — producing an incomprehensible error. Check `response.ok` before proceeding.

### 8. All packages are in `dependencies` instead of `devDependencies`

**File:** `package.json`

`typescript`, `vite`, `@sveltejs/vite-plugin-svelte`, and `@sveltejs/adapter-static` are build-time tools, not runtime dependencies. They belong in `devDependencies`. Only `inkjs` and `svelte` are arguable as `dependencies` (and even Svelte is compiled away). This inflates production install footprints and misrepresents the dependency graph.

### 9. No lockfile committed

**File:** `.gitignore`

Both `bun.lock` and `package-lock.json` are gitignored. For a game project where reproducible builds matter (especially for deployment to itch.io/Netlify as stated in the plan), the lockfile should be committed. Without it, `bun install` or `npm install` on a different machine or CI environment may resolve different dependency versions.

---

## Low

### 10. `fly` import is unused in Passage.svelte

**File:** `src/lib/components/Passage.svelte:2`

```ts
import { fly, fade } from 'svelte/transition';
```

`fly` is imported but never used. Only `fade` is used in the template.

### 11. Fragile `{#each}` key in Passage.svelte

**File:** `src/lib/components/Passage.svelte:8`

```svelte
{#each paragraphs as text, i (text + i)}
```

Using `text + i` as a key means if the same paragraph text appears at a different index (e.g. after a `#CLEAR`), Svelte may produce unexpected reuse/animation behaviour. A monotonically increasing ID or a hash would be more robust.

### 12. Menu hardcodes the autosave key string

**File:** `src/routes/menu/+page.svelte:14`

```ts
deleteSave('the-work-autosave');
```

The autosave key `'the-work-autosave'` is hardcoded here, but defined as `AUTOSAVE_KEY` in `save-load.ts`. This should use the exported constant (or an exported `deleteAutosave()` function) to avoid the keys drifting out of sync.

### 13. Keyboard event listener not cleaned up on SSR

**File:** `src/lib/components/ChoiceList.svelte:40-46`

The `onMount`/`onDestroy` pattern for the keydown listener is correct for SPA mode. However, since `ssr: false` is set, this is fine. Worth noting that if SSR were ever enabled, `window.addEventListener` in `onMount` would still be safe, but it's fragile to rely on the layout config.

---

## Observations (not bugs)

- **Plan vs reality gap:** The plan references shadcn-svelte, Tailwind CSS v4, GSAP, Howler.js, and vite-plugin-pwa. None of these are installed or used. The actual implementation is lighter (pure CSS, Svelte transitions). This is fine — simpler is better — but the plan should be updated to reflect the actual stack.
- **Bun commit is a no-op:** Commit `7be6304` ("Switch from npm to Bun runtime") only adds `bun.lock` to `.gitignore`. No `bun.lockb` or Bun-specific config exists. The commit message overstates the change.
- **Compiled story JSON is 1 file in `static/`:** This is correct for inkjs. Pre-compiling `.ink` to JSON externally and shipping the JSON is the recommended approach.
- **Tag processing is sound:** The `processTags()` function correctly handles tags after each `Continue()` call, which aligns with the inkjs API where `currentTags` are per-line.
