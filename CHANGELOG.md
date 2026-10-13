<!-- doc-changelog: generated 2026-10-13. Delete this line once you hand-edit this file. -->
# Changelog

All notable changes to The Work are recorded here, in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file starts at 0.3.0. Earlier releases (0.1.0, 0.2.0) are not itemised.

## [Unreleased]

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

[Unreleased]: https://github.com/JasonWarrenUK/the-work/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/JasonWarrenUK/the-work/releases/tag/v0.3.0
