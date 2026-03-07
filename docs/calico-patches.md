# Calico Patches Reference

Features from the old Calico engine that haven't been re-implemented in SvelteKit yet. Preserved here as reference for future implementation.

Source: `The Work (Calico)/patches/` (deleted in cleanup)

---

## Audio — `musicplayer.js`

Howler.js-based audio system with ink tag integration.

**Tags:** `#play`, `#pause`, `#resume`, `#stop`, `#volume`

**Tag syntax:**
```
#play: song                          — play with default 2s fade-in
#play: song | fadein: 1000           — play with custom fade duration
#stop: song                          — stop specific track (fade out)
#stop                                — stop all tracks
#pause: song                         — mute track (keeps playing)
#resume: song                        — restore track volume
```

**Key options:**
- `musicplayer_allowmultipletracks: false` — stop previous track when playing new one
- `musicplayer_fadein: 2000` — default fade-in duration (ms)
- `musicplayer_fadeout: 2000` — default fade-out duration (ms)

**Behaviour:** All tracks loop by default. When switching tracks with `allowmultipletracks: false`, the new track waits for the old one to fade out before starting. Volume defaults to 0.5.

**Notes:** Chrome requires user interaction before audio can play — ensure a choice/click happens first. iOS requires the phone to be off silent mode or have headphones connected.

---

## Storylets — `storylets.js` + `storylets.ink`

Storylet system inspired by Twine/Harlowe. Dynamically includes ink passages tagged `#storylet` based on runtime conditions.

**External function:** `get_storylet(index)`

**How it works:**
1. Tag storylet passages with `#storylet`
2. Include a guard condition at the top: `{savings < 2.70: -> DONE}`
3. The external function iterates `mainContentContainer.namedContent`, finding passages tagged `storylet`
4. Returns an `inkjs.Path` to the matching passage
5. Uses `CHOICE_COUNT()` to detect whether the storylet added any choices

**Ink usage:**
```ink
=== storylets(index)
{index < 0: -> DONE}
~ temp cc = CHOICE_COUNT()
~ temp storylet = get_storylet(index)
<- storylet
{CHOICE_COUNT() == cc: <- storylets(index+1)}

EXTERNAL get_storylet(index)
```

**Current status:** Stubbed in SvelteKit — logs a warning. The ink-side code exists in `story/patches/storylets.ink`.

---

## History & Rewind — `history.js` + `stepback.js`

Full choice replay system that enables save/load and undo/redo.

**History tracking:**
- Records every choice index in `story.history.choices[]`
- Backs up the initial random seed (`story.history.initialSeed`)
- On load: resets ink state, restores seed, replays all choices silently
- Collects all tags encountered during replay for re-application

**Rewind:**
- `story.stepBack()` — rewind to previous passage (replays up to `currentTurnIndex`)
- `story.stepForwards()` — step forward (if previously rewound)
- Options: `stepback_enabled: true`, `stepback_stepforwards: true`

**Key detail:** The replay approach preserves randomness because it restores `storySeed` before replaying. This is more robust than serialising ink state directly.

---

## Save System — `memorycard.js` + `storage.js` + `autosave.js`

Multi-format storage abstraction with save/load and autosave.

**Storage formats:**
- `cookies` — ~4KB limit, persists across sessions
- `session` — ~5MB, cleared when tab closes (default)
- `local` — ~5MB, persists indefinitely

**Save format:** Serialises the story object minus runtime references (ink, options, DOM, queue). Stores `history.choices`, `history.initialSeed`, and `history.turnIndex`.

**Load process:** Deserialises, restores seed, then uses `history.load()` to replay choices to the saved turn index. Re-applies most recent mood/style tags encountered during replay.

**Autosave:** Triggers on `passage start` and `story restarting` events. On `story ready`, loads the autosave and skips the initial animation (`delay = 0`).

**External functions:** `get(key)` and `set(key, value)` — exposed to ink for reading/writing persistent storage.

**Current status:** SvelteKit has basic `save-load.ts` with localStorage, but no history replay, no autosave wiring, and no multi-format support.

---

## Scroll After Choice — `scrollafterchoice.js`

Smoothly scrolls to new content after the player makes a choice.

