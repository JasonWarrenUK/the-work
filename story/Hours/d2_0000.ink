=== d2_0000 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 12:
		-> d2_0100
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0000.AfterSelection)

= AfterSelection
	{TimeNumber >= 12:
		-> d2_0100
	}
	There's more to do.

	-> Begin
