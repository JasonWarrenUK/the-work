=== Action(-> go) ===

    + (Action_Textual) Attend to the Work

        ++ (draft_Rule) {lvl_Rule < 6} [Rule]
            ~ FocusConcept = "Rule"
            The structures of authority, the frameworks of law. {lvl_Rule == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Faith) {lvl_Faith < 6} [Faith]
            ~ FocusConcept = "Faith"
            What is believed without evidence, and why. {lvl_Faith == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Meaning) {lvl_Meaning < 6} [Meaning]
            ~ FocusConcept = "Meaning"
            The question of significance itself. {lvl_Meaning == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Class) {lvl_Class < 6} [Class]
            ~ FocusConcept = "Class"
            The ordering of people into hierarchies. {lvl_Class == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Art) {lvl_Art < 6} [Art]
            ~ FocusConcept = "Art"
            Beauty, expression, the made thing. {lvl_Art == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Nature) {lvl_Nature < 6} [Nature]
            ~ FocusConcept = "Nature"
            The world before and beneath civilisation. {lvl_Nature == 0:An unexplored thread.|You return to this thread.}
        ++ (draft_Morality) {lvl_Morality < 6} [Morality]
            ~ FocusConcept = "Morality"
            Right and wrong. Duty and consequence. {lvl_Morality == 0:An unexplored thread.|You return to this thread.}

        -- You scratch out the bones of an idea about {FocusConcept}.
            {advanceConcept(FocusConcept)}
            ~ temp newLevel = getConceptLevel(FocusConcept)
            {printAdvancement(FocusConcept, newLevel)}
            {advanceTime()}

    + (Action_Physical) Connect with the real world

        ++ (Action_Physical_Consider) [Paw through the detritus]
            Your fingers sift through the papers and objects on the desk.
            {countConceptsStarted() < 7:
                ~ temp found = ""
                {lvl_Rule == 0:
                    ~ found = "Rule"
                - lvl_Faith == 0:
                    ~ found = "Faith"
                - lvl_Meaning == 0:
                    ~ found = "Meaning"
                - lvl_Class == 0:
                    ~ found = "Class"
                - lvl_Art == 0:
                    ~ found = "Art"
                - lvl_Nature == 0:
                    ~ found = "Nature"
                - lvl_Morality == 0:
                    ~ found = "Morality"
                }
                {found != "":
                    Something catches your eye. A scrap, an object — it provokes a thought about {found}.
                    {advanceConcept(found)}
                    {printAdvancement(found, 1)}
                - else:
                    Nothing new reveals itself.
                }
            - else:
                You've already gleaned what you can from this clutter.
            }
            {advanceTime()}

    + (Action_Mental) Exercise the mind

        ++ (Action_Mental_Reflect) [Reflect on your progress]
            You pause, and take stock.
            {countConceptsStarted() > 0:
                {printThoughtProgress()}
            - else:
                The page stares back at you. Blank.
            }
            {advanceTime()}

        ++ (Action_Mental_Deepen) {countConceptsStarted() > 0} [Dwell on a thread]
            +++ {lvl_Rule >= 2 && lvl_Rule < 6} [Rule]
                ~ FocusConcept = "Rule"
            +++ {lvl_Faith >= 2 && lvl_Faith < 6} [Faith]
                ~ FocusConcept = "Faith"
            +++ {lvl_Meaning >= 2 && lvl_Meaning < 6} [Meaning]
                ~ FocusConcept = "Meaning"
            +++ {lvl_Class >= 2 && lvl_Class < 6} [Class]
                ~ FocusConcept = "Class"
            +++ {lvl_Art >= 2 && lvl_Art < 6} [Art]
                ~ FocusConcept = "Art"
            +++ {lvl_Nature >= 2 && lvl_Nature < 6} [Nature]
                ~ FocusConcept = "Nature"
            +++ {lvl_Morality >= 2 && lvl_Morality < 6} [Morality]
                ~ FocusConcept = "Morality"

            --- You turn the thought over in your mind, examining it from new angles.
                {advanceConcept(FocusConcept)}
                ~ temp deepLevel = getConceptLevel(FocusConcept)
                {printAdvancement(FocusConcept, deepLevel)}
                {advanceTime()}

    -
        -> go
