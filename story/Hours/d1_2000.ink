=== d1_2000 ===
    {BeginScene()}
    -> Begin

= Begin
    {TimeNumber >= 9:
        -> d1_2100
    }
    {Begin == 1:
        The Writer has a very limited amount of Time in which to finish The Work.
    - else:
        {updateWorldState()}
        {printTimeName()}
        {printTimeDesc()}
    }

    -> Action(-> d1_2000.AfterSelection)

= AfterSelection
    {TimeNumber >= 9:
        -> d1_2100
    }
    There's more to do.

    -> Begin
