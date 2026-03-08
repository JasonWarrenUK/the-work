//THOUGHT DEVELOPMENT

=== function getConceptLevel(concept)
    {concept:
        - "Rule": ~ return lvl_Rule
        - "Faith": ~ return lvl_Faith
        - "Truth": ~ return lvl_Truth
        - "Class": ~ return lvl_Class
        - "Art": ~ return lvl_Art
        - "Nature": ~ return lvl_Nature
        - "Morality": ~ return lvl_Morality
    }
    ~ return 0

=== function advanceConcept(concept)
    {concept:
        - "Rule":
            {lvl_Rule < 6:
                ~ lvl_Rule += 1
            }
        - "Faith":
            {lvl_Faith < 6:
                ~ lvl_Faith += 1
            }
        - "Truth":
            {lvl_Truth < 6:
                ~ lvl_Truth += 1
            }
        - "Class":
            {lvl_Class < 6:
                ~ lvl_Class += 1
            }
        - "Art":
            {lvl_Art < 6:
                ~ lvl_Art += 1
            }
        - "Nature":
            {lvl_Nature < 6:
                ~ lvl_Nature += 1
            }
        - "Morality":
            {lvl_Morality < 6:
                ~ lvl_Morality += 1
            }
    }
    {updateThoughtZenith()}

=== function updateThoughtZenith()
    ~ ThoughtZenith = 0
    {lvl_Rule > ThoughtZenith:
        ~ ThoughtZenith = lvl_Rule
    }
    {lvl_Faith > ThoughtZenith:
        ~ ThoughtZenith = lvl_Faith
    }
    {lvl_Truth > ThoughtZenith:
        ~ ThoughtZenith = lvl_Truth
    }
    {lvl_Class > ThoughtZenith:
        ~ ThoughtZenith = lvl_Class
    }
    {lvl_Art > ThoughtZenith:
        ~ ThoughtZenith = lvl_Art
    }
    {lvl_Nature > ThoughtZenith:
        ~ ThoughtZenith = lvl_Nature
    }
    {lvl_Morality > ThoughtZenith:
        ~ ThoughtZenith = lvl_Morality
    }

=== function levelName(level)
    {level:
        - 0: ~ return "Unstarted"
        - 1: ~ return "Observation"
        - 2: ~ return "Inkling"
        - 3: ~ return "Idea"
        - 4: ~ return "Concept"
        - 5: ~ return "Argument"
        - 6: ~ return "Thesis"
    }
    ~ return "Unknown"

=== function countThesesReached()
    ~ temp count = 0
    {lvl_Rule >= 6:
        ~ count += 1
    }
    {lvl_Faith >= 6:
        ~ count += 1
    }
    {lvl_Truth >= 6:
        ~ count += 1
    }
    {lvl_Class >= 6:
        ~ count += 1
    }
    {lvl_Art >= 6:
        ~ count += 1
    }
    {lvl_Nature >= 6:
        ~ count += 1
    }
    {lvl_Morality >= 6:
        ~ count += 1
    }
    ~ return count

=== function countConceptsStarted()
    ~ temp count = 0
    {lvl_Rule > 0:
        ~ count += 1
    }
    {lvl_Faith > 0:
        ~ count += 1
    }
    {lvl_Truth > 0:
        ~ count += 1
    }
    {lvl_Class > 0:
        ~ count += 1
    }
    {lvl_Art > 0:
        ~ count += 1
    }
    {lvl_Nature > 0:
        ~ count += 1
    }
    {lvl_Morality > 0:
        ~ count += 1
    }
    ~ return count

//WRITING

=== function writeConcept(concept)
    {concept:
        - "Rule": ~ written_Rule = lvl_Rule
        - "Faith": ~ written_Faith = lvl_Faith
        - "Truth": ~ written_Truth = lvl_Truth
        - "Class": ~ written_Class = lvl_Class
        - "Art": ~ written_Art = lvl_Art
        - "Nature": ~ written_Nature = lvl_Nature
        - "Morality": ~ written_Morality = lvl_Morality
    }
    {TheWork == blankPage:
        ~ TheWork = inProgress
    }

=== function getWrittenLevel(concept)
    {concept:
        - "Rule": ~ return written_Rule
        - "Faith": ~ return written_Faith
        - "Truth": ~ return written_Truth
        - "Class": ~ return written_Class
        - "Art": ~ return written_Art
        - "Nature": ~ return written_Nature
        - "Morality": ~ return written_Morality
    }
    ~ return 0

