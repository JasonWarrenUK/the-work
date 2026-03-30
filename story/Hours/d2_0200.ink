=== d2_0200 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 14:
		-> d2_0300
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0200.AfterSelection)

= AfterSelection
	{TimeNumber >= 14:
		-> d2_0300
	}
	There's more to do.

	-> Begin
