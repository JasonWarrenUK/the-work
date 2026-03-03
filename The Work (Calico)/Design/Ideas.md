# Ideas

Ideas are the units of play. Each idea:
- Has a **level** (Observation through Thesis)
- Is tagged with one or more **concepts** (Rule, Faith, Meaning, Class, Art, Nature, Morality)
- Has an **orthodoxy score** per concept: +100 (full establishment alignment) to -100 (full rejection)
- Has a **source**: provoked by an object, developed from a lower idea, or produced by combining two ideas
- Has **text**: hand-authored for key ideas, generated as placeholder for the rest

## Level Definitions

| Level | Name | What it feels like |
|-------|------|--------------------|
| 1 | Observation | You notice something. A surface detail, interpreted by how you choose to see it. |
| 2 | Inkling | A vague sense that something connects. Not yet a thought. |
| 3 | Idea | A clear thought, however unrefined. Can be written. |
| 4 | Concept | Structured understanding. Can be written well. |
| 5 | Argument | A defensible position with a through-line. |
| 6 | Thesis | Complete, rigorous, yours. |

## Concept Tags

Ideas can belong to multiple concepts. Tags are for our reference — the player doesn't see them. They affect which ideas can appear in combination recipes and how the ending evaluates the Written Work.

Rule | Faith | Meaning | Class | Art | Nature | Morality

## Orthodoxy Score

A numerical score from **+100** to **-100** per concept, replacing the old Apologist/Orthodox/Heterodox/Heretical categories.

- **+100** = full alignment with established doctrine (see World.md — The Established Doctrine)
- **0** = neutral, unexamined, could go either way
- **-100** = full rejection of established doctrine (see World.md — The Counter-Doctrine)

Each idea carries a score only for concepts it touches. A reading about the gazette might carry `Rule +70` while a reading about the apple might carry `Nature -20, Meaning -40`.

The score emerges from:
- Which **readings** the player chooses when examining objects
- Which ideas the player combines
- Which development paths they follow
- At the Argument-to-Thesis transition, a deliberate framing choice

### Score Ranges (Design Reference)

| Range | Old label | Feel |
|-------|-----------|------|
| +60 to +100 | Apologist | Active endorsement. The system is right AND good. Rare — takes effort. |
| +10 to +60 | Orthodox | Acceptance. This is how things are. Path of least resistance. |
| -10 to +10 | Neutral | Unexamined, ambiguous, or deliberately balanced. |
| -60 to -10 | Heterodox | Questioning. Something is wrong. Discomfort, noticing, asking why. |
| -100 to -60 | Heretical | Rejection. Dangerous clarity. The view from outside. |

These labels are for design reference only — the player never sees them.

---

## Observations (Level 1)

Each object presents a **prompt** — a raw sensory fact. The player chooses a **reading** — how the Writer interprets what they see. The reading IS the observation. It carries per-concept orthodoxy scores.

This means the player's philosophical position begins forming from their very first interaction. Two players examining the same gazette will produce different Writers.

### From Work Area