=== function countThesesWritten()
    ~ temp count = 0
    {written_Rule >= 6:
        ~ count += 1
    }
    {written_Faith >= 6:
        ~ count += 1
    }
    {written_Truth >= 6:
        ~ count += 1
    }
    {written_Class >= 6:
        ~ count += 1
    }
    {written_Art >= 6:
        ~ count += 1
    }
    {written_Nature >= 6:
        ~ count += 1
    }
    {written_Morality >= 6:
        ~ count += 1
    }
    ~ return count

=== function countConceptsWritten()
    ~ temp count = 0
    {written_Rule > 0:
        ~ count += 1
    }
    {written_Faith > 0:
        ~ count += 1
    }
    {written_Truth > 0:
        ~ count += 1
    }
    {written_Class > 0:
        ~ count += 1
    }
    {written_Art > 0:
        ~ count += 1
    }
    {written_Nature > 0:
        ~ count += 1
    }
    {written_Morality > 0:
        ~ count += 1
    }
    ~ return count

=== function printWriteResult(concept, level)
    {level:
        - 3: The words come haltingly. An idea about {concept}, set down in rough strokes. It's a start.
        - 4: The pen moves with growing confidence. {concept} takes shape on the page — a formed concept, articulated.
        - 5: The argument flows. {concept} is laid out with precision, each point building on the last.
        - 6: You write with the certainty of the possessed. {concept} — a complete thesis, unassailable.
    }

=== function printWriteResultForIdea(id)
    ~ temp level = get_idea_level(id)
    {level:
        - 3: The words come haltingly, but they come. You set the thought down in rough strokes. It's a start.
        - 4: The pen moves with growing confidence. The thought takes shape on the page — a formed concept, articulated.
        - 5: The argument flows, each point building on the last. You write with precision.
        - 6: You write with the certainty of the possessed. A complete thesis, unassailable.
    }

=== function printWrittenProgress()
    {written_Rule > 0:
        Rule: {levelName(written_Rule)}
    }
    {written_Faith > 0:
        Faith: {levelName(written_Faith)}
    }
    {written_Truth > 0:
        Truth: {levelName(written_Truth)}
    }
    {written_Class > 0:
        Class: {levelName(written_Class)}
    }
    {written_Art > 0:
        Art: {levelName(written_Art)}
    }
    {written_Nature > 0:
        Nature: {levelName(written_Nature)}
    }
    {written_Morality > 0:
        Morality: {levelName(written_Morality)}
    }

//COMBINATION

=== function findSpark(first, second, third)
    {getConceptLevel(first) == 0:
        ~ return first
    }
    {getConceptLevel(second) == 0:
        ~ return second
    }
    {getConceptLevel(third) == 0:
        ~ return third
    }
    ~ return ""

=== function sparkFromCombination(concept)
    //Each concept, used as a lens, tends to spark a thematically adjacent concept
    ~ temp sparked = ""
    {concept:
        - "Rule":
            ~ sparked = findSpark("Class", "Morality", "Faith")
        - "Faith":
            ~ sparked = findSpark("Truth", "Morality", "Nature")
        - "Truth":
            ~ sparked = findSpark("Art", "Faith", "Nature")
        - "Class":
            ~ sparked = findSpark("Morality", "Rule", "Truth")
        - "Art":
            ~ sparked = findSpark("Nature", "Truth", "Faith")
        - "Nature":
            ~ sparked = findSpark("Rule", "Art", "Class")
        - "Morality":
            ~ sparked = findSpark("Faith", "Class", "Rule")
    }
    {sparked != "":
        The collision sparks something new. A thought about {sparked}, unbidden.
        {advanceConcept(sparked)}
        {printAdvancement(sparked, 1)}
    - else:
        The thoughts churn, but nothing new emerges. Every thread has already been touched.
    }

//TIME

=== function advanceTime()
    ~ TimeScore -= 1
    {TimeScore mod 10 == 0:
        ~ TimeNumber += 1
        {updateWorldState()}
    }

TODO === function forceTimeJump(JumpAmount)
TODO === function Inspect(object)

=== function increment(value, amount)
    ~ value += amount

=== function BeginScene()
    {updateWorldState()}
    {printSituation()}

=== function updateWorldState()
    {updateTimeName()}
    {updateConvictionDesc()}

