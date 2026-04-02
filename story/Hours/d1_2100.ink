=== d1_2100 ===
	{BeginScene()}
	-> Begin

= Begin
	{TimeNumber >= 10:
		-> d1_2200
	}
	{Begin == 1:
		The hour turns. The first urgency has passed and something steadier has taken its place — neither calm nor panic, but the grim momentum of a task begun.
		{~Rain begins against the window. A soft, irregular percussion on glass and sill.|The wind picks up outside, rattling the panes in their frames. The candle flame bends.|A thick fog has pressed itself against the glass, erasing the city beyond. The room feels smaller.}
	- else:
		{updateWorldState()}
		{printTimeName()}
		{printTimeDesc()}
	}

	-> Action(-> d1_2100.AfterSelection)

= AfterSelection
	{TimeNumber >= 10:
		-> d1_2200
	}
	There's more to do.

	-> Begin
