=== d2_0800 ===
    #CLEAR
    It is 8:00 in the morning. Your time is up.

    ~ temp thesesWritten = countThesesWritten()
    ~ temp conceptsWritten = countConceptsWritten()

    {thesesWritten >= 3:
        -> ending_triumph
    - thesesWritten >= 1:
        -> ending_defence
    - conceptsWritten >= 1:
        -> ending_fragments
    - else:
        -> ending_blank
    }

= ending_triumph
    The pages are dense with argument. You gather them with hands that barely shake.

    {thesesWritten} threads — each one a thesis, complete and rigorous. More than enough.

    You have delivered. The committee will find no weakness here.

    On the page:
    {printWrittenProgress()}

    -> END

= ending_defence
    You have something. Not everything you'd hoped for, but something real.

    {thesesWritten == 1:A single thesis|{thesesWritten} theses}, hard-won, surrounded by the scaffolding of incomplete ideas.

    It may be enough. It will have to be enough.

    On the page:
    {printWrittenProgress()}

    -> END

= ending_fragments
    The desk is littered with half-formed text. {conceptsWritten} threads committed to the page, none brought to completion.

    You have drafts. Sketches of arguments. The ghosts of ideas.

    But nothing that could survive the committee's scrutiny.

    On the page:
    {printWrittenProgress()}

    -> END

= ending_blank
    The page stares up at you. Nearly as blank as when you began.

    {countConceptsStarted() > 0:
        The thoughts were there — {countConceptsStarted()} threads, turning in your mind. But none of them made it to the page.
    }

    Thirteen hours. Gone.

    The committee will not defer a third time.

    -> END
