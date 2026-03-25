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
        ->->

    - ->->


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

    - ->->

// P1 — Government gazette: restrictions
= observe_P1
    The gazette announces new restrictions on public assembly.

    + [Measured. Precise. Final.]
        {acquire_idea("O1a")}
    + [You skim the details.]
        {acquire_idea("O1b")}
    + [Clinical. Cold.]
        {acquire_idea("O1c")}

    - ->->

// P2 — Government gazette: promotions
= observe_P2
    The gazette lists promotions in the civil service.

    + [The best rise.]
        {acquire_idea("O2a")}
    + [The same families.]
        {acquire_idea("O2b")}
    + [A closed circle.]
        {acquire_idea("O2c")}

    - ->->

// P3 — Rent demand
= observe_P3
    The rent is due Thursday. The figure has gone up again.

    + [Costs rise. You'll manage.]
        {acquire_idea("O3a")}
    + [The landlord's hand is steady.]
        {acquire_idea("O3b")}
    + [The arithmetic of ownership.]
        {acquire_idea("O3c")}

    - ->->

// P4 — Letter: paper
= observe_P4
    Your colleague writes about a paper they're preparing. Between the lines, something else.

    + [Caution is wisdom.]
        {acquire_idea("O4a")}
    + [A warning: be careful.]
        {acquire_idea("O4b")}
    + [They're afraid.]
        {acquire_idea("O4c")}

    - ->->

// P5 — Letter: names
= observe_P5
    Your colleague mentions names. People who've gone quiet.

    + [People move on.]
        {acquire_idea("O5a")}
    + [The list is getting longer.]
        {acquire_idea("O5b")}
    + [A roll call of silence.]
        {acquire_idea("O5c")}

    - ->->

// P6 — Letter from family
= observe_P6
    Your mother's handwriting. She asks if you're eating enough.

    + [She worries. Love, simply.]
        {acquire_idea("O6a")}
    + [Her handwriting is smaller.]
        {acquire_idea("O6b")}
    + [She's learned not to mention things.]
        {acquire_idea("O6c")}

    - ->->

// P7 — Rejection letter
= observe_P7
    The rejection is polite. "Not suited to the present climate."

    + [Editors have judgment.]
        {acquire_idea("O7a")}
    + [At least they read it.]
        {acquire_idea("O7b")}
    + [Not wrong — just inconvenient.]
        {acquire_idea("O7c")}

    - ->->

// P8 — Annotated lexicon
= observe_P8
    The lexicon falls open to a page covered in your annotations.

    + [Precision matters.]
        {acquire_idea("O8a")}
    + [The right word, still missing.]
        {acquire_idea("O8b")}
    + [Words you're not allowed to use.]
        {acquire_idea("O8c")}

    - ->->

// P9 — Half-finished sketch
= observe_P9
    A sketch of a building. You drew it from memory.

    + [Something preserved.]
        {acquire_idea("O9a")}
    + [The memory is already wrong.]
        {acquire_idea("O9b")}
    + [Memory is authorship.]
        {acquire_idea("O9c")}

    - ->->

// P10 — Pocket watch
= observe_P10
    The pocket watch has stopped. 3:17.

    + [It needs winding.]
        {acquire_idea("O10a")}
    + [You can't remember what happened.]
        {acquire_idea("O10b")}
    + [Time stopped and the world kept going.]
        {acquire_idea("O10c")}

    - ->->

// P11 — Worn coin
= observe_P11
    An old coin. The face on it belongs to no current authority.

    + [Worth its weight in metal.]
        {acquire_idea("O11a")}
    + [The face is worn smooth.]
        {acquire_idea("O11b")}
    + [Authorities change. The coin remains.]
        {acquire_idea("O11c")}

    - ->->

// P12 — Ink pot and nib
= observe_P12
    The ink is low. The nib is worn.

    + [Tools of the trade.]
        {acquire_idea("O12a")}
    + [Enough, if you don't waste it.]
        {acquire_idea("O12b")}
    + [Both are finite.]
        {acquire_idea("O12c")}

    - ->->

// P13 — Blank paper
= observe_P13
    The blank page.

    + [Space to fill.]
        {acquire_idea("O13a")}
    + [It waits.]
        {acquire_idea("O13b")}
    + [A dare. Or an accusation.]
        {acquire_idea("O13c")}

    - ->->

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

    - ->->

// P14 — Bible, Ecclesiastes
= observe_P14
    The Bible falls open to Ecclesiastes. "Of making many books there is no end."

    + [A comfort.]
        {acquire_idea("O14a")}
    + [A warning against vanity.]
        {acquire_idea("O14b")}
    + [Foolish or defiant.]
        {acquire_idea("O14c")}

    - ->->

// P15 — Bible, Romans 13
= observe_P15
    The spine is cracked at Romans 13. "Let every soul be subject unto the higher powers."

    + [The divine order.]
        {acquire_idea("O15a")}
    + [For comfort or conviction.]
        {acquire_idea("O15b")}
    + [Convenient, that God agrees.]
        {acquire_idea("O15c")}

    - ->->

// P16 — Natural philosophy
= observe_P16
    The text describes how organisms adapt to hostile environments. Slowly, over generations.

    + [Adaptation is strength.]
        {acquire_idea("O16a")}
    + [Not overnight.]
        {acquire_idea("O16b")}
    + [What doesn't adapt, dies.]
        {acquire_idea("O16c")}

    - ->->

// P17 — Poetry
= observe_P17
    A poem about a field in summer.

    + [Beautiful. A reminder.]
        {acquire_idea("O17a")}
    + [Useless. Beautiful.]
        {acquire_idea("O17b")}
    + [A world that doesn't exist.]
        {acquire_idea("O17c")}

    - ->->

// P18 — Political pamphlet
= observe_P18
    The pamphlet argues that the current order is natural, inevitable, divinely ordained.

    + [Persuasive. Well-argued.]
        {acquire_idea("O18a")}
    + [Printed on good paper.]
        {acquire_idea("O18b")}
    + [Three claims, each doing the work of the others.]
        {acquire_idea("O18c")}

    - ->->

// P19 — Botanical field guide
= observe_P19
    The field guide catalogues species. Precise, clinical descriptions.

    + [Comfort in taxonomy.]
        {acquire_idea("O19a")}
    + [No symbolism. Just fact.]
        {acquire_idea("O19b")}
    + [The plants don't care.]
        {acquire_idea("O19c")}

    - ->->

// P20 — Legal compendium
= observe_P20
    The compendium defines rights. Some no longer apply.

    + [Flexibility is functioning.]
        {acquire_idea("O20a")}
    + [Rights on paper, nowhere else.]
        {acquire_idea("O20b")}
    + [Permissions, not rights.]
        {acquire_idea("O20c")}

    - ->->

// P21 — Children's storybook
= observe_P21
    A storybook. The wolf is punished for asking too many questions.

    + [That's how stories work.]
        {acquire_idea("O21a")}
    + [Don't ask, don't tell.]
        {acquire_idea("O21b")}
    + [The wolf was right to ask.]
        {acquire_idea("O21c")}

    - ->->

// P22 — Alchemical text
= observe_P22
    The alchemical text promises transformation. Base metal into gold.

    + [Charlatanism.]
        {acquire_idea("O22a")}
    + [Everything reads differently now.]
        {acquire_idea("O22b")}
    + [Change requires destruction.]
        {acquire_idea("O22c")}

    - ->->

// P23 — Hymnbook
= observe_P23
    The hymnbook is inscribed to you. The handwriting is unmistakable.

    + [A gift, given in faith.]
        {acquire_idea("O23a")}
    + [The person isn't here.]
        {acquire_idea("O23b")}
    + [Songs of certainty.]
        {acquire_idea("O23c")}

    - ->->

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

    - ->->

// P24 — Dinner remains
= observe_P24
    Bones picked clean. A heel of bread gone hard.

    + [Simple but sufficient.]
        {acquire_idea("O24a")}
    + [You're used to this now.]
        {acquire_idea("O24b")}
    + [Somewhere, someone is throwing food away.]
        {acquire_idea("O24c")}

    - ->->

// P25 — Apple
= observe_P25
    The apple has a brown spot. It's spreading.

    + [Cut around it.]
        {acquire_idea("O25a")}
    + [Still edible, for now.]
        {acquire_idea("O25b")}
    + [The rot is patient.]
        {acquire_idea("O25c")}

    - ->->

// P26 — Whiskey
= observe_P26
    The whiskey is a quarter full.

    + [A small mercy.]
        {acquire_idea("O26a")}
    + [Warm or blur. Not both.]
        {acquire_idea("O26b")}
    + [Rationing pleasure.]
        {acquire_idea("O26c")}

    - ->->

// P27 — Knife
= observe_P27
    The knife. Dull but clean.

    + [Dignity in a tool.]
        {acquire_idea("O27a")}
    + [One tool, many purposes.]
        {acquire_idea("O27b")}
    + [It could be other things.]
        {acquire_idea("O27c")}

    - ->->

// P28 — Gas stove
= observe_P28
    The pilot light flickers.

    + [Count your blessings.]
        {acquire_idea("O28a")}
    + [Not in your control.]
        {acquire_idea("O28b")}
    + [All your lives, tied to a flame.]
        {acquire_idea("O28c")}

    - ->->

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

    - ->->

// P29 — Bed
= observe_P29
    The bed. Unmade.

    + [Work to do first.]
        {acquire_idea("O29a")}
    + [The shape of your absence.]
        {acquire_idea("O29b")}
    + [Like everything you haven't finished.]
        {acquire_idea("O29c")}

    - ->->

// P30 — Coat as blanket
= observe_P30
    The coat is too thin for this, but it's warmer than the blanket.

    + [Everyone makes do.]
        {acquire_idea("O30a")}
    + [The line has blurred.]
        {acquire_idea("O30b")}
    + [Nothing works for its purpose.]
        {acquire_idea("O30c")}

    - ->->

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

    - ->->

// P31 — Mirror
= observe_P31
    Your face in the mirror.

    + [Tired. But still here.]
        {acquire_idea("O31a")}
    + [When did you start looking like this?]
        {acquire_idea("O31b")}
    + [You don't recognise the person.]
        {acquire_idea("O31c")}

    - ->->

// P32 — Razor
= observe_P32
    The razor. Sharp. Clean.

    + [Discipline in small things.]
        {acquire_idea("O32a")}
    + [It does its one job well.]
        {acquire_idea("O32b")}
    + [The sharpest thing in the room.]
        {acquire_idea("O32c")}

    - ->->

// P33 — Soap
= observe_P33
    The soap is a sliver.

    + [It'll last if you're careful.]
        {acquire_idea("O33a")}
    + [Deciding what to spend on.]
        {acquire_idea("O33b")}
    + [The cost of cleanliness.]
        {acquire_idea("O33c")}

    - ->->

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

    - ->->

// P34 — Photograph
= observe_P34
    The photograph is face-down. You put it that way.

    + [Better left alone.]
        {acquire_idea("O34a")}
    + [You know what's there.]
        {acquire_idea("O34b")}
    + [So they can't watch.]
        {acquire_idea("O34c")}

    - ->->

// P35 — Recruitment poster
= observe_P35
    The poster promises purpose, belonging, a future.

    + [Service has its rewards.]
        {acquire_idea("O35a")}
    + [It does not mention what you'd have to do.]
        {acquire_idea("O35b")}
    + [Three things the state broke.]
        {acquire_idea("O35c")}

    - ->->

// P36 — Concert programme
= observe_P36
    A programme from a concert. From before.

    + [A pleasant memory.]
        {acquire_idea("O36a")}
    + [You kept it, though you can't say why.]
        {acquire_idea("O36b")}
    + [You lost the world it came from.]
        {acquire_idea("O36c")}

    - ->->

// P37 — Death certificate
= observe_P37
    The certificate. Official, stamped, filed.

    + [How civilisation works.]
        {acquire_idea("O37a")}
    + [A life reduced to a form.]
        {acquire_idea("O37b")}
    + [As if death needed permission.]
        {acquire_idea("O37c")}

    - ->->

// P38 — Military medal
= observe_P38
    The medal. Heavy for its size.

    + [Honour. Service recognised.]
        {acquire_idea("O38a")}
    + [Whether it was worth commemorating.]
        {acquire_idea("O38b")}
    + [In exchange for something that can't be given back.]
        {acquire_idea("O38c")}

    - ->->

// P39 — Key
= observe_P39
    The key doesn't fit anything in this room.

    + [Out of habit.]
        {acquire_idea("O39a")}
    + [Worth keeping.]
        {acquire_idea("O39b")}
    + [Somewhere you can't go.]
        {acquire_idea("O39c")}

    - ->->

// P40 — Crack
= observe_P40
    The crack in the wall. Getting wider.

    + [Buildings settle.]
        {acquire_idea("O40a")}
    + [So slowly you can't be sure.]
        {acquire_idea("O40b")}
    + [Everything breaks from the inside.]
        {acquire_idea("O40c")}

    - ->->

// P41 — Window
= observe_P41
    Through the window: rooftops, a church spire, smoke.

    + [Your city. Still going.]
        {acquire_idea("O41a")}
    + [Going on without you.]
        {acquire_idea("O41b")}
    + [Held together by habit.]
        {acquire_idea("O41c")}

    - ->->

// P42 — Specimen jar
= observe_P42
    The jar holds something preserved in cloudy liquid.

    + [A relic of your studies.]
        {acquire_idea("O42a")}
    + [It watches you. Absurd.]
        {acquire_idea("O42b")}
    + [Unable to decay or grow.]
        {acquire_idea("O42c")}

    - ->->

// P43 — Map
= observe_P43
    The map has pencil marks. Routes, places. Some crossed out.

    + [Routes change. You update it.]
        {acquire_idea("O43a")}
    + [The city is getting smaller.]
        {acquire_idea("O43b")}
    + [Your world, shrinking.]
        {acquire_idea("O43c")}

    - ->->

// P44 — Door
= observe_P44
    The door is latched but not locked.

    + [Nothing worth stealing.]
        {acquire_idea("O44a")}
    + [You could leave at any time.]
        {acquire_idea("O44b")}
    + [The prison you built yourself.]
        {acquire_idea("O44c")}

    - ->->

// P45 — Floorboard
= observe_P45
    The floorboard is loose.

    + [Not your building.]
        {acquire_idea("O45a")}
    + [If this were home.]
        {acquire_idea("O45b")}
    + [Not even the floor.]
        {acquire_idea("O45c")}

    - ->->

// P46 — Coat on hook
= observe_P46
    The coat on the hook.

    + [Well-worn. Reliable.]
        {acquire_idea("O46a")}
    + [It's seen better days.]
        {acquire_idea("O46b")}
    + [Class wears thin.]
        {acquire_idea("O46c")}

    - ->->

// P47 — Handbill
= observe_P47
    The handbill offers factory work. Twelve-hour shifts. Fair wages. Housing.

    + [Honest work.]
        {acquire_idea("O47a")}
    + [You could put down the pen.]
        {acquire_idea("O47b")}
    + [They're buying your time.]
        {acquire_idea("O47c")}

    - ->->

// P48 — Stain on ceiling
= observe_P48
    The stain on the ceiling.

    + [Landlord's problem.]
        {acquire_idea("O48a")}
    + [Shaped like nothing.]
        {acquire_idea("O48b")}
    + [Finding meaning in stains.]
        {acquire_idea("O48c")}

    - ->->
