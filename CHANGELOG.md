<!-- doc-changelog: generated 2026-10-13. Delete this line once you hand-edit this file. -->
# Changelog

All notable changes to The Work are recorded here, in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file starts at 0.3.0. Earlier releases (0.1.0, 0.2.0) are not itemised.

## [Unreleased]

### Changed

- Story paragraphs and choices wrap with `text-wrap: pretty`, so a paragraph or a multi-line choice no longer ends on a single stranded word. Browsers without the property show no change.

## [0.9.0] - 2026-10-13

### Added

- After every choice the page scrolls smoothly so the new passage starts a fifth of the way down the screen. Longer jumps take a little longer up to a cap. Scrolling by hand (wheel, touch or the arrow, Page, Home, End and Space keys) stops the animation. Readers who prefer reduced motion get an instant jump.

## [0.8.0] - 2026-10-13

### Added

- A line in the story can ask for a layered parallax frame above its paragraph with `#frame: back.png:6, front.png; height:0.2`. Each comma-separated name is an image layer, `:<depth>` sets how little it moves (higher means less) and `height` is a fraction of the screen. Images live in `static/frames/`, and the layers drift against the mouse or a touch unless reduced motion is requested. The Ink compiler rejects Calico's `|` inside a tag, so options follow `;`.
- Paragraphs returned by `story.continue()` gain a `frame` field, `null` when the line has no frame tag.

### Fixed

- The thesis panel task is recorded as done: the Thesis tab from an earlier release already shows written ideas and per-domain orthodoxy.

## [0.7.0] - 2026-10-13

### Breaking

- `story.tick` is removed. Code that read it inside `$derived()` to force a re-read should call `story.variable(name)` for an Ink variable, and drop the guard when it was reading other reactive state.

### Added

- `story.variable(name)` reads an Ink variable reactively. The first read registers an inkjs variable observer, so a `$derived()` that calls it re-evaluates when the story assigns that variable. A name the story never declared reads as `undefined`.

### Changed

- The status bar and the idea and summary overlays re-evaluate from the variables and inventory they actually read, not after every story step.

## [0.6.0] - 2026-10-13

### Added

- The dev bar shows a count of Ink errors and warnings with the latest message beside it. Clicking the count lists every message, and Clear empties the list. The engine exposes the same list as `story.issues`, capped at the 200 most recent, with `story.clearIssues()`.

### Fixed

- Ink runtime errors were logged as warnings because the engine compared the report type against the wrong value. Only genuine warnings are warnings now.

## [0.5.0] - 2026-10-13

### Breaking

- `story.continue()` returns each paragraph as `{ text, classes }` instead of a plain string. Code that reads paragraphs as strings must read `paragraph.text`.

### Added

- Lines in the story can ask for styling with `#class:<name>` tags, and the page applies them to the paragraph. Three styles ship: `aside` (dim italic), `emphasis` (accent colour) and `urgent` (warning colour).
- Five early lines use them as examples: three in the prologue, the first line at the hub and the "There's more to do." line shown after every action.

## [0.4.0] - 2026-10-13

### Added

- Choices in the story can carry tags, and the engine passes them to the page. A `#mood:` tag on a choice sets the page's mood when that choice is chosen.
- Pull requests also run a type check, so type errors surface before merge.

### Changed

- The three main actions (Attend to The Work, Consider your circumstances, Exercise the mind) declare their own mood in the story. The page no longer matches on their wording, so rewording a choice cannot switch its mood off.

## [0.3.1] - 2026-10-13

### Added

- Pull requests now run the test suite and a production build before merging.

### Changed

- The GitHub Pages deploy installs and builds with bun, from the exact versions pinned in `bun.lock`.

### Fixed

- The GitHub Pages deploy builds again. It had failed since 0.3.0 because the workflow ran on Node 20 and the new test runner needs Node 22.

## [0.3.0] - 2026-10-13

### Added

- The Writer now has a body. Hunger, thirst, cold, fatigue and cramp build as the night passes, and each action ticks them forward. When one reaches an extreme, an interruption beat breaks into the Writer's work.
- Bodily readings (P54 to P58) are offered from that interruption beat rather than from objects in the room.
- Body state is saved and restored with the rest of the game.
- Tests for the body model and the full bodily state flow through the story.

### Fixed

- The "Attend to The Work" menu is restored.
- Extremes are rechecked after an interruption.
- The observe beat no longer ends the story when there are no readings to offer.

[Unreleased]: https://github.com/JasonWarrenUK/the-work/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/JasonWarrenUK/the-work/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/JasonWarrenUK/the-work/releases/tag/v0.3.0
