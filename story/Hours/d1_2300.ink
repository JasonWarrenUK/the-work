=== d1_2300 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 11:
		-> d2_0000
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d1_2300.AfterSelection)

= AfterSelection
	{TimeNumber >= 11:
		-> d2_0000
	}
	There's more to do.

	-> Begin
