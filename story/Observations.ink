// Observation prompts — the "Consider your circumstances" action.
// Each object presents a neutral prompt. The player chooses a reading.
// The reading IS the observation — it acquires an idea with orthodoxy scores.

// Player picks a location, then an object, then a reading.
// Objects use ** (sticky once-only) so each can only be examined once per game.

=== observe ===
    Where do you look?

    + [The work area]
        -> observe_work_area
    + [The shelves]
        -> observe_shelves
    + [The kitchenette]
        -> observe_kitchenette
    + [The bed]
        -> observe_bed
    + [The bathroom]
        -> observe_bathroom
    + [Around the room]
        -> observe_walls
    + {CHOICE_COUNT() == 0} [Look around]
        You've already examined everything in the room. The objects have yielded what they can.
        -> observe_done

    - -> observe_done

=== observe_done ===
    -> DONE

// ---------------------------------------------------------------------------
// WORK AREA
// ---------------------------------------------------------------------------

=== observe_work_area ===

    ** [The government gazette]
        {~-> observe_P1|-> observe_P2}
    ** [The rent demand]
        -> observe_P3
    ** [A letter from a colleague]
        {~-> observe_P4|-> observe_P5}
    ** [A letter from family]
        -> observe_P6
    ** [The rejection letter]
        -> observe_P7
    ** [The annotated lexicon]
        -> observe_P8
    ** [A half-finished sketch]
        -> observe_P9
    ** [The pocket watch]
        -> observe_P10
    ** [A worn coin]
        -> observe_P11
    ** [Ink pot and nib]
        -> observe_P12
    ** [The blank page]
        -> observe_P13
    + {CHOICE_COUNT() == 0} [Nothing else here]
        You've examined everything on the desk.

    - -> observe_done

// P1 — Government gazette: restrictions
= observe_P1
    The gazette announces new restrictions on public assembly.

    + [Measured. Precise. Final.]
        ~ temp t = acquire_idea("O1a")
        {t}
    + [You skim the details.]
        ~ temp t = acquire_idea("O1b")
        {t}
    + [Clinical. Cold.]
        ~ temp t = acquire_idea("O1c")
        {t}

    - -> observe_done

// P2 — Government gazette: promotions
= observe_P2
    The gazette lists promotions in the civil service.

    + [The best rise.]
        ~ temp t = acquire_idea("O2a")
        {t}
    + [The same families.]
        ~ temp t = acquire_idea("O2b")
        {t}
    + [A closed circle.]
        ~ temp t = acquire_idea("O2c")
        {t}

    - -> observe_done

