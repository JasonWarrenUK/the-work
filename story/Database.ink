//Database Template
	LIST properties = Name, Description, Value   

	LIST items = bottleWhiskey, pendantSilver

	=== function getData(item, property)   
		{item:
			- pendantSilver:
				{property:    
						- Name: ~ return "Silver Pendant"    
						- Value: ~ return 50     
						- Description: ~ return "Tarnished, in many senses."
					}
		    - bottleWhiskey:
				{property:    
						- Name: ~ return "A Bottle of Whiskey"
						- Value: ~ return 35
						- Description: ~ return "It's Half Full."    
					}
			}


=== database
    -   (top)
    
    +   Check the Pendant
        ++  What is its name?
            {getData(pendantSilver, Name)}
        ++  How much is it worth?
            {getData(pendantSilver, Value)}
        ++  What does it look like?
            {getData(pendantSilver, Description)}
        
    +   Check the Whiskey Bottle
        ++  What is its name?
            {getData(bottleWhiskey, Name)}
        ++  How much is it worth?
            {getData(bottleWhiskey, Value)}
        ++  What does it look like?
            {getData(bottleWhiskey, Description)}
        
    +   Return to the Debug Menu
        -> debugMenu

    -   -> top