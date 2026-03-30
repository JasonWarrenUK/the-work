=== d2_0700 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 19:
		-> d2_0800
	}
	{updateWorldState()}
	{printTimeName()}
	{printTimeDesc()}

	-> Action(-> d2_0700.AfterSelection)

= AfterSelection
	{TimeNumber >= 19:
		-> d2_0800
	}
	There's more to do.

	-> Begin
