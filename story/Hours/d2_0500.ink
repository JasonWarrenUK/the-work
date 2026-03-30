=== d2_0500 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 17:
		-> d2_0600
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0500.AfterSelection)

= AfterSelection
	{TimeNumber >= 17:
		-> d2_0600
	}
	There's more to do.

	-> Begin
