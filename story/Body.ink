// Bodily states: interrupts, tending and extremes.
// Numbers live in src/lib/game/body.ts; this file owns the prose and flow.
// Spec: docs/plans/bodily-states-spike.md
//
// All prose here is [PLACEHOLDER] text, to be replaced by the author.

// ---------------------------------------------------------------------------
// CHECK: runs after every action (the Action gather in Tunnels.ink)
// ---------------------------------------------------------------------------

=== body_check ===
    // Extremes end the night; otherwise one beat covers the two most pressing issues
    {body_extreme():
        - "fatigue": -> body_asleep
        - "cold": -> body_cold_ending
    }
    ~ temp first = body_interrupt(0)
    ~ temp second = body_interrupt(1)
    {first != "":
        -> body_interrupt_beat(first, second) ->
        // Tending or dwelling inside the beat spends time, so the extremes can be crossed there
        {body_extreme():
            - "fatigue": -> body_asleep
            - "cold": -> body_cold_ending
        }
    }
    ->->

=== body_interrupt_beat(first, second) ===
    {body_line(first)}
    {second != "":
        {body_line(second)}
    }

    // Choosing a state resolves only that state; "push through" resolves both
    + {first != "memory"} [PLACEHOLDER attend to {first}]
        ~ body_resolve(first)
        -> body_attend_beat(first) ->
    + {second != "" && second != "memory"} [PLACEHOLDER attend to {second}]
        ~ body_resolve(second)
        -> body_attend_beat(second) ->
    + {body_reading(first, 0) != ""} [PLACEHOLDER dwell on {first}]
        ~ body_resolve(first)
        -> body_observe_beat(first) ->
    + {second != "" && body_reading(second, 0) != ""} [PLACEHOLDER dwell on {second}]
        ~ body_resolve(second)
        -> body_observe_beat(second) ->
    + [PLACEHOLDER push through]
        ~ body_resolve(first)
        {second != "":
            ~ body_resolve(second)
        }
        [PLACEHOLDER you push on]
    - ->->

=== function body_line(subject)
    {subject == "memory":
        [PLACEHOLDER a memory surfaces, unbidden]
    - else:
        [PLACEHOLDER {subject} at level {body_level(subject)}]
    }

// ---------------------------------------------------------------------------
// TENDING: shared by interrupts and the "Attend to yourself" action
// ---------------------------------------------------------------------------

=== body_attend_beat(state) ===
    // The remedy costs time: the number of ticks comes from body.ts
    ~ temp ticks = body_attend(state)
    [PLACEHOLDER you tend to {state}]
    ~ spend_ticks(ticks)
    ->->

=== function spend_ticks(ticks)
    {ticks > 0:
        ~ advanceTime("attend")
        ~ spend_ticks(ticks - 1)
    }

// Dwelling on a state acquires one of its P54-P58 readings, like any observation
=== body_observe_beat(subject) ===
    ~ temp r0 = body_reading(subject, 0)
    ~ temp r1 = body_reading(subject, 1)
    ~ temp r2 = body_reading(subject, 2)
    // Externals cannot run inside choice text, so the readings are fetched into temps first
    ~ temp t0 = get_idea_text(r0)
    ~ temp t1 = get_idea_text(r1)
    ~ temp t2 = get_idea_text(r2)
    [PLACEHOLDER you dwell on {subject}]
    + [{t0}]
        {acquire_idea(r0)}
    + [{t1}]
        {acquire_idea(r1)}
    + [{t2}]
        {acquire_idea(r2)}
    -
    ~ advanceTime("observe")
    ->->

// ---------------------------------------------------------------------------
// EXTREMES
// ---------------------------------------------------------------------------

// Falling asleep skips straight to the defence with whatever is on the page
=== body_asleep ===
    ~ fellAsleep = true
    [PLACEHOLDER you fall asleep at the desk]
    -> d2_0800

// Stub: the failure ending, prose to be written later
=== body_cold_ending ===
    [PLACEHOLDER the cold takes you]
    -> END
