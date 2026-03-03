//STORY STATE 
    //PROGRESS OF THE WRITER
        LIST TheWork = (blankPage), inProgress, complete

    //PROGRESS OF THE THREAT
        //Pressure Data
            VAR PressureScore = 1 

        //Time Data
            //Increases as ideas tried out?
            VAR TimeScore = 140
            VAR TimeNumber = 7

        //How the Threats are Perceived
            VAR TimeName = ""
            VAR TimeFolk = ""
            VAR TimeDesc = ""

    //PROGRESS OF THE STORY
        //This is a good place to start looking at those Heaven's Vault knowledge state machines    
        VAR choiceRelevantLast = ""

//THE PHYSICAL WORLD
    //WHAT CAN BE NOTICED?
        //Items
            LIST Items = basic_RuleItem, OldBible, basic_MeaningItem, EnvelopeRent, basic_ArtItem, DinnerScraps, basic_MoralityItem
            TODO Add other items

        //Light
            LIST LightSource = none, arcane, bulb, candle, gasLamp
            LIST LightType = none, flame, incandescence, magic
                //So, thinking this through...
                    //Arcane Flame
                    //Arcane Incandescence
                    //Arcane Magic
                    //Candle Flame
                    TODO Candle Incandescence
                    //Candle Magic
                    //Gas Flame
                    TODO Gas Incandescence
                    //Gas Magic
            LIST LightSourceState = none, chosen, unlit, lit

        //Food & Drink
            LIST DrinkSource = none, cup, mug, flask, goblet, flagon, bottle, trough
            LIST DrinkType = none, water, beer, wine, whiskey
            LIST FoodSource = basic_FoodSource
            LIST FoodType = basic_FoodType 

        //Misc
            LIST Colours = orange, violet, yellow
            //And other shit

    //WHAT HAS BEEN NOTICED?
        //Light
            VAR myLightSource = "none"
            VAR myLightLevel = 0
            VAR myLightColour = "none"
                //I think I want this to be a light, so a light can be yellow-white etc

            VAR myLight_Name = ""
            VAR myLight_Desc = ""
            VAR myLightLevel_Desc = "Nothing but dim shapes can be seen through the thickened gloom."

        //Food & Drink
            VAR myDrink = "none"
            VAR myFood = "none"
            
            VAR myDrink_Name = ""
            VAR myDrink_Desc = ""
                
            VAR myFood_Name = ""
            VAR myFood_Desc = ""
            VAR myFoodSource_Name = ""
            VAR myFoodSource_Desc = ""
            
    //WHAT IS FELT?
        //Hunger
            VAR myHungerLevel = 0
            VAR myHunger_Name = "satiated"
            VAR myHunger_Desc = "You've eaten recently. Not well, necessarily. But recently."

        //Thirst
            VAR myThirstLevel = 0
            VAR myThirst_Name = "quenched"
            VAR myThirst_Desc = "You possess a sinuous vitality; an almost fluidly energetic quality permeates your movements."
            
//THE MENTAL WORLD
    //WHAT CAN BE THOUGHT?
        LIST Thought_Qualities = Initial, Big, Original, Misguided, Distorted
        LIST Thought_Orthodoxy = Apologist, Orthodox, Heterodox, Heretical
        LIST Thought_Level = Observation, Inkling, Idea, Concept, Argument, Thesis

            LIST Concepts = Rule, Faith, Meaning, Class, Art, Nature, Morality
            TODO First pass at these LISTs
                //  LIST Observations = _observation
                //  LIST Inklings = _inkling
                //  LIST Ideas = _idea
                //  LIST Arguments = _argument
                //  LIST Theses = _thesis
        
    //WHAT HAS BEEN THOUGHT?
        VAR ThoughtLevel_Current = ""
        VAR ThoughtLevel_Zenith = ""


        VAR Idea_Current = ""
        VAR Concept_Current = ""
        VAR Thesis_Current = ""

        //Per-concept progress
        //  0=Unstarted, 1=Observation, 2=Inkling, 3=Idea, 4=Concept, 5=Argument, 6=Thesis
        VAR lvl_Rule = 0
        VAR lvl_Faith = 0
        VAR lvl_Meaning = 0
        VAR lvl_Class = 0
        VAR lvl_Art = 0
        VAR lvl_Nature = 0
        VAR lvl_Morality = 0

        //Currently focused concept
        VAR FocusConcept = ""

        //Highest level reached across all concepts
        VAR ThoughtZenith = 0

        //Per-concept written state (level at which concept was committed to the page)
        VAR written_Rule = 0
        VAR written_Faith = 0
        VAR written_Meaning = 0
        VAR written_Class = 0
        VAR written_Art = 0
        VAR written_Nature = 0
        VAR written_Morality = 0

//THE EMOTIONAL WORLD
    VAR ConvictionScore = 5
        VAR ConvictionDesc = "You are calm. Resolute."

    VAR Dread_Score = 0
    VAR Dread_Type = ""
        VAR d_Existential = 0
        VAR d_Academic = 0
        VAR d_Economic = 0
    VAR Anxiety_Score = 0
        ~ Anxiety_Score = d_Existential + d_Academic + d_Economic

//Dread Function Worksheet
    === function updateAnxiety_Score()
        ~ Anxiety_Score = d_Existential + d_Academic + d_Economic
        
    === function compare_dEx_dAc()
        {d_Existential: 
            -   < d_Academic:
                
            -   >= d_Academic:
        }
        
    === function compare_dEx_dEc()
        {d_Existential: 
            -   < d_Economic:
            -   >= d_Economic:
        }
        
    === function compare_dAc_dEc()
        {d_Academic: 
            -   < d_Economic:
            -   >= d_Economic:
        }
        
    //write conditional block here that will:
        //compare the three types of dread
        //set Dread_Type to match the highest
            //e.g. if the most pressing concern is paying rent, Dread_Type is d_Economic
        //set Dread_Score to match value of highest d_xxx variable