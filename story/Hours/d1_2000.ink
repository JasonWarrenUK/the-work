=== d1_2000 ===
    {BeginScene()}
    -> Begin

= Begin
    {TimeNumber >= 20:
        -> d2_0800
    }
    {Begin == 1:
        The Writer has a very limited amount of Time in which to finish The Work.
    - else:
        {updateWorldState()}
        {printTimeName()}
    }

    -> Action(-> d1_2000.AfterSelection)

= AfterSelection
    {TimeNumber >= 20:
        -> d2_0800
    }
    There's more to do.

    -> Begin
