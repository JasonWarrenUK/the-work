<!-- doc-changelog: generated 2026-10-13. Delete this line once you hand-edit this file. -->
# Changelog

All notable changes to The Work are recorded here, in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file starts at 0.3.0. Earlier releases (0.1.0, 0.2.0) are not itemised.

## [Unreleased]

## [0.14.0] - 2026-10-15

### Added

- Five hours of the night bring the outside world into the room: rain at 9pm, bells at midnight, the gas lamp dimming at 2am, distant artillery at 3am and dawn light at 7am. The event lands after the first action taken in its hour. The Writer can dwell on it, which yields one of its three readings and costs the time of an observation, or let it pass for nothing. A save made mid-hour neither repeats nor skips the event. The prose is placeholder and random sensory events are not wired yet. The 9pm rain now sits beside the hour's own opening weather line, which can contradict it (noted on 3NA.1).
- Nine hidden objects appear in the location menus once their parent has been examined: a note in the Bible, the back of the pocket watch, the back of the photograph, under the mattress, the coat pocket, a pressed flower, under the loose floorboard, the specimen jar's label and the windowsill scratches. Each offers its three readings and is gone once taken. Ink gains `prompt_text(id)` and `prompt_reading(id, index)` to read any catalogue prompt.
- The story engine records every choice made and the run's random seed, and can rebuild a run from those two alone with `story.replay(seed, choices)`, reproducing the story's own state, random rolls included. State held outside Ink must be reset before replaying. Nothing saves the log yet, so saves still store a state snapshot.

## [0.13.0] - 2026-10-14

### Added

- The game can name who chairs the Writer's defence. The dominant discipline seats a committee member: Faith to the Cleric; Truth, Nature and Art to the Professor; Rule and Class to the Bureaucrat. Morality defers to the other domain in the pair, and the dominant domain decides when the two answer to different members. Ink can ask with `get_chair()`, which returns the member's name or an empty string until two domains have written ideas. Nothing in the story calls it yet.

## [0.12.0] - 2026-10-14

### Added

- The status bar shows the Writer's condition. Each bodily state (hunger, thirst, cold, fatigue, cramp) appears once it reaches its first level, as a label with filled and empty dots and in red at the maximum. A dread counter appears once dread is above zero, turning accent at three and red at six, the points where the story itself reacts. A fresh Writer sees nothing new, and each chip has a screen-reader label.

## [0.11.0] - 2026-10-14

### Added

- Storylets work. A knot tagged `# storylet` is offered by the storylet loop when its own guard passes, in the order the knots appear in the story. `get_storylet(index)` returns the knot's divert target and the new `storylet_count()` reports how many there are. The sample patch in `story/patches/storylets.ink` is not yet included in the game; the first real storylet is a later task. Only top-level knots count, not stitches.

### Fixed

- The storylet loop ran off the end once every storylet had been tried. It now stops on the knot count, and the sample patch's last knot ends properly.

## [0.10.0] - 2026-10-14

### Added

- Story text and choices support `*emphasis*` (italic) and `**strong**` (bold), and `***both***`. A lone asterisk or one with spaces round it stays as written, and a backslash keeps an asterisk literal. The marks are drawn as real elements, never as raw HTML. One prologue line uses it.

### Changed

- Story paragraphs and choices wrap with `text-wrap: pretty`, so a paragraph or a multi-line choice no longer ends on a single stranded word. Browsers without the property show no change.

## [0.9.0] - 2026-10-13

### Added

- After every choice the page scrolls smoothly so the new passage starts a fifth of the way down the screen. Longer jumps take a little longer up to a cap. Scrolling by hand (wheel, touch or the arrow, Page, Home, End and Space keys) stops the animation. Readers who prefer reduced motion get an instant jump.

## [0.8.0] - 2026-10-13

### Added

- A line in the story can ask for a layered parallax frame above its paragraph with `#frame: back.png:6, front.png; height:0.2`. Each comma-separated name is an image layer, `:<depth>` sets how little it moves (higher means less) and `height` is a fraction of the screen. Images live in `static/frames/`, and the layers drift against the mouse or a touch unless reduced motion is requested. The Ink compiler rejects Calico's `|` inside a tag, so options follow `;`.
- Paragraphs returned by `story.continue()` gain a `frame` field, `null` when the line has no frame tag.

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

[Unreleased]: https://github.com/JasonWarrenUK/the-work/compare/v0.14.0...HEAD
[0.14.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/JasonWarrenUK/the-work/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/JasonWarrenUK/the-work/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/JasonWarrenUK/the-work/releases/tag/v0.3.0
