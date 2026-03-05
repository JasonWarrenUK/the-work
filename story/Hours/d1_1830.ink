=== d1_1830 ===
//Sets the tone, feeds straight into Begin without mechanical effect
    +   [Shut the door.]

    -

    +   Brea[the]-
        ++  [Wait.]

    -   The latch.

    +  [Check the latch.]
        #CLEAR
    -
    +   Breathe.[]..
        ++  Breathe.[]..
            +++ Breathe.
                #CLEAR
    
    -> d1_1840

=== d1_1840 ===
//Guides the player through a few choices whilst "setting up the work area". Some world state is established.
    
    -> PrepareStart
    
    = PrepareStart
        //Acknowledge previous choice
        {choiceRelevantLast:
            - "lightChoose":
        }
        -> Choices

    = Choices
        //"You will need..."
            {myLightLevel:
                - 0: You will need...
                - 1: The gloom recedes. You require...
                - 2: Light stubbornly creeps into the room's corners. But still, you have need of...
                - 3:
                - 4:
            }

        //Light
            //Level 1: I Need Light
                *   (needLight) [Illumination]
                    #CLEAR
                    --  Your hand gropes instinctively towards the shelf next to the door. 

                    **  Your dwindling stores [must last the night.]are all that stand between you and...

                        *** Don't think about it.
            
            //Level 2: What Light?        
                +   {needLight && myLightSource == "none"}[Tallow]
                    #CLEAR
                    --  {!considerLightCandle: A little comfort, maybe. | Yes, maybe small comforts should be embraced.}
                    
                    **  (considerLightCandle) A candle provides no warmth[.], but the mind can be tricked & soothed.
                    ++  {CHOICE_COUNT() == 0} ->

                    --  (consideringLightCandle)

                    **  Yes, it will do.
                        ~ myLightSource = "candle"
                        ~ myLightColour ="orange"
                        ~ choiceRelevantLast = "lightChoose"
                    **  Or perhaps something else...
                +   {needLight && myLightSource == "none"}[Butane]
                    #CLEAR
                    --  {!considerLightGas: A convenient light.| An uncompromising clarity may be a boon.}

                    **  (considerLightGas) A harsh light[.], but perhaps an unforgiving illumination can bolster your will.
                    ++  {CHOICE_COUNT() == 0} 
                        ->

                    --  (consideringLightGas)
                    
                    **  It seems appropriate.
                        ~ myLightSource = "gas"
                        ~ myLightColour = "yellow"
                        ~ choiceRelevantLast = "lightChoose"
                    **  Modern methods are not the only possibility, of course.
                TODO Magic Light
                    //placeholder
                    *   {considerLightCandle}{considerLightGas}{myLightSource == "none"}[a more creative solution]
                    #CLEAR
                    --  (considerLightArcane) A bold choice. Perhaps too bold.
                    **  Perhaps, but [timidity will solve nothing.]desperation will stand in for bravery for now.
                        ~ myLightSource = "arcane"
                        ~ myLightColour = "violet"
                        ~ choiceRelevantLast = "lightSource"
                    **  Let's not add to the list of offences.

            //Level 3: How to light it?
                *  (matches) {myLightSource == "candle" || myLightSource == "gas"}A Spark.
                    **  For the light, to start with[.]; from there, one can hope, for ideas. 
                        *** [A match, then.]
                            #CLEAR
                            ~ choiceRelevantLast = "lightIgnite"
                            {myLightSource:
                                - "candle":
                                    ~ myLightLevel = 1
                                - "gas":
                                    ~ myLightLevel = 2
                            }
        
        //Drink
            //Level 1: I Need Drink
                *   (needDrink) [Fluids]
                #CLEAR
                --  Here, in solitude, your throat unclenches enough to consider hydration.

                **  The foul taste that comes from advanced thirst, when one becomes aware of their own bad breath.
                    #CLEAR

            //Level 2: What Drink?
                +   {needDrink && myDrink == "none"} An Infusion of[...]
                    ++  [Purity]Water
                        ~ myDrink = "water"
                    ++  [Luxury]Wine
                        ~ myDrink = "wine"
                        //Add red/white choice
                    ++  [Fortitude]Beer
                        ~ myDrink = "beer"
                    ++  [Fire]Whiskey
                        ~ myDrink = "whiskey"

                    --

                    ++  Perfect
                    ++  Or, perhaps, something else.
                        ~ myDrink = "none"
            
            TODO Level 3:
                *   {myDrink == "water"}{myLightLevel >= 1} WATER
                *   {myDrink == "wine"}{myLightLevel >= 1} WINE
                *   {myDrink == "beer"}{myLightLevel >= 1} BEER
                *   {myDrink == "whiskey"}{myLightLevel >= 1} WHISKEY

        //Food
            //Level 1: I Need Food
                *   (needFood) [Sustenance]
            
            //Level 2: What Food?
            
            //Level 3: 
                *   {needFood}{myLightLevel > 0} FOOD
        
        //This next choice unlocks when the three needs are fulfilled
            +   {CHOICE_COUNT() == 0} The candle gutters
                #CLEAR
                -> d1_1900

        -   -> PrepareStart