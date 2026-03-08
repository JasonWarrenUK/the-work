=== d2_0800 ===
    #CLEAR
    It is 8:00 in the morning. Your time is up.

    // Count written domains and theses using the idea system
    ~ endingWrittenDomains = 0
    ~ endingThesesWritten = 0
    {get_written_level("Rule") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Rule") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Faith") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Faith") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Truth") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Truth") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Class") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Class") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Art") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Art") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Nature") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Nature") >= 6:
            ~ endingThesesWritten += 1
        }
    }
    {get_written_level("Morality") > 0:
        ~ endingWrittenDomains += 1
        {get_written_level("Morality") >= 6:
            ~ endingThesesWritten += 1
        }
    }

    {endingThesesWritten >= 3:
        -> ending_triumph
    - else:
        {endingThesesWritten >= 1:
            -> ending_defence
        - else:
            {endingWrittenDomains >= 1:
                -> ending_fragments
            - else:
                -> ending_blank
            }
        }
    }

= ending_triumph
    The pages are dense with argument. You gather them with hands that barely shake.

    {endingThesesWritten} threads — each one a thesis, complete and rigorous. More than enough.

    You have delivered. The committee will find no weakness here.

    On the page:
    -> print_written_summary ->

    The committee will see:
    -> print_orthodoxy_summary ->

    -> END

= ending_defence
    You have something. Not everything you'd hoped for, but something real.

    {endingThesesWritten == 1:A single thesis|{endingThesesWritten} theses}, hard-won, surrounded by the scaffolding of incomplete ideas.

    It may be enough. It will have to be enough.

    On the page:
    -> print_written_summary ->

    The committee will see:
    -> print_orthodoxy_summary ->

    -> END

= ending_fragments
    The desk is littered with half-formed text. {endingWrittenDomains} threads committed to the page, none brought to completion.

    You have drafts. Sketches of arguments. The ghosts of ideas.

    But nothing that could survive the committee's scrutiny.

    On the page:
    -> print_written_summary ->

    -> END

= ending_blank
    The page stares up at you. Nearly as blank as when you began.

    {get_domain_level("Rule") > 0 || get_domain_level("Faith") > 0 || get_domain_level("Truth") > 0 || get_domain_level("Class") > 0 || get_domain_level("Art") > 0 || get_domain_level("Nature") > 0 || get_domain_level("Morality") > 0:
        The thoughts were there — turning in your mind. But none of them made it to the page.
    }

    Thirteen hours. Gone.

    The committee will not defer a third time.

    -> END

// --- Summary tunnels ---

= print_written_summary
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
    ->->

= print_orthodoxy_summary
    {get_written_level("Rule") > 0:
        ~ temp oRule = get_written_orthodoxy("Rule")
        {oRule > 60:
            Rule: An apologist's position. The committee nods.
        - else:
            {oRule > 10:
                Rule: An orthodox position. Acceptable.
            - else:
                {oRule > -10:
                    Rule: A neutral position on Rule. The committee watches carefully.
                - else:
                    {oRule > -60:
                        Rule: A questioning position. The bureaucrat's pen pauses.
                    - else:
                        Rule: A heretical position. The bureaucrat's face is stone.
                    }
                }
            }
        }
    }
    {get_written_level("Faith") > 0:
        ~ temp oFaith = get_written_orthodoxy("Faith")
        {oFaith > 60:
            Faith: An apologist's position. The cleric is pleased.
        - else:
            {oFaith > 10:
                Faith: An orthodox position. The cleric nods.
            - else:
                {oFaith > -10:
                    Faith: A neutral position. The cleric waits.
                - else:
                    {oFaith > -60:
                        Faith: A heterodox position. The cleric frowns.
                    - else:
                        Faith: A heretical position. The cleric closes the Bible.
                    }
                }
            }
        }
    }
    {get_written_level("Truth") > 0:
        ~ temp oTruth = get_written_orthodoxy("Truth")
        {oTruth > 60:
            Truth: An apologist's position. The professor approves.
        - else:
            {oTruth > 10:
                Truth: An orthodox position. The professor nods.
            - else:
                {oTruth > -10:
                    Truth: A neutral position. The professor considers.
                - else:
                    {oTruth > -60:
                        Truth: A questioning position. The professor removes their spectacles.
                    - else:
                        Truth: A heretical position. The professor sets down their notes.
                    }
                }
            }
        }
    }
    {get_written_level("Class") > 0:
        ~ temp oClass = get_written_orthodoxy("Class")
        {oClass > 60:
            Class: An apologist's position.
        - else:
            {oClass > 10:
                Class: An orthodox position.
            - else:
                {oClass > -10:
                    Class: A neutral position.
                - else:
                    {oClass > -60:
                        Class: A questioning position. The bureaucrat makes a note.
                    - else:
                        Class: A heretical position. The room is very quiet.
                    }
                }
            }
        }
    }
    {get_written_level("Art") > 0:
        ~ temp oArt = get_written_orthodoxy("Art")
        {oArt > 60:
            Art: An apologist's position.
        - else:
            {oArt > 10:
                Art: An orthodox position.
            - else:
                {oArt > -10:
                    Art: A neutral position.
                - else:
                    {oArt > -60:
                        Art: A questioning position.
                    - else:
                        Art: A heretical position.
                    }
                }
            }
        }
    }
    {get_written_level("Nature") > 0:
        ~ temp oNature = get_written_orthodoxy("Nature")
        {oNature > 60:
            Nature: An apologist's position.
        - else:
            {oNature > 10:
                Nature: An orthodox position.
            - else:
                {oNature > -10:
                    Nature: A neutral position.
                - else:
                    {oNature > -60:
                        Nature: A questioning position.
                    - else:
                        Nature: A heretical position.
                    }
                }
            }
        }
    }
    {get_written_level("Morality") > 0:
        ~ temp oMorality = get_written_orthodoxy("Morality")
        {oMorality > 60:
            Morality: An apologist's position.
        - else:
            {oMorality > 10:
                Morality: An orthodox position.
            - else:
                {oMorality > -10:
                    Morality: A neutral position.
                - else:
                    {oMorality > -60:
                        Morality: A questioning position.
                    - else:
                        Morality: A heretical position.
                    }
                }
            }
        }
    }
    ->->
