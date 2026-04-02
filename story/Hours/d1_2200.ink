=== d1_2200 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 11:
		-> d1_2300
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d1_2200.AfterSelection)

= AfterSelection
	{TimeNumber >= 11:
		-> d1_2300
	}
	There's more to do.

	-> Begin