**Behaviour:** Uses `requestAnimationFrame` with cubic easing (`3t² - 2t³`). Calculates scroll target to show new content 20% from top of viewport. Breaks scroll animation if user manually scrolls.

**Options:**
- `scrollafterchoice_breakonuserscroll: true`
- `scrollafterchoice_scrollup: true` — also scroll up if new content is above
- `scrollafterchoice_durationbase: 500` — minimum scroll duration (ms)
- `scrollafterchoice_durationmultiplier: 3` — duration scales with distance
- `scrollafterchoice_maxduration: 1250` — cap on scroll duration

**SvelteKit equivalent:** Could use `element.scrollIntoView({ behavior: 'smooth' })` or a Svelte action.

---

## Keyboard Shortcuts — `shortcuts/choices.js`

Binds keyboard shortcuts to story choices.

**Default bindings:**
- `1`–`9` → select choice by number
- `z`, `x`, `c` → select first three choices
- `Space` → progress story (only if single choice available)

**Features:**
- Ignores keypresses when modifier keys (Ctrl, Alt, Meta) are held
- Only triggers if the choice element is visible on screen
- Simulates click on the choice's anchor element

**SvelteKit approach:** Add a `keydown` handler in `ChoiceList.svelte`.

---

## Parallax Frames — `parallaxframes.js`

Creates layered image frames with mouse-tracking parallax effect.

**Tag:** `#frame: image:6, image2, image3.gif:4.5 | height:0.2`

**How it works:** Each comma-separated value becomes an image layer. The number after `:` sets the parallax depth (higher = less movement). Layers move opposite to mouse position. Supports touch devices. Recalculates on window resize.

**Probably not needed** for a text game unless specific atmospheric scenes call for it.

---

## Drag to Scroll — `dragtoscroll.js`

Click-and-drag scrolling (like a touch interface on desktop).

**Options:**
- `dragtoscroll_vertical: true`
- `dragtoscroll_horizontal: false`
- `dragtoscroll_verticalmodifier: 0.9` — scroll speed multiplier

**Notes:** Nice for atmospheric feel but may interfere with text selection.

---

## Choice Tags — `choicetags.js`

Applies style tags to choices by inspecting the ink content after each choice.

**How it works:** Peeks at `ink.PointerAtPath(choice.targetPath).container._content` to find tags on the same line as the choice. Applies `#class: x` tags to the choice element.

**Partially covered:** SvelteKit `tags.ts` handles bare tags as CSS classes, but doesn't peek ahead into choice target paths.

---

## Minimum Words Per Line — `minwordsperline.js`

Typography patch preventing orphan words at line breaks.

**How it works:** Wraps the last N words of each text line in `<span style='white-space: nowrap'>` so they won't break across lines.

**Option:** `minwordsperline_length: 2` — minimum words on the last line

**SvelteKit equivalent:** CSS `text-wrap: pretty` (modern browsers) or `text-wrap: balance` handles this natively. The plan already mentions `text-wrap: pretty`.

---

## Markdown to HTML — `markdowntohtml.js`

Converts markdown syntax in ink text to HTML.

**Supports:** Bold (`**`), italic (`*`), links (`[text](url)`), and possibly other markdown features.

**SvelteKit approach:** Could use a lightweight markdown parser like `marked` or `micromark`, or just handle `**` and `*` with regex if that's all that's needed.

---

## Shorthand Class Tags — `shorthandclasstags.js`

Registers custom tag names as shortcuts for `#class: tagname`.

**Already implemented:** SvelteKit `tags.ts` treats any unrecognised tag as a CSS class (line 39: `result.classes.push(trimmed)`), which covers this behaviour.

---

## Asset Preloading — `preload.js`

Scans compiled ink JSON for asset references, preloads them with a progress bar before starting the game.

**Scans for:** `#image`, `#background` tags → image files; configured audio tags → audio files.

**Loading bar:** Animated progress bar with configurable transition speeds and opacity fade.

**When needed:** Only relevant once audio/images are added to the game.

---

## Progress Log (Dec 2021)

Brief development log from the Calico era:
- Dec 13: Restarted development
- Dec 14: Worked on light choices, cut arcane light feature, began drink choices