// P3 — Rent demand
= observe_P3
    The rent is due Thursday. The figure has gone up again.

    + [Costs rise. You'll manage.]
        ~ temp t = acquire_idea("O3a")
        {t}
    + [The landlord's hand is steady.]
        ~ temp t = acquire_idea("O3b")
        {t}
    + [The arithmetic of ownership.]
        ~ temp t = acquire_idea("O3c")
        {t}

    - -> observe_done

// P4 — Letter: paper
= observe_P4
    Your colleague writes about a paper they're preparing. Between the lines, something else.

    + [Caution is wisdom.]
        ~ temp t = acquire_idea("O4a")
        {t}
    + [A warning: be careful.]
        ~ temp t = acquire_idea("O4b")
        {t}
    + [They're afraid.]
        ~ temp t = acquire_idea("O4c")
        {t}

    - -> observe_done

// P5 — Letter: names
= observe_P5
    Your colleague mentions names. People who've gone quiet.

    + [People move on.]
        ~ temp t = acquire_idea("O5a")
        {t}
    + [The list is getting longer.]
        ~ temp t = acquire_idea("O5b")
        {t}
    + [A roll call of silence.]
        ~ temp t = acquire_idea("O5c")
        {t}

    - -> observe_done

// P6 — Letter from family
= observe_P6
    Your mother's handwriting. She asks if you're eating enough.

    + [She worries. Love, simply.]
        ~ temp t = acquire_idea("O6a")
        {t}
    + [Her handwriting is smaller.]
        ~ temp t = acquire_idea("O6b")
        {t}
    + [She's learned not to mention things.]
        ~ temp t = acquire_idea("O6c")
        {t}

    - -> observe_done

// P7 — Rejection letter
= observe_P7
    The rejection is polite. "Not suited to the present climate."

    + [Editors have judgment.]
        ~ temp t = acquire_idea("O7a")
        {t}
    + [At least they read it.]
        ~ temp t = acquire_idea("O7b")
        {t}
    + [Not wrong — just inconvenient.]
        ~ temp t = acquire_idea("O7c")
        {t}

    - -> observe_done

// P8 — Annotated lexicon
= observe_P8
    The lexicon falls open to a page covered in your annotations.

    + [Precision matters.]
        ~ temp t = acquire_idea("O8a")
        {t}
    + [The right word, still missing.]
        ~ temp t = acquire_idea("O8b")
        {t}
    + [Words you're not allowed to use.]
        ~ temp t = acquire_idea("O8c")
        {t}

    - -> observe_done

// P9 — Half-finished sketch
= observe_P9
    A sketch of a building. You drew it from memory.

    + [Something preserved.]
        ~ temp t = acquire_idea("O9a")
        {t}
    + [The memory is already wrong.]
        ~ temp t = acquire_idea("O9b")
        {t}
    + [Memory is authorship.]
        ~ temp t = acquire_idea("O9c")
        {t}

    - -> observe_done

// P10 — Pocket watch
= observe_P10
    The pocket watch has stopped. 3:17.

    + [It needs winding.]
        ~ temp t = acquire_idea("O10a")
        {t}
    + [You can't remember what happened.]
        ~ temp t = acquire_idea("O10b")
        {t}
    + [Time stopped and the world kept going.]
        ~ temp t = acquire_idea("O10c")
        {t}

    - -> observe_done

// P11 — Worn coin
= observe_P11
    An old coin. The face on it belongs to no current authority.

    + [Worth its weight in metal.]
        ~ temp t = acquire_idea("O11a")
        {t}
    + [The face is worn smooth.]
        ~ temp t = acquire_idea("O11b")
        {t}
    + [Authorities change. The coin remains.]
        ~ temp t = acquire_idea("O11c")
        {t}

    - -> observe_done

// P12 — Ink pot and nib
= observe_P12
    The ink is low. The nib is worn.

    + [Tools of the trade.]
        ~ temp t = acquire_idea("O12a")
        {t}
    + [Enough, if you don't waste it.]
        ~ temp t = acquire_idea("O12b")
        {t}
    + [Both are finite.]
        ~ temp t = acquire_idea("O12c")
        {t}

    - -> observe_done

// P13 — Blank paper
= observe_P13
    The blank page.

    + [Space to fill.]
        ~ temp t = acquire_idea("O13a")
        {t}
    + [It waits.]
        ~ temp t = acquire_idea("O13b")
        {t}
    + [A dare. Or an accusation.]
        ~ temp t = acquire_idea("O13c")
        {t}

    - -> observe_done

// ---------------------------------------------------------------------------
// SHELVES & BOOKS
// ---------------------------------------------------------------------------

=== observe_shelves ===

    ** [The Bible]
        {~-> observe_P14|-> observe_P15}
    ** [A natural philosophy text]
        -> observe_P16
    ** [A poetry collection]
        -> observe_P17
    ** [A political pamphlet]
        -> observe_P18
    ** [A botanical field guide]
        -> observe_P19
    ** [A legal compendium]
        -> observe_P20
    ** [A children's storybook]
        -> observe_P21
    ** [An alchemical text]
        -> observe_P22
    ** [The hymnbook]
        -> observe_P23
    + {CHOICE_COUNT() == 0} [Nothing else on the shelves]
        You've examined every volume.

    - -> observe_done

// P14 — Bible, Ecclesiastes
= observe_P14
    The Bible falls open to Ecclesiastes. "Of making many books there is no end."

    + [A comfort.]
        ~ temp t = acquire_idea("O14a")
        {t}
    + [A warning against vanity.]
        ~ temp t = acquire_idea("O14b")
        {t}
    + [Foolish or defiant.]
        ~ temp t = acquire_idea("O14c")
        {t}

    - -> observe_done

// P15 — Bible, Romans 13
= observe_P15
    The spine is cracked at Romans 13. "Let every soul be subject unto the higher powers."

    + [The divine order.]
        ~ temp t = acquire_idea("O15a")
        {t}
    + [For comfort or conviction.]
        ~ temp t = acquire_idea("O15b")
        {t}
    + [Convenient, that God agrees.]
        ~ temp t = acquire_idea("O15c")
        {t}

    - -> observe_done

// P16 — Natural philosophy
= observe_P16
    The text describes how organisms adapt to hostile environments. Slowly, over generations.

    + [Adaptation is strength.]
        ~ temp t = acquire_idea("O16a")
        {t}
    + [Not overnight.]
        ~ temp t = acquire_idea("O16b")
        {t}
    + [What doesn't adapt, dies.]
        ~ temp t = acquire_idea("O16c")
        {t}

    - -> observe_done

// P17 — Poetry
= observe_P17
    A poem about a field in summer.

    + [Beautiful. A reminder.]
        ~ temp t = acquire_idea("O17a")
        {t}
    + [Useless. Beautiful.]
        ~ temp t = acquire_idea("O17b")
        {t}
    + [A world that doesn't exist.]
        ~ temp t = acquire_idea("O17c")
        {t}

    - -> observe_done

// P18 — Political pamphlet
= observe_P18
    The pamphlet argues that the current order is natural, inevitable, divinely ordained.

    + [Persuasive. Well-argued.]
        ~ temp t = acquire_idea("O18a")
        {t}
    + [Printed on good paper.]
        ~ temp t = acquire_idea("O18b")
        {t}
    + [Three claims, each doing the work of the others.]
        ~ temp t = acquire_idea("O18c")
        {t}

    - -> observe_done

// P19 — Botanical field guide
= observe_P19
    The field guide catalogues species. Precise, clinical descriptions.

    + [Comfort in taxonomy.]
        ~ temp t = acquire_idea("O19a")
        {t}
    + [No symbolism. Just fact.]
        ~ temp t = acquire_idea("O19b")
        {t}
    + [The plants don't care.]
        ~ temp t = acquire_idea("O19c")
        {t}

    - -> observe_done

// P20 — Legal compendium
= observe_P20
    The compendium defines rights. Some no longer apply.

    + [Flexibility is functioning.]
        ~ temp t = acquire_idea("O20a")
        {t}
    + [Rights on paper, nowhere else.]
        ~ temp t = acquire_idea("O20b")
        {t}
    + [Permissions, not rights.]
        ~ temp t = acquire_idea("O20c")
        {t}

    - -> observe_done

// P21 — Children's storybook
= observe_P21
    A storybook. The wolf is punished for asking too many questions.

    + [That's how stories work.]
        ~ temp t = acquire_idea("O21a")
        {t}
    + [Don't ask, don't tell.]
        ~ temp t = acquire_idea("O21b")
        {t}
    + [The wolf was right to ask.]
        ~ temp t = acquire_idea("O21c")
        {t}

    - -> observe_done

// P22 — Alchemical text
= observe_P22
    The alchemical text promises transformation. Base metal into gold.

    + [Charlatanism.]
        ~ temp t = acquire_idea("O22a")
        {t}
    + [Everything reads differently now.]
        ~ temp t = acquire_idea("O22b")
        {t}
    + [Change requires destruction.]
        ~ temp t = acquire_idea("O22c")
        {t}

    - -> observe_done

// P23 — Hymnbook
= observe_P23
    The hymnbook is inscribed to you. The handwriting is unmistakable.

    + [A gift, given in faith.]
        ~ temp t = acquire_idea("O23a")
        {t}
    + [The person isn't here.]
        ~ temp t = acquire_idea("O23b")
        {t}
    + [Songs of certainty.]
        ~ temp t = acquire_idea("O23c")
        {t}

    - -> observe_done

// ---------------------------------------------------------------------------
// KITCHENETTE
// ---------------------------------------------------------------------------

=== observe_kitchenette ===

    ** [The remains of dinner]
        -> observe_P24
    ** [The apple]
        -> observe_P25
    ** [The whiskey bottle]
        -> observe_P26
    ** [The knife]
        -> observe_P27
    ** [The gas stove]
        -> observe_P28
    + {CHOICE_COUNT() == 0} [Nothing else here]
        The kitchenette has nothing more to show you.

    - -> observe_done

// P24 — Dinner remains
= observe_P24
    Bones picked clean. A heel of bread gone hard.

    + [Simple but sufficient.]
        ~ temp t = acquire_idea("O24a")
        {t}
    + [You're used to this now.]
        ~ temp t = acquire_idea("O24b")
        {t}
    + [Somewhere, someone is throwing food away.]
        ~ temp t = acquire_idea("O24c")
        {t}

    - -> observe_done

// P25 — Apple
= observe_P25
    The apple has a brown spot. It's spreading.

    + [Cut around it.]
        ~ temp t = acquire_idea("O25a")
        {t}
    + [Still edible, for now.]
        ~ temp t = acquire_idea("O25b")
        {t}
    + [The rot is patient.]
        ~ temp t = acquire_idea("O25c")
        {t}

    - -> observe_done

// P26 — Whiskey
= observe_P26
    The whiskey is a quarter full.

    + [A small mercy.]
        ~ temp t = acquire_idea("O26a")
        {t}
    + [Warm or blur. Not both.]
        ~ temp t = acquire_idea("O26b")
        {t}
    + [Rationing pleasure.]
        ~ temp t = acquire_idea("O26c")
        {t}

    - -> observe_done

// P27 — Knife
= observe_P27
    The knife. Dull but clean.

    + [Dignity in a tool.]
        ~ temp t = acquire_idea("O27a")
        {t}
    + [One tool, many purposes.]
        ~ temp t = acquire_idea("O27b")
        {t}
    + [It could be other things.]
        ~ temp t = acquire_idea("O27c")
        {t}

    - -> observe_done

// P28 — Gas stove
= observe_P28
    The pilot light flickers.

    + [Count your blessings.]
        ~ temp t = acquire_idea("O28a")
        {t}
    + [Not in your control.]
        ~ temp t = acquire_idea("O28b")
        {t}
    + [All your lives, tied to a flame.]
        ~ temp t = acquire_idea("O28c")
        {t}

    - -> observe_done

// ---------------------------------------------------------------------------
// BED AREA
// ---------------------------------------------------------------------------

=== observe_bed ===

    ** [The bed]
        -> observe_P29
    ** [The coat used as blanket]
        -> observe_P30
    + {CHOICE_COUNT() == 0} [Nothing else here]
        There's nothing more to see.

    - -> observe_done

// P29 — Bed
= observe_P29
    The bed. Unmade.

    + [Work to do first.]
        ~ temp t = acquire_idea("O29a")
        {t}
    + [The shape of your absence.]
        ~ temp t = acquire_idea("O29b")
        {t}
    + [Like everything you haven't finished.]
        ~ temp t = acquire_idea("O29c")
        {t}

    - -> observe_done

// P30 — Coat as blanket
= observe_P30
    The coat is too thin for this, but it's warmer than the blanket.

    + [Everyone makes do.]
        ~ temp t = acquire_idea("O30a")
        {t}
    + [The line has blurred.]
        ~ temp t = acquire_idea("O30b")
        {t}
    + [Nothing works for its purpose.]
        ~ temp t = acquire_idea("O30c")
        {t}

    - -> observe_done

// ---------------------------------------------------------------------------
// BATHROOM
// ---------------------------------------------------------------------------

=== observe_bathroom ===

    ** [The mirror]
        -> observe_P31
    ** [The razor]
        -> observe_P32
    ** [The soap]
        -> observe_P33
    + {CHOICE_COUNT() == 0} [Nothing else here]
        The bathroom has nothing more to show you.

    - -> observe_done

// P31 — Mirror
= observe_P31
    Your face in the mirror.

    + [Tired. But still here.]
        ~ temp t = acquire_idea("O31a")
        {t}
    + [When did you start looking like this?]
        ~ temp t = acquire_idea("O31b")
        {t}
    + [You don't recognise the person.]
        ~ temp t = acquire_idea("O31c")
        {t}

    - -> observe_done

// P32 — Razor
= observe_P32
    The razor. Sharp. Clean.

    + [Discipline in small things.]
        ~ temp t = acquire_idea("O32a")
        {t}
    + [It does its one job well.]
        ~ temp t = acquire_idea("O32b")
        {t}
    + [The sharpest thing in the room.]
        ~ temp t = acquire_idea("O32c")
        {t}

    - -> observe_done

// P33 — Soap
= observe_P33
    The soap is a sliver.

    + [It'll last if you're careful.]
        ~ temp t = acquire_idea("O33a")
        {t}
    + [Deciding what to spend on.]
        ~ temp t = acquire_idea("O33b")
        {t}
    + [The cost of cleanliness.]
        ~ temp t = acquire_idea("O33c")
        {t}

    - -> observe_done

// ---------------------------------------------------------------------------
// WALLS, FIXTURES, ROOM
// ---------------------------------------------------------------------------

=== observe_walls ===

    ** [The photograph, face-down]
        -> observe_P34
    ** [The recruitment poster]
        -> observe_P35
    ** [A concert programme]
        -> observe_P36
    ** [A death certificate]
        -> observe_P37
    ** [A military medal]
        -> observe_P38
    ** [A key]
        -> observe_P39
    ** [The crack in the wall]
        -> observe_P40
    ** [The window]
        -> observe_P41
    ** [A specimen jar]
        -> observe_P42
    ** [A map of the city]
        -> observe_P43
    ** [The door]
        -> observe_P44
    ** [The loose floorboard]
        -> observe_P45
    ** [The coat on the hook]
        -> observe_P46
    ** [A handbill]
        -> observe_P47
    ** [The stain on the ceiling]
        -> observe_P48
    + {CHOICE_COUNT() == 0} [Nothing else]
        You've examined every corner.

    - -> observe_done

// P34 — Photograph
= observe_P34
    The photograph is face-down. You put it that way.

    + [Better left alone.]
        ~ temp t = acquire_idea("O34a")
        {t}
    + [You know what's there.]
        ~ temp t = acquire_idea("O34b")
        {t}
    + [So they can't watch.]
        ~ temp t = acquire_idea("O34c")
        {t}

    - -> observe_done

// P35 — Recruitment poster
= observe_P35
    The poster promises purpose, belonging, a future.

    + [Service has its rewards.]
        ~ temp t = acquire_idea("O35a")
        {t}
    + [It does not mention what you'd have to do.]
        ~ temp t = acquire_idea("O35b")
        {t}
    + [Three things the state broke.]
        ~ temp t = acquire_idea("O35c")
        {t}

    - -> observe_done

// P36 — Concert programme
= observe_P36
    A programme from a concert. From before.

    + [A pleasant memory.]
        ~ temp t = acquire_idea("O36a")
        {t}
    + [You kept it, though you can't say why.]
        ~ temp t = acquire_idea("O36b")
        {t}
    + [You lost the world it came from.]
        ~ temp t = acquire_idea("O36c")
        {t}

    - -> observe_done

// P37 — Death certificate
= observe_P37
    The certificate. Official, stamped, filed.

    + [How civilisation works.]
        ~ temp t = acquire_idea("O37a")
        {t}
    + [A life reduced to a form.]
        ~ temp t = acquire_idea("O37b")
        {t}
    + [As if death needed permission.]
        ~ temp t = acquire_idea("O37c")
        {t}

    - -> observe_done

// P38 — Military medal
= observe_P38
    The medal. Heavy for its size.

    + [Honour. Service recognised.]
        ~ temp t = acquire_idea("O38a")
        {t}
    + [Whether it was worth commemorating.]
        ~ temp t = acquire_idea("O38b")
        {t}
    + [In exchange for something that can't be given back.]
        ~ temp t = acquire_idea("O38c")
        {t}

    - -> observe_done

// P39 — Key
= observe_P39
    The key doesn't fit anything in this room.

    + [Out of habit.]
        ~ temp t = acquire_idea("O39a")
        {t}
    + [Worth keeping.]
        ~ temp t = acquire_idea("O39b")
        {t}
    + [Somewhere you can't go.]
        ~ temp t = acquire_idea("O39c")
        {t}

    - -> observe_done

// P40 — Crack
= observe_P40
    The crack in the wall. Getting wider.

    + [Buildings settle.]
        ~ temp t = acquire_idea("O40a")
        {t}
    + [So slowly you can't be sure.]
        ~ temp t = acquire_idea("O40b")
        {t}
    + [Everything breaks from the inside.]
        ~ temp t = acquire_idea("O40c")
        {t}

    - -> observe_done

// P41 — Window
= observe_P41
    Through the window: rooftops, a church spire, smoke.

    + [Your city. Still going.]
        ~ temp t = acquire_idea("O41a")
        {t}
    + [Going on without you.]
        ~ temp t = acquire_idea("O41b")
        {t}
    + [Held together by habit.]
        ~ temp t = acquire_idea("O41c")
        {t}

    - -> observe_done

// P42 — Specimen jar
= observe_P42
    The jar holds something preserved in cloudy liquid.

    + [A relic of your studies.]
        ~ temp t = acquire_idea("O42a")
        {t}
    + [It watches you. Absurd.]
        ~ temp t = acquire_idea("O42b")
        {t}
    + [Unable to decay or grow.]
        ~ temp t = acquire_idea("O42c")
        {t}

    - -> observe_done

// P43 — Map
= observe_P43
    The map has pencil marks. Routes, places. Some crossed out.

    + [Routes change. You update it.]
        ~ temp t = acquire_idea("O43a")
        {t}
    + [The city is getting smaller.]
        ~ temp t = acquire_idea("O43b")
        {t}
    + [Your world, shrinking.]
        ~ temp t = acquire_idea("O43c")
        {t}

    - -> observe_done

// P44 — Door
= observe_P44
    The door is latched but not locked.

    + [Nothing worth stealing.]
        ~ temp t = acquire_idea("O44a")
        {t}
    + [You could leave at any time.]
        ~ temp t = acquire_idea("O44b")
        {t}
    + [The prison you built yourself.]
        ~ temp t = acquire_idea("O44c")
        {t}

    - -> observe_done

// P45 — Floorboard
= observe_P45
    The floorboard is loose.

    + [Not your building.]
        ~ temp t = acquire_idea("O45a")
        {t}
    + [If this were home.]
        ~ temp t = acquire_idea("O45b")
        {t}
    + [Not even the floor.]
        ~ temp t = acquire_idea("O45c")
        {t}

    - -> observe_done

// P46 — Coat on hook
= observe_P46
    The coat on the hook.

    + [Well-worn. Reliable.]
        ~ temp t = acquire_idea("O46a")
        {t}
    + [It's seen better days.]
        ~ temp t = acquire_idea("O46b")
        {t}
    + [Class wears thin.]
        ~ temp t = acquire_idea("O46c")
        {t}

    - -> observe_done

// P47 — Handbill
= observe_P47
    The handbill offers factory work. Twelve-hour shifts. Fair wages. Housing.

    + [Honest work.]
        ~ temp t = acquire_idea("O47a")
        {t}
    + [You could put down the pen.]
        ~ temp t = acquire_idea("O47b")
        {t}
    + [They're buying your time.]
        ~ temp t = acquire_idea("O47c")
        {t}

    - -> observe_done

// P48 — Stain on ceiling
= observe_P48
    The stain on the ceiling.

    + [Landlord's problem.]
        ~ temp t = acquire_idea("O48a")
        {t}
    + [Shaped like nothing.]
        ~ temp t = acquire_idea("O48b")
        {t}
    + [Finding meaning in stains.]
        ~ temp t = acquire_idea("O48c")
        {t}

    - -> observe_done
