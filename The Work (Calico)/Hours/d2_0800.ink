=== d2_0800 ===
    #CLEAR
    It is 8:00 in the morning. Your time is up.

    ~ temp theses = countThesesReached()
    ~ temp started = countConceptsStarted()

    {theses >= 3:
        -> ending_triumph
    - theses >= 1:
        -> ending_defence
    - started >= 3:
        -> ending_fragments
    - else:
        -> ending_blank
    }

= ending_triumph
    The pages are dense with argument. You gather them with hands that barely shake.

    {theses} threads — each one a thesis, complete and rigorous. More than enough.

    You have delivered. The committee will find no weakness here.

    {printThoughtProgress()}

    -> END

= ending_defence
    You have something. Not everything you'd hoped for, but something real.

    {theses == 1:A single thesis|{theses} theses}, hard-won, surrounded by the scaffolding of incomplete ideas.

    It may be enough. It will have to be enough.

    {printThoughtProgress()}

    -> END

= ending_fragments
    The desk is littered with half-formed thoughts. {started} threads begun, none brought to completion.

    You have observations. Inklings. The ghosts of ideas.

    But nothing that could survive the committee's scrutiny.

    {printThoughtProgress()}

    -> END

= ending_blank
    The page stares up at you. Nearly as blank as when you began.

    Thirteen hours. Gone.

    The committee will not defer a third time.

    -> END
