# Bodily States Spike

Collaborative design spike for roadmap task 3GS.2 ("Implement bodily state triggers"), started 2026-09-30. Records the decisions made and what remains open for the tasks split off from it.

## Split

The spike covered three systems and was split into separate tasks:

| System | Task |
|---|---|
| Bodily states: escalation, interruptions, tending | 3GS.2 (implemented) |
| Provisions: drink, food and light trade-offs | 3GS.5 |
| Reading pools and affinity skew | 3GS.6 (mechanism) and 3NA.14 (authoring) |

## Architecture

Body state and logic live in TypeScript, alongside dread, and reach Ink through external functions. Ink keeps time (`advanceTime(action)` ticks the body) and all prose.

| File | Role |
|---|---|
| `src/lib/game/body.ts` | Pure logic and every tunable constant; no Svelte |
| `src/lib/game/body.svelte.ts` | `$state` wrapper (`body`), same shape as `inventory` |
| `src/lib/game/idea-bridge.ts` | Binds the `body_*` externals |
| `story/IdeaSystem.ink` | Declares the externals |
| `story/Body.ink` | Interrupt beat, tending, extremes (placeholder prose) |
| `story/Tunnels.ink` | Action names passed to `advanceTime`, the "Attend to yourself" action, action failures, the per-action check |
| `story/Functions.ink` | `advanceTime(action)` and the body-conditional hour prose |
| `src/lib/game/save-load.ts` | Optional `SaveData.bodyState`; older saves restore with a fresh body |

Tests: `src/lib/game/body.test.ts` with fixtures in `tests/fixtures/body.ts` (`bun run test`).

## Purpose

Bodily states do four jobs at once:

1. **Atmosphere / clock:** the body makes the passing night felt
2. **Competing demand:** the body asks for attention, and tending it costs time
3. **Source of ideas:** bodily states are things to observe (P54 to P58)
4. **Consequence mirror:** the body reflects the player's choices (provisions, writing, dread)

## Roster

Five escalating states and one one-off event. Eye strain was cut: its only failure effect (hiding the gazette) was the weakest of the set, its prose duplicated fatigue's and its rate depended on a brightness dial that provisions no longer use.

| State | Observable as | Notes |
|---|---|---|
| Hunger | P54 | |
| Thirst | none yet | No P-entry; 3NA.13 may add one |
| Cold | P57 | |
| Fatigue | P55 (eye strain) | Top level is the urge to sleep |
| Hand cramp | P56 | Tending it is stretching |
| Memory, unbidden | P58 | One-off event, not an escalating need |

## Numbers

All constants are tunable in `body.ts`. Each action is one tick; ten ticks make an hour. A state's level is its points divided by 30, capped at 3.

| State | Baseline per tick | Action extras |
|---|---|---|
| Hunger | +1 | none |
| Thirst | +1 | +1 writing, +1 dwelling |
| Cold | +1 from 10pm, +2 from 2am | none |
| Fatigue | +1 from 10pm, +2 from midnight, +1 for each of hunger and thirst at level 2 | none |
| Hand cramp | 0 | +8 writing |

- Fatigue or cold reaching 120 points is extreme. Fatigue wins ties.
- The memory becomes pending once, when fatigue reaches level 2 or total dread reaches 3.
- Untouched, fatigue goes extreme around 4am. This is the first number to check in playtesting.
- Provisions set rate multipliers (default 1; 1.5 is sooner, 0.5 is held off) through `setRate`.

## Interruptions

- After every action, extremes are checked first. Otherwise one beat covers the **two** most pressing issues (highest level first, then roster order, memory last).
- A state is due when its level rises past the one already announced, or when it sits at level 3 and has been ignored for 5 ticks.
- Choices: attend either state, dwell on either (only while a reading exists and none is held) or push through. Choosing a state resolves only that state; push through resolves both. Anything left over waits for the next action's check.
- Dwelling acquires one P54 to P58 reading and costs an observation's time.
- Relief that drops a level lets the state interrupt again when it climbs back.
- A standing "Attend to yourself" action appears once any state is at level 1 or above.

## Attending

| Remedy | Relief | Ticks | Supply |
|---|---|---|---|
| Eat | 45 | 1 | 3 meals in the room |
| Scraps (fallback) | 25 | 2 | unlimited |
| Drink | 45 | 1 | 4 drinks in the room |
| Tap water (fallback) | 25 | 2 | unlimited |
| Coat (cold) | 30 | 1 | free |
| Rest (fatigue) | 20 | 3 | free |
| Stretch (cramp) | 40 | 1 | free |