**P1 — Government gazette (#1)**
"The gazette announces new restrictions on public assembly."

| ID | Reading | Scores |
|----|---------|--------|
| O1a | Measured. Precise. Final. The language of people who know what they're doing. | Rule +70 |
| O1b | More restrictions. You skim the details. This is just how things are now. | Rule +10 |
| O1c | Clinical. Cold. The language of people who've stopped seeing faces. | Rule -40 |

**P2 — Government gazette (#1)**
"The gazette lists promotions in the civil service."

| ID | Reading | Scores |
|----|---------|--------|
| O2a | The best rise. Competence rewarded, as it should be. | Rule +60, Class +60 |
| O2b | The same families, the same schools. It's always been this way. | Rule +10, Class +10 |
| O2c | A closed circle calling itself a meritocracy. | Rule -40, Class -50 |

**P3 — Rent demand (#2)**
"The rent is due Thursday. The figure has gone up again."

| ID | Reading | Scores |
|----|---------|--------|
| O3a | Costs rise. Everyone adjusts. You'll manage. | Class +10 |
| O3b | The landlord's hand is steady — he's done this before. You wonder if he thinks about who lives here. | Class -30 |
| O3c | You could work for a year and he'd still own the building. The arithmetic of ownership never changes. | Class -70 |

**P4 — Letter from a colleague (#3)**
"Your colleague writes about a paper they're preparing. Between the lines, something else."

| ID | Reading | Scores |
|----|---------|--------|
| O4a | Caution is wisdom. Your colleague is being sensible. | Art +20, Rule +20 |
| O4b | Between the lines, a warning: be careful what you publish. | Art -20, Rule -30 |
| O4c | They're afraid. They've stopped saying what they think and started saying what's safe. | Art -50, Rule -60 |

**P5 — Letter from a colleague (#3)**
"Your colleague mentions names. People who've gone quiet."

| ID | Reading | Scores |
|----|---------|--------|
| O5a | People move on. Find other work. It's not always political. | Rule +10, Art +10 |
| O5b | The list is getting longer. You've noticed. | Rule -30, Art -30 |
| O5c | A roll call of silence. Each name a question nobody asks aloud. | Rule -70, Art -60 |

**P6 — Letter from family (#4)**
"Your mother's handwriting. She asks if you're eating enough."

| ID | Reading | Scores |
|----|---------|--------|
| O6a | She worries. That's what mothers do. Love, in its simplest form. | Faith +10, Morality +10 |
| O6b | Her handwriting is getting smaller. She does not ask about the work. | Faith 0, Morality 0 |
| O6c | She's learned not to mention certain things. Even in private letters. | Faith -20, Rule -30 |

**P7 — Rejection letter (#5)**
"The rejection is polite. 'Not suited to the present climate.'"

| ID | Reading | Scores |
|----|---------|--------|
| O7a | Editors have judgment. Not everything deserves publication. | Art +20 |
| O7b | The manuscript has a coffee ring on it. At least they read it. | Art 0 |
| O7c | "Not suited to the present climate." Not wrong — just inconvenient. | Art -30, Rule -30 |

**P8 — Annotated lexicon (#6)**
"The lexicon falls open to a page covered in your annotations."

| ID | Reading | Scores |
|----|---------|--------|
| O8a | Precision matters. The right word is worth searching for. | Art +10, Meaning +10 |
| O8b | You were trying to find the right word for something. You still haven't. | Art 0, Meaning 0 |
| O8c | So many words. And the ones that matter most are the ones you're not allowed to use. | Art -40, Rule -40 |

**P9 — Half-finished sketch (#7)**
"A sketch of a building. You drew it from memory."

| ID | Reading | Scores |
|----|---------|--------|
| O9a | A record. Something preserved, even if imperfectly. | Art +10, Meaning +10 |
| O9b | The building no longer exists. The memory is already wrong. | Art -20, Meaning -20 |
| O9c | You drew what you remembered, not what was there. Memory is its own kind of authorship. | Art -20, Meaning -30 |

**P10 — Pocket watch (#8)**
"The pocket watch has stopped. 3:17."

| ID | Reading | Scores |
|----|---------|--------|
| O10a | It needs winding. A small mechanical problem, nothing more. | Meaning +10 |
| O10b | Stopped at 3:17. You can't remember what happened then, or whether anything did. | Meaning 0 |
| O10c | Time stopped and the world kept going. The watch doesn't know the difference. | Meaning -30 |

**P11 — Worn coin (#9)**
"An old coin. The face on it belongs to no current authority."

| ID | Reading | Scores |
|----|---------|--------|
| O11a | Old money. Worth its weight in metal now, nothing more. | Rule +10 |
| O11b | The face is worn smooth. Whoever it was, they've been rubbed away by use. | Rule 0, Meaning -10 |
| O11c | Authorities change. The coin remains. Something to think about. | Rule -40, Meaning -30 |

**P12 — Ink pot and nib (#10)**
"The ink is low. The nib is worn."

| ID | Reading | Scores |
|----|---------|--------|
| O12a | Tools of the trade. They'll serve for tonight. | Art +10 |
| O12b | There's enough for tonight, if you don't waste it. Every word costs. | Art 0, Meaning -10 |
| O12c | The ink is running out. So is the night. Both are finite, and you've been pretending they're not. | Art -20, Meaning -30 |

**P13 — Blank paper / manuscript (#11)**
"The blank page."

| ID | Reading | Scores |
|----|---------|--------|
| O13a | Space to fill. Work to be done. | Art +10 |
| O13b | It waits. It doesn't care what you write on it. | Art 0, Meaning -10 |
| O13c | The blankness is a dare. Or an accusation. | Art -30, Meaning -30 |

### From Shelves & Books

**P14 — Bible, Ecclesiastes (#13)**
"The Bible falls open to Ecclesiastes. 'Of making many books there is no end.'"

| ID | Reading | Scores |
|----|---------|--------|
| O14a | A comfort. Even Solomon knew the weight of too much thinking. | Faith +20, Art +10 |
| O14b | A warning, perhaps. Against vanity. Against the pride of authorship. | Faith +10, Art +10 |
| O14c | And yet you're making another one. Either foolish or defiant — maybe both. | Faith -30, Art -30 |

**P15 — Bible, Romans 13 (#13)**
"The spine is cracked at Romans 13. 'Let every soul be subject unto the higher powers.'"

| ID | Reading | Scores |
|----|---------|--------|
| O15a | The divine order. God's arrangement, not to be questioned. | Faith +80, Rule +80 |
| O15b | Someone underlined it twice. You wonder if it was for comfort or for conviction. | Faith +10, Rule +10 |
| O15c | Convenient, that God always seems to agree with whoever is in charge. | Faith -70, Rule -60 |

**P16 — Natural philosophy (#14)**
"The text describes how organisms adapt to hostile environments. Slowly, over generations."

| ID | Reading | Scores |
|----|---------|--------|
| O16a | Nature finds a way. Adaptation is strength. | Nature +20, Meaning +10 |
| O16b | Slowly. Over generations. Not overnight. Some comforts are no comfort at all. | Nature -10, Meaning -30 |
| O16c | What doesn't adapt, dies. The text is neutral about this. You are not. | Nature -20, Meaning -40 |

**P17 — Poetry collection (#15)**
"A poem about a field in summer."

| ID | Reading | Scores |
|----|---------|--------|
| O17a | Beautiful. A reminder that beauty exists, even now. | Art +10, Nature +10 |
| O17b | Completely useless. Completely beautiful. You can't decide which matters more. | Art -30, Nature -10 |
| O17c | A field in summer. A world that doesn't exist anymore. The poem preserves it like a specimen. | Art -30, Nature -20, Meaning -20 |

**P18 — Political pamphlet (#16)**
"The pamphlet argues that the current order is natural, inevitable, divinely ordained."

| ID | Reading | Scores |
|----|---------|--------|
| O18a | Persuasive. Well-argued. The logic holds, if you accept the premises. | Rule +70, Class +60, Faith +50 |
| O18b | Printed on good paper. Whoever paid for this has money to spend on certainty. | Rule -30, Class -40, Faith -20 |
| O18c | Natural. Inevitable. Divine. Three claims, each doing the work of the other two. | Rule -70, Class -60, Faith -70 |

**P19 — Botanical field guide (#17)**
"The field guide catalogues species. Precise, clinical descriptions."

| ID | Reading | Scores |
|----|---------|--------|
| O19a | Order. Classification. Everything in its place. There's comfort in taxonomy. | Nature +20 |
| O19b | Each thing simply is what it is. No symbolism. No meaning. Just fact. | Nature +10, Meaning -10 |
| O19c | Classification is a human need. The plants don't care what you call them. | Nature -30, Meaning -30 |

**P20 — Legal compendium (#18)**
"The compendium defines rights. Some no longer apply."

| ID | Reading | Scores |
|----|---------|--------|
| O20a | Laws change with circumstances. Flexibility is a sign of a functioning state. | Rule +30, Class +10 |
| O20b | It hasn't been updated. No one has bothered. The rights exist on paper and nowhere else. | Rule -40, Class -30 |
| O20c | Rights that can be revoked weren't rights. They were permissions. | Rule -80, Class -60 |

**P21 — Children's storybook (#19)**
"A storybook. The wolf is punished for asking too many questions."

| ID | Reading | Scores |
|----|---------|--------|
| O21a | A children's story. Wolves are always the villain. That's how stories work. | Rule +10, Morality +10 |
| O21b | You read it as a child. You understood the lesson: don't ask, don't tell. | Rule -30, Morality -30 |
| O21c | The wolf was right to ask. That's why they had to make him the villain. | Rule -60, Morality -60 |

**P22 — Alchemical text (#20)**
"The alchemical text promises transformation. Base metal into gold."

| ID | Reading | Scores |
|----|---------|--------|
| O22a | Charlatanism. The desire to get something for nothing. | Meaning +10, Nature +20 |
| O22b | It reads differently now. Everything reads differently now. | Meaning -10, Nature 0 |
| O22c | Transformation through fire. The alchemists understood that change requires destruction. | Meaning -40, Nature -30 |

**P23 — Hymnbook (#21)**
"The hymnbook is inscribed to you. The handwriting is unmistakable."

| ID | Reading | Scores |
|----|---------|--------|
| O23a | A gift, given in faith. The faith of the giver, at least. | Faith +20 |
| O23b | The handwriting is unmistakable. The person isn't here. The hymns remain. | Faith +10, Meaning 0 |
| O23c | They gave you songs of certainty. You wonder if they had any. | Faith -30, Meaning -20 |

### From Kitchenette

**P24 — Remains of dinner (#22)**
"Bones picked clean. A heel of bread gone hard."

| ID | Reading | Scores |
|----|---------|--------|
| O24a | A meal. Simple but sufficient. You've had worse. | Class +10 |
| O24b | The remains of dinner, such as it was. You're used to this now. | Class 0 |
| O24c | Bones picked clean. Somewhere, someone is throwing food away. | Class -40 |

**P25 — Apple, browning (#23)**
"The apple has a brown spot. It's spreading."

| ID | Reading | Scores |
|----|---------|--------|
| O25a | Cut around it. Waste nothing. Common sense. | Nature +10, Class +10 |
| O25b | Still edible, if you're careful. For now. | Nature 0, Meaning -10 |
| O25c | The rot is patient. It doesn't rush. It doesn't need to. | Nature -20, Meaning -40 |

**P26 — Whiskey bottle (#24)**
"The whiskey is a quarter full."

| ID | Reading | Scores |
|----|---------|--------|
| O26a | A quarter full. Enough to take the edge off. A small mercy. | Morality +10 |
| O26b | Enough to warm you or enough to blur your thinking. Not both. | Morality 0, Art -10 |
| O26c | You're rationing pleasure the way you ration everything else. When did that start? | Morality -20, Class -30 |

**P27 — Knife (#27)**
"The knife. Dull but clean."

| ID | Reading | Scores |
|----|---------|--------|
| O27a | A tool. It does what's needed. There's dignity in that. | Class +10 |
| O27b | You use it for everything. Bread, cheese, opening letters. One tool, many purposes. | Class 0 |
| O27c | It's a knife. It could be other things, in other hands. You put the thought aside. | Class -10, Morality -20 |

**P28 — Gas stove (#28)**
"The pilot light flickers."

| ID | Reading | Scores |
|----|---------|--------|
| O28a | The supply is unreliable. But it works. Count your blessings. | Class +10 |
| O28b | The draught, or the supply running low. Either way, not in your control. | Class -10, Nature -10 |
| O28c | The whole building runs on gas someone else controls. All your lives, tied to a flame. | Class -40, Rule -30 |

### From Bed Area

**P29 — The bed, unmade (#31)**
"The bed. Unmade."

| ID | Reading | Scores |
|----|---------|--------|
| O29a | You'll sleep later. There's work to do first. | Meaning +10 |
| O29b | The sheets have taken the shape of your absence. | Meaning -10 |
| O29c | Unmade. Like everything else you've started and haven't finished. | Meaning -30, Art -20 |

**P30 — Coat as blanket (#33)**
"The coat is too thin for this, but it's warmer than the blanket."

| ID | Reading | Scores |
|----|---------|--------|
| O30a | You make do. Everyone makes do. | Class +10 |
| O30b | You've been sleeping under it for weeks. The line between clothing and bedding has blurred. | Class -10 |
| O30c | Nothing works for its intended purpose anymore. | Class -30, Meaning -30 |

### From Bathroom

**P31 — Mirror (#35)**
"Your face in the mirror."

| ID | Reading | Scores |
|----|---------|--------|
| O31a | Tired. But still here. Still working. | Meaning +10 |
| O31b | When did you start looking like this? | Meaning -10, Morality -10 |
| O31c | You don't recognise the person you're becoming. You're not sure they'd recognise you either. | Meaning -40, Morality -30 |

**P32 — Razor (#37)**
"The razor. Sharp. Clean."

| ID | Reading | Scores |
|----|---------|--------|
| O32a | A good tool, well maintained. Discipline in small things. | Meaning +10 |
| O32b | It does its one job well. There's something admirable in that. | Meaning +10 |
| O32c | The sharpest thing in the room. You keep it clean out of respect, or habit, or something else. | Meaning -20, Morality -20 |

**P33 — Soap, nearly gone (#38)**
"The soap is a sliver."

| ID | Reading | Scores |
|----|---------|--------|
| O33a | It'll last another week if you're careful. You're always careful now. | Class +10 |
| O33b | When it's gone, you'll have to decide what to spend money on. | Class -10 |
| O33c | You're calculating the cost of cleanliness. Poverty makes you a mathematician of small things. | Class -40 |

### From Walls, Fixtures, Room

**P34 — Photograph, face-down (#40)**
"The photograph is face-down. You put it that way."

| ID | Reading | Scores |
|----|---------|--------|
| O34a | Some things are better left alone. You know what's there. | Faith +10, Morality +10 |
| O34b | You know what's on the other side without looking. That's enough. | Faith +10, Morality 0 |
| O34c | Face-down, so they can't watch you. So they can't watch what you've become. | Morality -40, Meaning -30 |

**P35 — Recruitment poster (#41)**
"The poster promises purpose, belonging, a future."

| ID | Reading | Scores |
|----|---------|--------|
| O35a | Service has its rewards. Purpose, belonging — these aren't nothing. | Rule +60, Morality +50 |
| O35b | It promises what everyone wants. It does not mention what you'd have to do. | Rule +10, Morality -10 |
| O35c | Purpose, belonging, a future. Three things the state broke and is now selling back to you. | Rule -80, Morality -60 |

**P36 — Concert programme (#42)**
"A programme from a concert. From before."

| ID | Reading | Scores |
|----|---------|--------|
| O36a | A pleasant memory. Things were different then. | Art +10, Meaning +10 |
| O36b | A different world. You kept it, though you can't say why. | Art 0, Meaning -10 |
| O36c | You kept the programme but lost the world it came from. | Art -20, Meaning -40 |

**P37 — Death certificate (#43)**
"The certificate. Official, stamped, filed."

| ID | Reading | Scores |
|----|---------|--------|
| O37a | A necessary document. The state records these things. It's how civilisation works. | Rule +30, Meaning +10 |
| O37b | A life reduced to a form. The blanks filled in. The stamp applied. | Rule -20, Meaning -30, Morality -20 |
| O37c | Stamped and filed. As if death needed the state's permission to be real. | Rule -60, Meaning -40, Morality -50 |

**P38 — Military medal (#44)**
"The medal. Heavy for its size."

| ID | Reading | Scores |
|----|---------|--------|
| O38a | Honour. Service recognised. Whatever happened, this is real. | Rule +70, Morality +60 |
| O38b | It commemorates something. Whether the something was worth commemorating — that's a different question. | Rule +10, Morality 0 |
| O38c | A small piece of metal in exchange for something that can't be given back. | Rule -60, Morality -50 |

**P39 — Key (#45)**
"The key doesn't fit anything in this room."

| ID | Reading | Scores |
|----|---------|--------|
| O39a | You kept it out of habit. It probably fits something you've forgotten about. | Meaning +10 |
| O39b | Not everything has to be useful to be worth keeping. | Meaning 0 |
| O39c | A key to somewhere you can't go, or somewhere that no longer exists. | Meaning -30, Rule -10 |

**P40 — Crack in the wall (#46)**
"The crack in the wall. Getting wider."

| ID | Reading | Scores |
|----|---------|--------|
| O40a | The building is old. Buildings settle. It's nothing. | Nature +10 |
| O40b | You've been watching it for months. It moves so slowly you can't be sure it moves at all. | Nature 0, Meaning -10 |
| O40c | Everything breaks from the inside out. Walls. Institutions. People. | Nature -30, Meaning -40 |

**P41 — Window (#47)**
"Through the window: rooftops, a church spire, smoke."

| ID | Reading | Scores |
|----|---------|--------|
| O41a | The city. Your city. Still standing. Still going. | Class +10, Meaning +10 |
| O41b | The city going on without you. It doesn't need you at the desk. | Class 0, Meaning -10 |
| O41c | Rooftops, a spire, smoke. A city held together by faith and industry, or just by habit. | Class -20, Meaning -30, Faith -20 |

**P42 — Specimen jar (#48)**
"The jar holds something preserved in cloudy liquid."

| ID | Reading | Scores |
|----|---------|--------|
| O42a | A relic of your studies. A time when you catalogued the world. | Nature +10, Meaning +10 |
| O42b | It watches you from the shelf. That's absurd, of course. It's preserved tissue. | Nature 0, Meaning -10 |
| O42c | Preserved. Suspended. Unable to decay or to grow. You know the feeling. | Nature -30, Meaning -40 |

**P43 — Map of the city (#49)**
"The map has pencil marks. Routes, places. Some crossed out."

| ID | Reading | Scores |
|----|---------|--------|
| O43a | A practical document. Routes change. You update it. That's all. | Rule +10, Class +10 |
| O43b | Some areas are crossed out now. Restricted. The city is getting smaller. | Rule -30, Class -30 |
| O43c | Your world, shrinking. Drawn in pencil so it can be erased more easily. | Rule -60, Class -50 |

**P44 — Door and latch (#50)**
"The door is latched but not locked."

| ID | Reading | Scores |
|----|---------|--------|
| O44a | No need to lock it. There's nothing here worth stealing. | Meaning +10 |
| O44b | You could leave at any time. You don't. | Meaning -10, Rule -10 |
| O44c | Latched but not locked. The prison you don't leave is the one you've built yourself. | Meaning -40, Rule -30 |

**P45 — Loose floorboard (#51)**
"The floorboard is loose."

| ID | Reading | Scores |
|----|---------|--------|
| O45a | You noticed it the first week. You've never fixed it. It's not your building. | Class +10 |
| O45b | The kind of thing you'd fix if this were home. | Class -10, Meaning -10 |
| O45c | Nothing in this room belongs to you. Not even the floor you stand on. | Class -40, Meaning -30 |

**P46 — Coat on hook (#52)**
"The coat on the hook."

| ID | Reading | Scores |
|----|---------|--------|
| O46a | Well-worn. Reliable. It's carried you through a lot. | Class +10 |
| O46b | It's seen better days. So have you. You grew into each other. | Class 0 |
| O46c | A gentleman's coat, once. Now threadbare at the elbows. Class wears thin. | Class -40 |

**P47 — Handbill (#53)**
"The handbill offers factory work. Twelve-hour shifts. Fair wages. Housing."

| ID | Reading | Scores |
|----|---------|--------|
| O47a | Honest work. Reliable income. There are worse choices. | Class +20, Morality +10 |
| O47b | A different life, available immediately. You could put down the pen. | Class 0, Art -10, Morality -10 |
| O47c | Twelve hours in a factory in exchange for the hours at the desk. They're buying the same thing: your time. | Class -30, Art -40, Morality -30 |

**P48 — Stain on ceiling (#54)**
"The stain on the ceiling."

| ID | Reading | Scores |
|----|---------|--------|
| O48a | Damp. The roof leaks. Landlord's problem, not yours. | Meaning +10 |
| O48b | It's shaped like nothing. You've spent too long looking at it. | Meaning -10 |
| O48c | You've been staring at it again. Finding meaning in stains. Is this what you do now? | Meaning -30, Art -20 |

### From Sensory Events

**P49 — Church bells (58a–c)**
"Bells. Midnight."

| ID | Reading | Scores |
|----|---------|--------|
| O49a | Midnight. The bells mark the hour. They always have. | Faith +20, Meaning +10 |
| O49b | Twelve tolls. Each one lands in the silence of the room like a stone in water. | Faith +10, Meaning -10 |
| O49c | The bells don't know what they're calling people to anymore. They ring because they always have. | Faith -30, Meaning -30 |

**P50 — Rain (55a–c)**
"Rain against the glass."

| ID | Reading | Scores |
|----|---------|--------|
| O50a | Rain. It'll pass. It always does. | Nature +10 |
| O50b | A sound that makes the room smaller and the world larger. | Nature 0, Meaning -10 |
| O50c | The rain doesn't know about the war, or the curfew, or the work. It falls on everything equally. | Nature -20, Meaning -20, Rule -10 |

**P51 — Distant artillery (61a–c)**
"A sound. Low. Distant. Sustained."

| ID | Reading | Scores |
|----|---------|--------|
| O51a | The front. Far enough away. You're safe here. | Rule +20 |
| O51b | Like thunder, except thunder doesn't have a schedule. | Rule -30, Nature -20 |
| O51c | Someone is dying at the source of that sound. You're writing about it at the other end. | Rule -60, Morality -50 |

**P52 — Gas lamp dims (60a–c)**
"The gas lamp dims."

| ID | Reading | Scores |
|----|---------|--------|
| O52a | The pressure drops at night. It'll come back. | Nature +10 |
| O52b | The shadows in the room rearrange themselves. Familiar things become strange. | Nature -10, Meaning -10 |
| O52c | Your light depends on a supply you don't control, from a source you can't see, owned by someone you'll never meet. | Nature -20, Class -30 |

**P53 — Dawn light (66a–c)**
"Light. Through the curtains."

| ID | Reading | Scores |
|----|---------|--------|
| O53a | Morning. Another day. A new beginning. | Nature +10, Meaning +10 |
| O53b | Dawn. The light doesn't care that you haven't slept. | Nature -10, Meaning -10 |
| O53c | You survived the night. That used to be a figure of speech. | Nature -20, Meaning -30 |

### From Bodily States

**P54 — Hunger (#77)**
"Your stomach."

| ID | Reading | Scores |
|----|---------|--------|
| O54a | You'll eat later. The work comes first. | Nature +10, Morality +10 |
| O54b | The body has its own arguments, and they're hard to refute. | Nature -10, Morality -10 |
| O54c | Hunger is the body's politics. It doesn't care about your ideas. It wants bread. | Nature -20, Morality -20, Class -30 |

**P55 — Eye strain (#86)**
"Your eyes ache."

| ID | Reading | Scores |
|----|---------|--------|
| O55a | Rest them for a moment. Then back to work. | Nature +10, Art +10 |
| O55b | The words on the page swim, then steady, then swim again. | Nature -10, Art -10 |
| O55c | Your body is telling you to stop. You're not listening. You never listen. | Nature -20, Art -20, Morality -20 |

**P56 — Cramped hand (#80)**
"Your hand. Cramping."

| ID | Reading | Scores |
|----|---------|--------|
| O56a | Flex it. Shake it out. The pen doesn't care about your comfort. | Nature +10, Art +10 |
| O56b | The pen has been in it for hours. The hand doesn't care about the work. | Nature -10, Art -10 |
| O56c | The body rebels against the mind. It always does, eventually. The mind never wins. | Nature -30, Art -20, Meaning -30 |

**P57 — Cold (#82)**
"You're cold."

| ID | Reading | Scores |
|----|---------|--------|
| O57a | It's winter. Of course you're cold. Everyone is cold. | Nature +10, Class +10 |
| O57b | The kind of cold that sits in your joints and reminds you the building doesn't care about you. | Nature -10, Class -10 |
| O57c | Cold is the tax you pay for not being rich enough to be warm. | Nature -10, Class -50 |

**P58 — Memory, unbidden (#84)**
"A thought surfaces. Uninvited."

| ID | Reading | Scores |
|----|---------|--------|
| O58a | Memories come and go. You let it pass. | Meaning +10, Faith +10 |
| O58b | A face, a place, a moment. Then it's gone. | Meaning -10, Faith 0 |
| O58c | You didn't invite this thought. It came anyway. Your mind is not entirely your own. | Meaning -30, Faith -20 |

### From Hidden / Nested Objects

**P59 — Note in Bible (#87)**
"Inside the Bible, a note. Not in your handwriting."

| ID | Reading | Scores |
|----|---------|--------|
| O59a | Someone left it by accident. A bookmark, nothing more. | Faith +10 |
| O59b | A verse reference and three words: "Remember who listens." A warning? An encouragement? | Faith +10, Rule -10 |
| O59c | "Remember who listens." Someone used a Bible to hide a message about surveillance. The irony is perfect. | Faith -60, Rule -50 |

**P60 — Pocket watch inscription (#88)**
"The watch's back is engraved. A date and initials."

| ID | Reading | Scores |
|----|---------|--------|
| O60a | A gift, once. The watch outlasted whatever they had. | Meaning +10, Faith +10 |
| O60b | Not your initials. You wonder whose they were, and how the watch ended up here. | Meaning -10 |
| O60c | Someone's name, reduced to initials. Someone's life, reduced to a date. Everything gets abbreviated in the end. | Meaning -30, Rule -10 |

**P61 — Photograph back (#89)**
"You turn the photograph over."

| ID | Reading | Scores |
|----|---------|--------|
| O61a | Faces you know. A happier time. You put it back face-down. | Meaning +10, Morality +10 |
| O61b | Everyone is smiling. That's the hardest part. | Meaning -20, Morality -10 |
| O61c | Faces from before. They're smiling because they don't know what's coming. None of you did. | Meaning -40, Morality -30 |

**P62 — Under the mattress (#90)**
"Under the mattress. A pamphlet."

| ID | Reading | Scores |
|----|---------|--------|
| O62a | You should get rid of it. Having it is a risk you don't need. | Rule +20, Morality +10 |
| O62b | Not the political kind. The forbidden kind. You kept it because someone asked you to. | Rule -30, Morality -20 |
| O62c | Forbidden ideas, hidden under where you sleep. You dream on top of them every night. | Rule -70, Morality -50 |

**P63 — Coat pocket (#91)**
"The coat pocket. A tram ticket."

| ID | Reading | Scores |
|----|---------|--------|
| O63a | Old. Forgotten. You should throw it away. | Meaning +10 |
| O63b | From three months ago. A destination you no longer visit. | Meaning -10, Rule -10 |
| O63c | A destination that's now off-limits. Evidence of a world that used to be larger. | Meaning -30, Rule -30 |

**P64 — Pressed flower (#92)**
"A dried flower. Pressed between pages of verse."

| ID | Reading | Scores |
|----|---------|--------|
| O64a | A keepsake. Someone wanted to preserve a moment. | Nature +10, Faith +10 |
| O64b | Still holding its colour, barely. Pressed flat. Beautiful and dead. | Nature -10, Art -10, Faith 0 |
| O64c | Preserved by crushing it. The only way to keep it was to kill it. | Nature -30, Art -30, Meaning -30 |

**P65 — Under the floorboard (#93)**
"Under the loose floorboard: a tin box. Inside: money."

| ID | Reading | Scores |
|----|---------|--------|
| O65a | Savings. Prudence. You put it aside for an emergency. | Class +10 |
| O65b | Not much. But enough to leave, if it came to that. | Class -20, Rule -20, Meaning -20 |
| O65c | Escape money. You hid it, which means you've already decided something you haven't admitted yet. | Class -40, Rule -40, Meaning -50 |

**P66 — Specimen jar label (#95)**
"The label on the jar. Latin. Your handwriting."

| ID | Reading | Scores |
|----|---------|--------|
| O66a | Your studies. Classification, taxonomy. The orderly world of science. | Nature +20, Art +10 |
| O66b | From when you still believed in classification. That seems like a long time ago. | Nature -30, Meaning -30, Art -10 |
| O66c | You gave it a Latin name, as if naming something gives you power over it. It doesn't. | Nature -50, Meaning -40 |

**P67 — Windowsill scratches (#97)**
"Scratches on the windowsill. A tally."

| ID | Reading | Scores |
|----|---------|--------|
| O67a | Previous tenant's marks. People count things. Days, meals, whatever. | Meaning +10 |
| O67b | Five marks, then a gap, then three. Someone was counting days. Then they stopped. | Meaning -30, Rule -20 |
| O67c | Someone was counting. They stopped at eight. Did they leave, or did they stop counting? | Meaning -50, Rule -40 |

---

## Inklings (Level 2)

Developed from Observations (dwelling on one thought) or produced by early combinations (two thoughts colliding). Inklings are vaguer than ideas but more directed than observations — the Writer senses a connection without being able to articulate it yet.

Scores typically intensify from the parent observation(s). Development deepens; combination can shift direction.

**Path key:** `dev` = dwelling on a single observation. `combo` = combining two observations.

### Rule Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I1 | Language shapes what can be thought. Control the words and you control the thinking. | O1c or O8c | dev | Rule -50, Art -40 |
| I2 | Rights written in law are only as strong as the will to enforce them. | O20b or O20c | dev | Rule -50, Class -40 |
| I3 | The people who stop writing don't disappear. They just become quieter, until quiet is all they are. | O5b or O5c | dev | Rule -50, Art -50 |
| I4 | Self-censorship is the regime's greatest achievement. It costs them nothing and silences more than any law. | O4b or O4c | dev | Rule -60, Art -50 |
| I5 | Order requires sacrifice. The restrictions are the price of a functioning state. Everyone pays something. | O1a or O20a | dev | Rule +40, Morality +30 |

### Faith Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I6 | Scripture bends to serve whoever holds it. The text doesn't change; the reader does. | O15c | dev | Faith -60, Rule -50 |
| I7 | The bells ring for an empty church. Ritual outlives the faith that built it. | O49c | dev | Faith -40, Meaning -30 |
| I8 | Faith is not certainty. It is continuing when certainty is gone. | O23b or O34a | dev | Faith +20, Meaning +10 |
| I9 | The church has stood for centuries. The bells still ring. There is wisdom in what endures. | O49a or O14a | dev | Faith +40, Meaning +20 |

### Meaning Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I10 | You could leave. The door is open. The money is there. The fact that you stay is either commitment or cowardice. | O44b/c or O65b/c | dev | Meaning -40, Rule -20 |
| I11 | Memory edits itself. What you remember is not what happened — it's what you can bear to keep. | O9b/c or O58b/c | dev | Meaning -30, Art -20 |
| I12 | You keep things that no longer serve you. The key. The programme. The faith. Letting go requires knowing what you are without them. | O39c or O36b/c | dev | Meaning -40, Faith -20 |
| I13 | The crack grows. Everything that holds together is in the process of coming apart. | O40c | dev | Nature -40, Meaning -50 |

### Class Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I14 | Poverty is not a condition. It's a system of choices someone else made. | O3c or O33c or O57c | dev | Class -50 |
| I15 | There is dignity in smallness. The soap, the bread, the careful use of ink. To attend to small things is not poverty of spirit. | O33a + O12b | combo | Class +20, Meaning +20, Morality +10 |

### Art Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I16 | Beauty serves no purpose. That may be why it matters. | O17b | dev | Art -40, Nature -10 |
| I17 | The blank page is not potential. It is demand. It asks: what are you willing to say? | O13c | dev | Art -40, Meaning -30 |
| I18 | The work is all that matters tonight. Everything else — the cold, the hunger, the fear — is noise. | O29a + O55a | combo | Art +30, Meaning +20 |
| I19 | Art that serves the community is not diminished by its service. The cathedral was built to order. It is still beautiful. | O17a or O7a | dev | Art +40, Faith +20 |

### Nature Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I20 | The body doesn't negotiate. Hunger, cold, exhaustion — these are facts, not arguments. | O54b/c or O56b/c or O57b/c | dev | Nature -20, Meaning -30 |
| I21 | Classification is not understanding. It is the illusion of understanding, filed in alphabetical order. | O19c or O66b/c | dev | Nature -40, Meaning -40 |
| I22 | The natural world adapts. The strong survive. This is not cruelty — it is the mechanism by which everything improves. | O16a or O22a | dev | Nature +40, Class +20 |

### Morality Inklings

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I23 | A medal is the state's receipt. It acknowledges the transaction, not the cost. | O38c | dev | Rule -50, Morality -40 |
| I24 | Obedience and virtue are not the same thing. The state has spent centuries conflating them. | O21b/c or O35b/c | dev | Rule -60, Morality -60 |
| I25 | Duty is the structure that holds a person together when everything else falls apart. | O29a or O54a | dev | Morality +40, Meaning +30 |

### Cross-Concept Inklings (Combinations)

| ID | Text | Source(s) | Path | Scores |
|----|------|-----------|------|--------|
| I26 | The gazette restricts assembly. The hymnbook gathers voices in song. One is legal. Both are about control. | O1b/c + O23a/b | combo | Rule -40, Faith -30 |
| I27 | The pamphlet calls hierarchy divine. The dinner bones say otherwise. God's order has a class system, and you know which end you're on. | O18a/b/c + O24c | combo | Faith -50, Class -50, Rule -40 |
| I28 | The field guide names things without meaning. The poem means things without naming. Which is closer to truth? | O19b + O17b/c | combo | Art -30, Nature -20, Meaning -40 |
| I29 | Your hand cramps. The ink runs low. The body and the tools conspire against the work. Perhaps the work is the problem. | O56b/c + O12b/c | combo | Art -30, Nature -20, Meaning -30 |
| I30 | The photograph is face-down. The medal is face-up. You display what the state honours and hide what you loved. | O34c + O38a/b | combo | Morality -40, Rule -30, Meaning -30 |
| I31 | Someone scratched days into the windowsill. You're scratching ideas into paper. Both of you are counting down to something. | O67b/c + O13b/c | combo | Meaning -40, Rule -20 |
| I32 | Rain falls on the restricted areas too. Nature doesn't read maps. | O50c + O43b/c | combo | Nature -30, Rule -30 |
| I33 | The alchemist promised transformation through fire. The state promises transformation through obedience. Both are selling the same lie. | O22c + O35a/b | combo | Meaning -50, Rule -50 |
| I34 | The landlord raises the rent. The state raises the stakes. Up and up. You're the only thing that doesn't rise. | O3b/c + O43b/c | combo | Class -50, Rule -40 |
| I35 | The razor is sharp. The pen is dull. Both leave marks. One is faster. | O32c + O12b/c | combo | Art -20, Morality -30, Meaning -30 |
| I36 | The storybook wolf and the forbidden pamphlet. Asking questions has always been punished. The punishment just got more sophisticated. | O21b/c + O62b/c | combo | Rule -60, Morality -50 |
| I37 | The apple rots. The soap dwindles. The crack widens. Everything in this room is a clock, counting down differently. | O25c + O40b/c | combo | Nature -30, Meaning -50 |
| I38 | The natural order is what the powerful call the order they built. | O18b/c + O16b/c | combo | Rule -50, Nature -40, Class -40 |
| I39 | Preserved by crushing. The flower, the specimen, the faith. The things you keep alive by stopping them from growing. | O64c + O42c | combo | Nature -40, Faith -30, Meaning -40 |
| I40 | You were given a mind that questions. Perhaps that is the point — not the answers, but the asking. | O14c + O8b | combo | Faith -20, Meaning -30, Art -20 |

## Ideas (Level 3)

The threshold for writing. Developed from Inklings, or produced by combination.

| ID | Text | Source | Scores |
|----|------|--------|--------|
| | | | |

## Concepts (Level 4)

| ID | Text | Source | Scores |
|----|------|--------|--------|
| | | | |

## Arguments (Level 5)

| ID | Text | Source | Scores |
|----|------|--------|--------|
| | | | |

## Theses (Level 6)

The destinations. Many possible. Key ones should be hand-authored even during placeholder phase.

| ID | Text | Source | Scores |
|----|------|--------|--------|
| | | | |

---

## Notes

- The space EXPANDS at higher levels. More theses are possible than observations, because combination and development branch.
- Not every idea has a fixed level. Some are inherently shallow (Observations stay Observations). Most can be developed upward. Some are inherently deep (a Thesis-level conclusion that can only be reached by a specific path).
- Generated placeholder text should follow the pattern: "[Score range] [level-appropriate framing] about [concept list]". Good enough to test mechanics, replaceable later.
- An idea's ID should encode its level and a sequential number, e.g. O12a (Observation 12, reading a), I7 (Inkling 7), TH3 (Thesis 3).
- Observations are the player's FIRST philosophical choice. The prompt is neutral. The reading is the interpretation.
- When ideas combine or develop, their scores combine: averaged, weighted, or overridden by the recipe. This is defined in Recipes.md.
- The Writer's final work is evaluated by aggregating the scores of all ideas written into it. The committee responds to the overall position.
- Meaning is the most-tagged concept, intentionally. Nearly everything in this room provokes questions of meaning. That's the Writer's condition.