=== function updateTimeName()
    {TimeNumber:
        - 7:
            ~ TimeName = "7:00pm"
            ~ TimeFolk = "the Glimmers"
            ~ TimeDesc = "The last red of the sky can be dimly seen through the grimy curtains."
        - 8:
            ~ TimeName = "8:00pm"
            ~ TimeFolk = ""
            ~ TimeDesc = "The city settles. Through the window, chimney smoke thins against a darkening sky."
        - 9:
            ~ TimeName = "9:00pm"
            ~ TimeFolk = ""
            ~ TimeDesc = "The candle gutters. You trim the wick and the shadows resettle, reluctantly."
        - 10:
            ~ TimeName = "10:00pm"
            ~ TimeFolk = ""
            ~ TimeDesc = "A door closes somewhere in the building. Footsteps on the stairs, then silence. You are alone with the work."
        - 11:
            ~ TimeName = "11:00pm"
            ~ TimeFolk = ""
            ~ TimeDesc = "The gas lamp hisses. Outside, the last tram rattles past. The city is letting go of the day."
        - 12:
            ~ TimeName = "midnight"
            ~ TimeFolk = ""
            ~ TimeDesc = "The bells. Twelve strokes from the church spire, each one falling into the silence that follows."
        - 13:
            ~ TimeName = "1:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "The room feels smaller now. The walls lean in. The cold is settling into the floorboards."
        - 14:
            ~ TimeName = "2:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "Your eyes ache. The words on the page swim, rearrange themselves, refuse to hold still."
        - 15:
            ~ TimeName = "3:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "The body pushes back. Your hand cramps around the pen. The bed is right there."
        - 16:
            ~ TimeName = "4:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "The quietest hour. Nothing moves. Even the building has stopped settling. The silence is total."
        - 17:
            ~ TimeName = "5:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "A bird. Then another. The world is beginning to remember that it exists."
        - 18:
            ~ TimeName = "6:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "Grey light through the curtains. The candle is a stub. Dawn finds you still at the desk."
        - 19:
            ~ TimeName = "7:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = "The city wakes. Cart wheels on cobblestones. Voices. The committee convenes in one hour."
        - 20:
            ~ TimeName = "8:00am"
            ~ TimeFolk = ""
            ~ TimeDesc = ""
    }

=== function updateConvictionDesc
    {ConvictionScore:
        - 1:
            ~ ConvictionDesc = ""
        - 2:
            ~ ConvictionDesc = ""
        - 3:
            ~ ConvictionDesc = ""
        - 4:
            ~ ConvictionDesc = ""
        - 5:
            ~ ConvictionDesc = "You are calm. Resolute."
    }

=== function printSituation()
    {printTimeName()}
    {printTimeDesc()}
    {printConviction()}

=== function printTimeName()
    It is {TimeName}.

=== function printTimeDesc()
    {TimeDesc}
    {TimeNumber == 12 && get_dread("Existential") >= 2:
        The bells count out the nothing. Each stroke a question you can't answer.
    }
    {TimeNumber == 14 && get_dread("Academic") >= 2:
        You imagine the committee reading this. Their faces. The silence after.
    }
    {TimeNumber == 15 && get_dread("Existential") >= 3:
        You catch yourself staring at the door. It's not locked. It was never locked.
    }
    {TimeNumber == 17 && get_dread("Economic") >= 1:
        The rent demand sits where you left it. In the new light, the figure looks larger.
    }
    {TimeNumber == 19 && get_total_dread() >= 5:
        Your hands are shaking. Not from the cold.
    }

=== function printConviction()
    {ConvictionDesc}

=== function printThoughtProgress()
    {lvl_Rule > 0:
        Rule: {levelName(lvl_Rule)}
    }
    {lvl_Faith > 0:
        Faith: {levelName(lvl_Faith)}
    }
    {lvl_Truth > 0:
        Truth: {levelName(lvl_Truth)}
    }
    {lvl_Class > 0:
        Class: {levelName(lvl_Class)}
    }
    {lvl_Art > 0:
        Art: {levelName(lvl_Art)}
    }
    {lvl_Nature > 0:
        Nature: {levelName(lvl_Nature)}
    }
    {lvl_Morality > 0:
        Morality: {levelName(lvl_Morality)}
    }

=== function printAdvancement(concept, level)
    {level:
        - 1: A surface detail catches your attention. An observation about {concept}, nothing more.
        - 2: Something stirs. An inkling — a faint shape in the murk — about {concept}.
        - 3: The inkling sharpens. You have an idea about {concept} now, however unrefined.
        - 4: The idea coheres. {concept} takes form as a concept — structured, if not yet defensible.
        - 5: You can see the argument now. {concept} has a logic to it, a through-line you could defend.
        - 6: It crystallises. A thesis on {concept}. Complete. Rigorous. Yours.
    }