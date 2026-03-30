=== d1_2100 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 9:
		-> d1_2200
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d1_2100.AfterSelection)

= AfterSelection
	{TimeNumber >= 9:
		-> d1_2200
	}
	There's more to do.

	-> Begin