The 18:40 provision choice sets rates only. It does not decide what the room holds through the night.

## Neglect

Each state costs the player something distinct at level 3, and observing is never blocked so the body stays a source of ideas.

| State | Cost at level 3 | Extreme |
|---|---|---|
| Hunger | Combining stalls | none |
| Thirst | none directly | none; pushes fatigue |
| Cold | Every action except tending costs an extra tick | Failure ending (stub) |
| Fatigue | Developing stalls | Falls asleep: skips to the defence with `fellAsleep` set |
| Hand cramp | Writing blocked until stretched (no time passes) | none |
| Memory | none | none |

## Hour prose

The 1am, 2am and 3am descriptions in `printTimeDesc` describe the body, so each clause is now conditional on `TimeNumber` and the matching level. Wording is unchanged. A well-tended Writer gets no description at 2am and 3am (hour 8am already behaves this way); a body-independent base line there is an authoring decision.

## Provisions (for 3GS.5)

### Rule

Every positive effect must be paired with an opposite-direction effect, in any category (body rate, time, ideas). A provision may also carry neutral effects, such as domain or orthodoxy leanings, freely. Effects are real but must not define a playthrough.

### Drinks

| Drink | Label | Positive | Negative |
|---|---|---|---|
| Water | Purity | Thirst eases most | Hunger sooner |
| Wine | Luxury | Hand cramp eased | Fatigue sooner |
| Beer | Fortitude | Hunger held off | Cold sooner |
| Whiskey | Fire | Cold held off | **TBD** (was eye strain sooner; the state is cut) |

### Food (draft; labels are placeholders)

| Food | Label | Positive | Negative | Neutral |
|---|---|---|---|---|
| Heel of bread | Thrift | Hunger held off (a little) | Thirst sooner | |
| Cheese and cold meat | Richness | Hunger held off (most) | Fatigue sooner | |
| A browning apple | Freshness | Thirst eased | Hunger sooner | |
| Nothing | Discipline | **TBD** | Hunger soonest | Faith leaning |

### Light

Lights are qualitatively different things, not levels of brightness. `myLightLevel` only gates the drink and food choices in `d1_1840` and the `?skip=1` setup, so it can be decoupled cheaply. Sketch to react to, to be settled in 3GS.5:

- **Candle:** finite. It burns down and acts as a second clock. Leaning: Class.
- **Gas:** constant but fumey. It carries a body cost. Leaning: Rule or Truth.
- **Arcane:** unstable. What it does shifts as the night goes on. Leaning: Nature.

### Open

- Fasting positive, candle positive, gas negative, whiskey negative
- Gas leaning: Rule or Truth
- Eating the browning apple: does it consume the room observation (O25) or sit alongside it?
- Bug: arcane light never sets `myLightLevel` in `d1_1840` (only the candle and gas branch does)

## Reading pools and affinity (for 3GS.6 and 3NA.14)

- Objects get pools of 4 to 6 authored readings; 3 are offered per examination
- A leaning (domain or orthodoxy) weights which readings are offered. It never locks a reading out
- Affinities so far: candle to Class, gas to Rule or Truth, arcane to Nature, fasting to Faith

## Follow-ups noticed during the build

- `Definitions.ink` still holds `myHungerLevel`, `myThirstLevel` and their name and description variables. Nothing reads them; the TypeScript state replaces them.
- **"Attend to The Work" was broken on `main`** (fixed on this branch in its own commit). Confirmed in the browser against `main`'s compiled story: clicking it ended the game with "The end." The `onError` handler only logged a console warning. Two causes:
  1. The per-idea writing choices called `get_idea_text` inside choice text (`[{get_idea_text(w0)}]`), which inkjs rejects. The text is now fetched into `~ temp` variables first.
  2. Each writing choice had a `--` gather inside its body, which split the sibling `++` choices into separate choice sets. With nothing writable the first set had no available choice and the story ran out of content. Dropping the `--` prefixes restores a single set, so the `{CHOICE_COUNT() == 0}` fallback appears again.
  The cramp gate sits before the choice set (it prints the hint and diverts to the closing gather), so no choice ordering is involved.
