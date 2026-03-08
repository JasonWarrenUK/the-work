// Core action tunnel — the three branches of gameplay.
// Called each turn from the main loop (d1_2000).

=== Action(-> go) ===

    // --- ATTEND TO THE WORK (Writing) ---
    + (Action_Textual) Attend to The Work
        {get_total_dread() >= 6:
            Your hand trembles as you reach for the pen.
        - else:
            {get_total_dread() >= 3:
                The words don't come easily tonight.
            }
        }

        // Per-idea selective writing: list individual writable ideas (level 3+, held, not written)
        ~ temp w0 = writable_idea_at(0)
        ~ temp w1 = writable_idea_at(1)
        ~ temp w2 = writable_idea_at(2)
        ~ temp w3 = writable_idea_at(3)
        ~ temp w4 = writable_idea_at(4)

        ++ {w0 != ""} [{get_idea_text(w0)}]
            ~ write_idea(w0)
            -- You set pen to paper.
            {printWriteResultForIdea(w0)}
            {advanceTime()}
        ++ {w1 != ""} [{get_idea_text(w1)}]
            ~ write_idea(w1)
            -- You set pen to paper.
            {printWriteResultForIdea(w1)}
            {advanceTime()}
        ++ {w2 != ""} [{get_idea_text(w2)}]
            ~ write_idea(w2)
            -- You set pen to paper.
            {printWriteResultForIdea(w2)}
            {advanceTime()}
        ++ {w3 != ""} [{get_idea_text(w3)}]
            ~ write_idea(w3)
            -- You set pen to paper.
            {printWriteResultForIdea(w3)}
            {advanceTime()}
        ++ {w4 != ""} [{get_idea_text(w4)}]
            ~ write_idea(w4)
            -- You set pen to paper.
            {printWriteResultForIdea(w4)}
            {advanceTime()}

        ++ {CHOICE_COUNT() == 0} [Set pen to paper]
            -- Your thoughts are too unformed to commit to the page. You need to develop them further.
            {advanceTime()}

    // --- CONSIDER YOUR CIRCUMSTANCES (Observation) ---
    + (Action_Physical) Consider your circumstances

        -> observe ->

        {advanceTime()}

    // --- EXERCISE THE MIND (Development & Combination) ---
    + (Action_Mental) Exercise the mind

        ++ (Action_Mental_Deepen) {can_develop_domain("Rule") || can_develop_domain("Faith") || can_develop_domain("Truth") || can_develop_domain("Class") || can_develop_domain("Art") || can_develop_domain("Nature") || can_develop_domain("Morality")} [Dwell on a thread]

            +++ {can_develop_domain("Rule")} [Rule]
                ~ FocusConcept = "Rule"
            +++ {can_develop_domain("Faith")} [Faith]
                ~ FocusConcept = "Faith"
            +++ {can_develop_domain("Truth")} [Truth]
                ~ FocusConcept = "Truth"
            +++ {can_develop_domain("Class")} [Class]
                ~ FocusConcept = "Class"
            +++ {can_develop_domain("Art")} [Art]
                ~ FocusConcept = "Art"
            +++ {can_develop_domain("Nature")} [Nature]
                ~ FocusConcept = "Nature"
            +++ {can_develop_domain("Morality")} [Morality]
                ~ FocusConcept = "Morality"

            --- You turn the thought over in your mind, examining it from new angles.
                ~ temp resultId = develop_in_domain(FocusConcept)
                {resultId != "":
                    ~ temp resultText = get_idea_text(resultId)
                    {resultText}
                - else:
                    The thought resists. It isn't ready to become something more. Not yet.
                }
                {advanceTime()}

        ++ (Action_Mental_Combine) {get_domain_level("Rule") >= 1 || get_domain_level("Faith") >= 1 || get_domain_level("Truth") >= 1 || get_domain_level("Class") >= 1 || get_domain_level("Art") >= 1 || get_domain_level("Nature") >= 1 || get_domain_level("Morality") >= 1} [Draw connections]
            Two threads, and the space between them...

            +++ {get_domain_level("Rule") >= 1} [Rule]
                ~ FocusConcept = "Rule"
            +++ {get_domain_level("Faith") >= 1} [Faith]
                ~ FocusConcept = "Faith"
            +++ {get_domain_level("Truth") >= 1} [Truth]
                ~ FocusConcept = "Truth"
            +++ {get_domain_level("Class") >= 1} [Class]
                ~ FocusConcept = "Class"
            +++ {get_domain_level("Art") >= 1} [Art]
                ~ FocusConcept = "Art"
            +++ {get_domain_level("Nature") >= 1} [Nature]
                ~ FocusConcept = "Nature"
            +++ {get_domain_level("Morality") >= 1} [Morality]
                ~ FocusConcept = "Morality"

            --- You push {FocusConcept} against something else, looking for friction, for resonance...
                // Try combining with each other domain
                ~ temp combo = ""
                {combo == "" && FocusConcept != "Rule" && get_domain_level("Rule") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Rule")
                }
                {combo == "" && FocusConcept != "Faith" && get_domain_level("Faith") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Faith")
                }
                {combo == "" && FocusConcept != "Truth" && get_domain_level("Truth") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Truth")
                }
                {combo == "" && FocusConcept != "Class" && get_domain_level("Class") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Class")
                }
                {combo == "" && FocusConcept != "Art" && get_domain_level("Art") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Art")
                }
                {combo == "" && FocusConcept != "Nature" && get_domain_level("Nature") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Nature")
                }
                {combo == "" && FocusConcept != "Morality" && get_domain_level("Morality") >= 1:
                    ~ combo = combine_domains(FocusConcept, "Morality")
                }

                {combo != "":
                    ~ temp comboText = get_idea_text(combo)
                    {comboText}
                - else:
                    You hold them together, but nothing catches. Not yet.
                }
                {advanceTime()}

        ++ (Action_Mental_Reflect) [Reflect on your progress]
            You pause, and take stock.
            {get_domain_level("Rule") > 0 || get_domain_level("Faith") > 0 || get_domain_level("Truth") > 0 || get_domain_level("Class") > 0 || get_domain_level("Art") > 0 || get_domain_level("Nature") > 0 || get_domain_level("Morality") > 0:
                {get_domain_level("Rule") > 0:
                    Rule: {levelName(get_domain_level("Rule"))}
                }
                {get_domain_level("Faith") > 0:
                    Faith: {levelName(get_domain_level("Faith"))}
                }
                {get_domain_level("Truth") > 0:
                    Truth: {levelName(get_domain_level("Truth"))}
                }
                {get_domain_level("Class") > 0:
                    Class: {levelName(get_domain_level("Class"))}
                }
                {get_domain_level("Art") > 0:
                    Art: {levelName(get_domain_level("Art"))}
                }
                {get_domain_level("Nature") > 0:
                    Nature: {levelName(get_domain_level("Nature"))}
                }
                {get_domain_level("Morality") > 0:
                    Morality: {levelName(get_domain_level("Morality"))}
                }
                {get_written_level("Rule") > 0 || get_written_level("Faith") > 0 || get_written_level("Truth") > 0 || get_written_level("Class") > 0 || get_written_level("Art") > 0 || get_written_level("Nature") > 0 || get_written_level("Morality") > 0:
                    On the page:
                    {get_written_level("Rule") > 0:
                        Rule: {levelName(get_written_level("Rule"))}
                    }
                    {get_written_level("Faith") > 0:
                        Faith: {levelName(get_written_level("Faith"))}
                    }
                    {get_written_level("Truth") > 0:
                        Truth: {levelName(get_written_level("Truth"))}
                    }
                    {get_written_level("Class") > 0:
                        Class: {levelName(get_written_level("Class"))}
                    }
                    {get_written_level("Art") > 0:
                        Art: {levelName(get_written_level("Art"))}
                    }
                    {get_written_level("Nature") > 0:
                        Nature: {levelName(get_written_level("Nature"))}
                    }
                    {get_written_level("Morality") > 0:
                        Morality: {levelName(get_written_level("Morality"))}
                    }
                }
            - else:
                The page stares back at you. Blank.
            }
            {get_total_dread() > 0:
                {get_dread("Existential") > 0: A weight behind everything. }
                {get_dread("Academic") > 0: The committee, always the committee. }
                {get_dread("Economic") > 0: The arithmetic of survival. }
            }
            {advanceTime()}

    -
        -> go
