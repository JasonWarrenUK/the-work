// Timed sensory events: the world intrudes between actions.
// Which prompt each hour owns lives in src/lib/game/sensory.ts; this file
// owns when it fires and what the player can do about it.
// Design: design/Objects.md, section G.
//
// All prose here is [PLACEHOLDER] text, to be replaced by the author.

EXTERNAL sensory_prompt(hour)
EXTERNAL sensory_text(prompt)
EXTERNAL sensory_reading(prompt, index)

// The hour whose event has been dealt with, and the hour waiting for its
// first full action. Both travel with the story state, so a save mid-hour
// neither repeats nor skips the event.
VAR sensoryHandledHour = 0
VAR sensoryArmedHour = 0

// ---------------------------------------------------------------------------
// CHECK: runs after every action, once the body has had its say
// ---------------------------------------------------------------------------

// The action that crosses into a new hour only arms it: the event lands
// after the first action taken inside the hour, so it follows the hour's
// opening prose rather than preceding it.
=== sensory_check ===
    {TimeNumber != sensoryHandledHour:
        {sensoryArmedHour == TimeNumber:
            ~ sensoryHandledHour = TimeNumber
            ~ temp prompt = sensory_prompt(TimeNumber)
            {prompt != "":
                -> sensory_event_beat(prompt) ->
            }
        - else:
            ~ sensoryArmedHour = TimeNumber
        }
    }
    ->->

// Attending to the event acquires one of its readings, like any observation,
// and costs the time an observation costs. Letting it pass costs nothing.
=== sensory_event_beat(prompt) ===
    ~ temp r0 = sensory_reading(prompt, 0)
    ~ temp r1 = sensory_reading(prompt, 1)
    ~ temp r2 = sensory_reading(prompt, 2)
    // Externals cannot run inside choice text, so the readings are fetched into temps first
    ~ temp t0 = get_idea_text(r0)
    ~ temp t1 = get_idea_text(r1)
    ~ temp t2 = get_idea_text(r2)
    {sensory_text(prompt)}
    + {r0 != ""} [{t0}]
        {acquire_idea(r0)}
        ~ advanceTime("observe")
    + {r1 != ""} [{t1}]
        {acquire_idea(r1)}
        ~ advanceTime("observe")
    + {r2 != ""} [{t2}]
        {acquire_idea(r2)}
        ~ advanceTime("observe")
    + [PLACEHOLDER let it pass]
        [PLACEHOLDER you let it pass]
    - ->->
