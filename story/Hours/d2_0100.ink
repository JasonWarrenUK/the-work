=== d2_0100 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 13:
		-> d2_0200
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0100.AfterSelection)

= AfterSelection
	{TimeNumber >= 13:
		-> d2_0200
	}
	There's more to do.

	-> Begin
