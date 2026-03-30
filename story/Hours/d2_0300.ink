=== d2_0300 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 15:
		-> d2_0400
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0300.AfterSelection)

= AfterSelection
	{TimeNumber >= 15:
		-> d2_0400
	}
	There's more to do.

	-> Begin
