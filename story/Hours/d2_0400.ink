=== d2_0400 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 16:
		-> d2_0500
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0400.AfterSelection)

= AfterSelection
	{TimeNumber >= 16:
		-> d2_0500
	}
	There's more to do.

	-> Begin
