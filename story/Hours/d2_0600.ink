=== d2_0600 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 18:
		-> d2_0700
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0600.AfterSelection)

= AfterSelection
	{TimeNumber >= 18:
		-> d2_0700
	}
	There's more to do.

	-> Begin
