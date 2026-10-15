# Save fixtures

One real save per tagged release, named `<tag>.json`, in the `SaveData` shape that tag wrote. `tests/save-fixtures.test.ts` loads every file here and asserts the version-mismatch policy in `src/lib/game/save-load.ts`: a load is never refused, a save from another version says so and a save from this build's minor restores into the current story.

## Capturing a fixture

After tagging a release, capture its save from the tagged checkout:

```bash
CAPTURE_SAVE_FIXTURE=v0.16.0 bun run test tests/save-fixtures.test.ts
```

The test plays a fixed route (hour one, first choice six times) through `static/The Work.json` with the real bindings, writes `tests/fixtures/saves/v0.16.0.json` and then checks it along with the rest. Commit the file.

For an older tag, point `STORY_JSON` at that tag's compiled story:

```bash
git show 'v0.14.0:static/The Work.json' > /tmp/v0.14.0.json
STORY_JSON=/tmp/v0.14.0.json CAPTURE_SAVE_FIXTURE=v0.14.0 bun run test tests/save-fixtures.test.ts
```

The Ink state in such a fixture is genuine to the tag. The inventory and body state are serialised by the current code, since the old story is played through the current bindings; a tag's save shape (whether it carried `bodyState` or `version`) is reproduced from `FIELDS_SINCE` in the test.

## Fixtures

| Tag | Shape | Expected check |
|---|---|---|
| v0.3.0 | storyState, inventoryState, bodyState; no version | `unknown` (predates stamping) |
| v0.14.0 | storyState, inventoryState, bodyState; no version | `unknown` (predates stamping) |
| v0.15.0 | all fields, `version: v0.15.0` | `match` on a 0.15 build, `minor-mismatch` after |
