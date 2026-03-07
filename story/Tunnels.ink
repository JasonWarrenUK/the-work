=== Action(-> go) ===

    + (Action_Textual) Attend to The Work

        ++ {lvl_Rule >= 3 && lvl_Rule > written_Rule} [Rule — {levelName(lvl_Rule)}]
            ~ FocusConcept = "Rule"
        ++ {lvl_Faith >= 3 && lvl_Faith > written_Faith} [Faith — {levelName(lvl_Faith)}]
            ~ FocusConcept = "Faith"
        ++ {lvl_Truth >= 3 && lvl_Truth > written_Truth} [Truth — {levelName(lvl_Truth)}]
            ~ FocusConcept = "Truth"
        ++ {lvl_Class >= 3 && lvl_Class > written_Class} [Class — {levelName(lvl_Class)}]
            ~ FocusConcept = "Class"
        ++ {lvl_Art >= 3 && lvl_Art > written_Art} [Art — {levelName(lvl_Art)}]
            ~ FocusConcept = "Art"
        ++ {lvl_Nature >= 3 && lvl_Nature > written_Nature} [Nature — {levelName(lvl_Nature)}]
            ~ FocusConcept = "Nature"
        ++ {lvl_Morality >= 3 && lvl_Morality > written_Morality} [Morality — {levelName(lvl_Morality)}]
            ~ FocusConcept = "Morality"

        ++ {CHOICE_COUNT() == 0} [Set pen to paper]
            -- Your thoughts are too unformed to commit to the page. You need to develop them further.
            {advanceTime()}
            -> go

        -- You set pen to paper on the subject of {FocusConcept}.
            {writeConcept(FocusConcept)}
            ~ temp wLevel = getConceptLevel(FocusConcept)
            {printWriteResult(FocusConcept, wLevel)}
            {advanceTime()}

    + (Action_Physical) Consider your circumstances

        ** (examine_legal) [A legal document, dense with clauses]
            A contract of some kind, or perhaps a statute. The language of obligation and authority.
            {lvl_Rule == 0:
                {advanceConcept("Rule")}
                {printAdvancement("Rule", 1)}
            - else:
                It reinforces what you already sense about Rule.
            }
            {advanceTime()}

        ** (examine_bible) [An old Bible]
            The leather is cracked, the gilt faded. Someone has underlined passages in trembling ink.
            {lvl_Faith == 0:
                {advanceConcept("Faith")}
                {printAdvancement("Faith", 1)}
            - else:
                Your thoughts on Faith are already in motion.
            }
            {advanceTime()}

        ** (examine_pamphlet) [A discarded pamphlet]
            Dense with argument. The author was trying to mean something, to say something that mattered.
            {lvl_Truth == 0:
                {advanceConcept("Truth")}
                {printAdvancement("Truth", 1)}
            - else:
                The question of Truth is already in your thoughts.
            }
            {advanceTime()}

        ** (examine_letter) [An envelope, marked URGENT]
            A rent demand. The landlord's handwriting is impatient, almost contemptuous.
            {lvl_Class == 0:
                {advanceConcept("Class")}
                {printAdvancement("Class", 1)}
            - else:
                The demand only confirms what you already know about Class.
            }
            {advanceTime()}

        ** (examine_sketch) [A rough sketch, half-finished]
            Someone's attempt at beauty, abandoned before completion.
            {lvl_Art == 0:
                {advanceConcept("Art")}
                {printAdvancement("Art", 1)}
            - else:
                Art has already caught your eye.
            }
            {advanceTime()}

        ** (examine_scraps) [The remains of dinner]
            A few scraps. Bones stripped clean. The body's needs are insistent.
            {lvl_Nature == 0:
                {advanceConcept("Nature")}
                {printAdvancement("Nature", 1)}
            - else:
                Nature's demands are already familiar to you.
            }
            {advanceTime()}

        ** (examine_photograph) [A photograph, face-down]
            Someone you recognise. The weight of responsibility, of choosing rightly.
            {lvl_Morality == 0:
                {advanceConcept("Morality")}
                {printAdvancement("Morality", 1)}
            - else:
                The question of Morality already weighs on you.
            }
            {advanceTime()}

        ++ {CHOICE_COUNT() == 0} [Look around]
            -- You've already examined everything on the desk. The objects have yielded what they can.
            {advanceTime()}

    + (Action_Mental) Exercise the mind

        ++ (Action_Mental_Deepen) {countConceptsStarted() > 0} [Dwell on a thread]
            +++ {lvl_Rule >= 2 && lvl_Rule < 6} [Rule]
                ~ FocusConcept = "Rule"
            +++ {lvl_Faith >= 2 && lvl_Faith < 6} [Faith]
                ~ FocusConcept = "Faith"
            +++ {lvl_Truth >= 2 && lvl_Truth < 6} [Truth]
                ~ FocusConcept = "Truth"
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

        ++ (Action_Mental_Combine) {countConceptsStarted() >= 1 && countConceptsStarted() < 7} [Draw connections]
            Two threads, and the space between them...
            +++ {lvl_Rule >= 2} [Rule]
                ~ FocusConcept = "Rule"
            +++ {lvl_Faith >= 2} [Faith]
                ~ FocusConcept = "Faith"
            +++ {lvl_Truth >= 2} [Truth]
                ~ FocusConcept = "Truth"
            +++ {lvl_Class >= 2} [Class]
                ~ FocusConcept = "Class"
            +++ {lvl_Art >= 2} [Art]
                ~ FocusConcept = "Art"
            +++ {lvl_Nature >= 2} [Nature]
                ~ FocusConcept = "Nature"
            +++ {lvl_Morality >= 2} [Morality]
                ~ FocusConcept = "Morality"

            --- You push {FocusConcept} against something else, looking for friction, for resonance...
                {sparkFromCombination(FocusConcept)}
                {advanceTime()}

        ++ (Action_Mental_Reflect) [Reflect on your progress]
            You pause, and take stock.
            {countConceptsStarted() > 0:
                {printThoughtProgress()}
                {countConceptsWritten() > 0:
                    On the page:
                    {printWrittenProgress()}
                }
            - else:
                The page stares back at you. Blank.
            }
            {advanceTime()}

    -
        -> go
