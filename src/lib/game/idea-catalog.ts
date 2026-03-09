/**
 * Static catalog of all authored ideas and observation prompts.
 *
 * Data sourced from design/Ideas.md.
 * Registers into the idea system on import.
 */

import { registerIdea, registerPrompt, type IdeaDef, type PromptDef } from './ideas.svelte';

// ---------------------------------------------------------------------------
// Observations (Level 1)
// ---------------------------------------------------------------------------

const observations: IdeaDef[] = [
	// --- Work Area ---

	// P1 — Government gazette (#1)
	{ id: 'O1a', text: 'Measured. Precise. Final. The language of people who know what they\'re doing.', level: 1, concepts: { Rule: 70 }, source: [] },
	{ id: 'O1b', text: 'More restrictions. You skim the details. This is just how things are now.', level: 1, concepts: { Rule: 10 }, source: [] },
	{ id: 'O1c', text: 'Clinical. Cold. The language of people who\'ve stopped seeing faces.', level: 1, concepts: { Rule: -40 }, source: [] },

	// P2 — Government gazette (#1)
	{ id: 'O2a', text: 'The best rise. Competence rewarded, as it should be.', level: 1, concepts: { Rule: 60, Class: 60 }, source: [] },
	{ id: 'O2b', text: 'The same families, the same schools. It\'s always been this way.', level: 1, concepts: { Rule: 10, Class: 10 }, source: [] },
	{ id: 'O2c', text: 'A closed circle calling itself a meritocracy.', level: 1, concepts: { Rule: -40, Class: -50 }, source: [] },

	// P3 — Rent demand (#2)
	{ id: 'O3a', text: 'Costs rise. Everyone adjusts. You\'ll manage.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O3b', text: 'The landlord\'s hand is steady — he\'s done this before. You wonder if he thinks about who lives here.', level: 1, concepts: { Class: -30 }, source: [] },
	{ id: 'O3c', text: 'You could work for a year and he\'d still own the building. The arithmetic of ownership never changes.', level: 1, concepts: { Class: -70 }, source: [] },

	// P4 — Letter from a colleague (#3)
	{ id: 'O4a', text: 'Caution is wisdom. Your colleague is being sensible.', level: 1, concepts: { Truth: 20, Rule: 20 }, source: [] },
	{ id: 'O4b', text: 'Between the lines, a warning: be careful what you publish.', level: 1, concepts: { Truth: -20, Rule: -30 }, source: [] },
	{ id: 'O4c', text: 'They\'re afraid. They\'ve stopped saying what they think and started saying what\'s safe.', level: 1, concepts: { Truth: -50, Rule: -60 }, source: [] },

	// P5 — Letter from a colleague (#3)
	{ id: 'O5a', text: 'People move on. Find other work. It\'s not always political.', level: 1, concepts: { Rule: 10, Truth: 10 }, source: [] },
	{ id: 'O5b', text: 'The list is getting longer. You\'ve noticed.', level: 1, concepts: { Rule: -30, Truth: -30 }, source: [] },
	{ id: 'O5c', text: 'A roll call of silence. Each name a question nobody asks aloud.', level: 1, concepts: { Rule: -70, Truth: -60 }, source: [] },

	// P6 — Letter from family (#4)
	{ id: 'O6a', text: 'She worries. That\'s what mothers do. Love, in its simplest form.', level: 1, concepts: { Faith: 10, Morality: 10 }, source: [] },
	{ id: 'O6b', text: 'Her handwriting is getting smaller. She does not ask about the work.', level: 1, concepts: { Faith: 0, Morality: 0 }, source: [] },
	{ id: 'O6c', text: 'She\'s learned not to mention certain things. Even in private letters.', level: 1, concepts: { Faith: -20, Rule: -30 }, source: [] },

	// P7 — Rejection letter (#5)
	{ id: 'O7a', text: 'Editors have judgment. Not everything deserves publication.', level: 1, concepts: { Truth: 20 }, source: [] },
	{ id: 'O7b', text: 'The manuscript has a coffee ring on it. At least they read it.', level: 1, concepts: { Truth: 0 }, source: [] },
	{ id: 'O7c', text: '"Not suited to the present climate." Not wrong — just inconvenient.', level: 1, concepts: { Truth: -30, Rule: -30 }, source: [] },

	// P8 — Annotated lexicon (#6)
	{ id: 'O8a', text: 'Precision matters. The right word is worth searching for.', level: 1, concepts: { Art: 10, Truth: 10 }, source: [] },
	{ id: 'O8b', text: 'You were trying to find the right word for something. You still haven\'t.', level: 1, concepts: { Art: 0, Truth: 0 }, source: [] },
	{ id: 'O8c', text: 'So many words. And the ones that matter most are the ones you\'re not allowed to use.', level: 1, concepts: { Truth: -40, Rule: -40 }, source: [] },

	// P9 — Half-finished sketch (#7)
	{ id: 'O9a', text: 'A record. Something preserved, even if imperfectly.', level: 1, concepts: { Art: 10 }, source: [] },
	{ id: 'O9b', text: 'The building no longer exists. The memory is already wrong.', level: 1, concepts: { Art: -20 }, dread: 'Existential', source: [] },
	{ id: 'O9c', text: 'You drew what you remembered, not what was there. Memory is its own kind of authorship.', level: 1, concepts: { Art: -30 }, source: [] },

	// P10 — Pocket watch (#8)
	{ id: 'O10a', text: 'It needs winding. A small mechanical problem, nothing more.', level: 1, concepts: {}, source: [] },
	{ id: 'O10b', text: 'Stopped at 3:17. You can\'t remember what happened then, or whether anything did.', level: 1, concepts: {}, source: [] },
	{ id: 'O10c', text: 'Time stopped and the world kept going. The watch doesn\'t know the difference.', level: 1, concepts: {}, dread: 'Existential', source: [] },

	// P11 — Worn coin (#9)
	{ id: 'O11a', text: 'Old money. Worth its weight in metal now, nothing more.', level: 1, concepts: { Rule: 10 }, source: [] },
	{ id: 'O11b', text: 'The face is worn smooth. Whoever it was, they\'ve been rubbed away by use.', level: 1, concepts: { Rule: 0 }, source: [] },
	{ id: 'O11c', text: 'Authorities change. The coin remains. Something to think about.', level: 1, concepts: { Rule: -40 }, source: [] },

	// P12 — Ink pot and nib (#10)
	{ id: 'O12a', text: 'Tools of the trade. They\'ll serve for tonight.', level: 1, concepts: { Art: 10 }, source: [] },
	{ id: 'O12b', text: 'There\'s enough for tonight, if you don\'t waste it. Every word costs.', level: 1, concepts: { Art: 0 }, dread: 'Academic', source: [] },
	{ id: 'O12c', text: 'The ink is running out. So is the night. Both are finite, and you\'ve been pretending they\'re not.', level: 1, concepts: { Art: -20 }, dread: 'Existential', source: [] },

	// P13 — Blank paper / manuscript (#11)
	{ id: 'O13a', text: 'Space to fill. Work to be done.', level: 1, concepts: { Art: 10 }, source: [] },
	{ id: 'O13b', text: 'It waits. It doesn\'t care what you write on it.', level: 1, concepts: { Art: 0 }, dread: 'Academic', source: [] },
	{ id: 'O13c', text: 'The blankness is a dare. Or an accusation.', level: 1, concepts: { Art: -30 }, dread: 'Academic', source: [] },

	// --- Shelves & Books ---

	// P14 — Bible, Ecclesiastes (#13)
	{ id: 'O14a', text: 'A comfort. Even Solomon knew the weight of too much thinking.', level: 1, concepts: { Faith: 20, Art: 10 }, source: [] },
	{ id: 'O14b', text: 'A warning, perhaps. Against vanity. Against the pride of authorship.', level: 1, concepts: { Faith: 10, Art: 10 }, source: [] },
	{ id: 'O14c', text: 'And yet you\'re making another one. Either foolish or defiant — maybe both.', level: 1, concepts: { Faith: -30, Art: -30 }, source: [] },

	// P15 — Bible, Romans 13 (#13)
	{ id: 'O15a', text: 'The divine order. God\'s arrangement, not to be questioned.', level: 1, concepts: { Faith: 80, Rule: 80 }, source: [] },
	{ id: 'O15b', text: 'Someone underlined it twice. You wonder if it was for comfort or for conviction.', level: 1, concepts: { Faith: 10, Rule: 10 }, source: [] },
	{ id: 'O15c', text: 'Convenient, that God always seems to agree with whoever is in charge.', level: 1, concepts: { Faith: -70, Rule: -60 }, source: [] },

	// P16 — Natural philosophy (#14)
	{ id: 'O16a', text: 'Nature finds a way. Adaptation is strength.', level: 1, concepts: { Nature: 20 }, source: [] },
	{ id: 'O16b', text: 'Slowly. Over generations. Not overnight. Some comforts are no comfort at all.', level: 1, concepts: { Nature: -10 }, dread: 'Existential', source: [] },
	{ id: 'O16c', text: 'What doesn\'t adapt, dies. The text is neutral about this. You are not.', level: 1, concepts: { Nature: -20 }, dread: 'Existential', source: [] },

	// P17 — Poetry collection (#15)
	{ id: 'O17a', text: 'Beautiful. A reminder that beauty exists, even now.', level: 1, concepts: { Art: 10, Nature: 10 }, source: [] },
	{ id: 'O17b', text: 'Completely useless. Completely beautiful. You can\'t decide which matters more.', level: 1, concepts: { Art: -30, Nature: -10 }, source: [] },
	{ id: 'O17c', text: 'A field in summer. A world that doesn\'t exist anymore. The poem preserves it like a specimen.', level: 1, concepts: { Art: -30, Nature: -20 }, source: [] },

	// P18 — Political pamphlet (#16)
	{ id: 'O18a', text: 'Persuasive. Well-argued. The logic holds, if you accept the premises.', level: 1, concepts: { Rule: 70, Class: 60, Faith: 50 }, source: [] },
	{ id: 'O18b', text: 'Printed on good paper. Whoever paid for this has money to spend on certainty.', level: 1, concepts: { Rule: -30, Class: -40, Faith: -20 }, source: [] },
	{ id: 'O18c', text: 'Natural. Inevitable. Divine. Three claims, each doing the work of the other two.', level: 1, concepts: { Rule: -70, Class: -60, Faith: -70 }, source: [] },

	// P19 — Botanical field guide (#17)
	{ id: 'O19a', text: 'Order. Classification. Everything in its place. There\'s comfort in taxonomy.', level: 1, concepts: { Nature: 20 }, source: [] },
	{ id: 'O19b', text: 'Each thing simply is what it is. No symbolism. No meaning. Just fact.', level: 1, concepts: { Nature: 10, Truth: -10 }, source: [] },
	{ id: 'O19c', text: 'Classification is a human need. The plants don\'t care what you call them.', level: 1, concepts: { Nature: -30, Truth: -30 }, source: [] },

	// P20 — Legal compendium (#18)
	{ id: 'O20a', text: 'Laws change with circumstances. Flexibility is a sign of a functioning state.', level: 1, concepts: { Rule: 30, Class: 10 }, source: [] },
	{ id: 'O20b', text: 'It hasn\'t been updated. No one has bothered. The rights exist on paper and nowhere else.', level: 1, concepts: { Rule: -40, Class: -30 }, source: [] },
	{ id: 'O20c', text: 'Rights that can be revoked weren\'t rights. They were permissions.', level: 1, concepts: { Rule: -80, Class: -60 }, source: [] },

	// P21 — Children's storybook (#19)
	{ id: 'O21a', text: 'A children\'s story. Wolves are always the villain. That\'s how stories work.', level: 1, concepts: { Rule: 10, Morality: 10 }, source: [] },
	{ id: 'O21b', text: 'You read it as a child. You understood the lesson: don\'t ask, don\'t tell.', level: 1, concepts: { Rule: -30, Morality: -30 }, source: [] },
	{ id: 'O21c', text: 'The wolf was right to ask. That\'s why they had to make him the villain.', level: 1, concepts: { Rule: -60, Morality: -60 }, source: [] },

	// P22 — Alchemical text (#20)
	{ id: 'O22a', text: 'Charlatanism. The desire to get something for nothing.', level: 1, concepts: { Nature: 20 }, source: [] },
	{ id: 'O22b', text: 'It reads differently now. Everything reads differently now.', level: 1, concepts: { Nature: 0 }, dread: 'Existential', source: [] },
	{ id: 'O22c', text: 'Transformation through fire. The alchemists understood that change requires destruction.', level: 1, concepts: { Nature: -30 }, dread: 'Existential', source: [] },

	// P23 — Hymnbook (#21)
	{ id: 'O23a', text: 'A gift, given in faith. The faith of the giver, at least.', level: 1, concepts: { Faith: 20 }, source: [] },
	{ id: 'O23b', text: 'The handwriting is unmistakable. The person isn\'t here. The hymns remain.', level: 1, concepts: { Faith: 10 }, source: [] },
	{ id: 'O23c', text: 'They gave you songs of certainty. You wonder if they had any.', level: 1, concepts: { Faith: -30 }, source: [] },

	// --- Kitchenette ---

	// P24 — Remains of dinner (#22)
	{ id: 'O24a', text: 'A meal. Simple but sufficient. You\'ve had worse.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O24b', text: 'The remains of dinner, such as it was. You\'re used to this now.', level: 1, concepts: { Class: 0 }, source: [] },
	{ id: 'O24c', text: 'Bones picked clean. Somewhere, someone is throwing food away.', level: 1, concepts: { Class: -40 }, source: [] },

	// P25 — Apple, browning (#23)
	{ id: 'O25a', text: 'Cut around it. Waste nothing. Common sense.', level: 1, concepts: { Nature: 10, Class: 10 }, source: [] },
	{ id: 'O25b', text: 'Still edible, if you\'re careful. For now.', level: 1, concepts: { Nature: 0 }, dread: 'Existential', source: [] },
	{ id: 'O25c', text: 'The rot is patient. It doesn\'t rush. It doesn\'t need to.', level: 1, concepts: { Nature: -20 }, dread: 'Existential', source: [] },

	// P26 — Whiskey bottle (#24)
	{ id: 'O26a', text: 'A quarter full. Enough to take the edge off. A small mercy.', level: 1, concepts: { Morality: 10 }, source: [] },
	{ id: 'O26b', text: 'Enough to warm you or enough to blur your thinking. Not both.', level: 1, concepts: { Morality: 0 }, dread: 'Academic', source: [] },
	{ id: 'O26c', text: 'You\'re rationing pleasure the way you ration everything else. When did that start?', level: 1, concepts: { Morality: -20, Class: -30 }, source: [] },

	// P27 — Knife (#27)
	{ id: 'O27a', text: 'A tool. It does what\'s needed. There\'s dignity in that.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O27b', text: 'You use it for everything. Bread, cheese, opening letters. One tool, many purposes.', level: 1, concepts: { Class: 0 }, source: [] },
	{ id: 'O27c', text: 'It\'s a knife. It could be other things, in other hands. You put the thought aside.', level: 1, concepts: { Class: -10, Morality: -20 }, source: [] },

	// P28 — Gas stove (#28)
	{ id: 'O28a', text: 'The supply is unreliable. But it works. Count your blessings.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O28b', text: 'The draught, or the supply running low. Either way, not in your control.', level: 1, concepts: { Class: -10, Nature: -10 }, source: [] },
	{ id: 'O28c', text: 'The whole building runs on gas someone else controls. All your lives, tied to a flame.', level: 1, concepts: { Class: -40, Rule: -30 }, source: [] },

	// --- Bed Area ---

	// P29 — The bed, unmade (#31)
	{ id: 'O29a', text: 'You\'ll sleep later. There\'s work to do first.', level: 1, concepts: { Truth: 10 }, source: [] },
	{ id: 'O29b', text: 'The sheets have taken the shape of your absence.', level: 1, concepts: {}, dread: 'Existential', source: [] },
	{ id: 'O29c', text: 'Unmade. Like everything else you\'ve started and haven\'t finished.', level: 1, concepts: { Art: -20 }, dread: 'Academic', source: [] },

	// P30 — Coat as blanket (#33)
	{ id: 'O30a', text: 'You make do. Everyone makes do.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O30b', text: 'You\'ve been sleeping under it for weeks. The line between clothing and bedding has blurred.', level: 1, concepts: { Class: -10 }, source: [] },
	{ id: 'O30c', text: 'Nothing works for its intended purpose anymore.', level: 1, concepts: { Class: -30 }, dread: 'Existential', source: [] },

	// --- Bathroom ---

	// P31 — Mirror (#35)
	{ id: 'O31a', text: 'Tired. But still here. Still working.', level: 1, concepts: { Morality: 10 }, source: [] },
	{ id: 'O31b', text: 'When did you start looking like this?', level: 1, concepts: { Morality: -10 }, dread: 'Existential', source: [] },
	{ id: 'O31c', text: 'You don\'t recognise the person you\'re becoming. You\'re not sure they\'d recognise you either.', level: 1, concepts: { Morality: -30 }, dread: 'Existential', source: [] },

	// P32 — Razor (#37)
	{ id: 'O32a', text: 'A good tool, well maintained. Discipline in small things.', level: 1, concepts: { Morality: 10 }, source: [] },
	{ id: 'O32b', text: 'It does its one job well. There\'s something admirable in that.', level: 1, concepts: { Art: 10 }, source: [] },
	{ id: 'O32c', text: 'The sharpest thing in the room. You keep it clean out of respect, or habit, or something else.', level: 1, concepts: { Morality: -20 }, dread: 'Existential', source: [] },

	// P33 — Soap, nearly gone (#38)
	{ id: 'O33a', text: 'It\'ll last another week if you\'re careful. You\'re always careful now.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O33b', text: 'When it\'s gone, you\'ll have to decide what to spend money on.', level: 1, concepts: { Class: -10 }, source: [] },
	{ id: 'O33c', text: 'You\'re calculating the cost of cleanliness. Poverty makes you a mathematician of small things.', level: 1, concepts: { Class: -40 }, source: [] },

	// --- Walls, Fixtures, Room ---

	// P34 — Photograph, face-down (#40)
	{ id: 'O34a', text: 'Some things are better left alone. You know what\'s there.', level: 1, concepts: { Faith: 10, Morality: 10 }, source: [] },
	{ id: 'O34b', text: 'You know what\'s on the other side without looking. That\'s enough.', level: 1, concepts: { Faith: 10, Morality: 0 }, source: [] },
	{ id: 'O34c', text: 'Face-down, so they can\'t watch you. So they can\'t watch what you\'ve become.', level: 1, concepts: { Morality: -40 }, dread: 'Existential', source: [] },

	// P35 — Recruitment poster (#41)
	{ id: 'O35a', text: 'Service has its rewards. Purpose, belonging — these aren\'t nothing.', level: 1, concepts: { Rule: 60, Morality: 50 }, source: [] },
	{ id: 'O35b', text: 'It promises what everyone wants. It does not mention what you\'d have to do.', level: 1, concepts: { Rule: 10, Morality: -10 }, source: [] },
	{ id: 'O35c', text: 'Purpose, belonging, a future. Three things the state broke and is now selling back to you.', level: 1, concepts: { Rule: -80, Morality: -60 }, source: [] },

	// P36 — Concert programme (#42)
	{ id: 'O36a', text: 'A pleasant memory. Things were different then.', level: 1, concepts: { Art: 10 }, source: [] },
	{ id: 'O36b', text: 'A different world. You kept it, though you can\'t say why.', level: 1, concepts: { Art: 0 }, dread: 'Existential', source: [] },
	{ id: 'O36c', text: 'You kept the programme but lost the world it came from.', level: 1, concepts: { Art: -20 }, dread: 'Existential', source: [] },

	// P37 — Death certificate (#43)
	{ id: 'O37a', text: 'A necessary document. The state records these things. It\'s how civilisation works.', level: 1, concepts: { Rule: 30 }, source: [] },
	{ id: 'O37b', text: 'A life reduced to a form. The blanks filled in. The stamp applied.', level: 1, concepts: { Rule: -20, Morality: -20 }, dread: 'Existential', source: [] },
	{ id: 'O37c', text: 'Stamped and filed. As if death needed the state\'s permission to be real.', level: 1, concepts: { Rule: -60, Morality: -50 }, dread: 'Existential', source: [] },

	// P38 — Military medal (#44)
	{ id: 'O38a', text: 'Honour. Service recognised. Whatever happened, this is real.', level: 1, concepts: { Rule: 70, Morality: 60 }, source: [] },
	{ id: 'O38b', text: 'It commemorates something. Whether the something was worth commemorating — that\'s a different question.', level: 1, concepts: { Rule: 10, Morality: 0 }, source: [] },
	{ id: 'O38c', text: 'A small piece of metal in exchange for something that can\'t be given back.', level: 1, concepts: { Rule: -60, Morality: -50 }, source: [] },

	// P39 — Key (#45)
	{ id: 'O39a', text: 'You kept it out of habit. It probably fits something you\'ve forgotten about.', level: 1, concepts: {}, source: [] },
	{ id: 'O39b', text: 'Not everything has to be useful to be worth keeping.', level: 1, concepts: {}, source: [] },
	{ id: 'O39c', text: 'A key to somewhere you can\'t go, or somewhere that no longer exists.', level: 1, concepts: { Rule: -10 }, dread: 'Existential', source: [] },

	// P40 — Crack in the wall (#46)
	{ id: 'O40a', text: 'The building is old. Buildings settle. It\'s nothing.', level: 1, concepts: { Nature: 10 }, source: [] },
	{ id: 'O40b', text: 'You\'ve been watching it for months. It moves so slowly you can\'t be sure it moves at all.', level: 1, concepts: { Nature: 0 }, dread: 'Existential', source: [] },
	{ id: 'O40c', text: 'Everything breaks from the inside out. Walls. Institutions. People.', level: 1, concepts: { Nature: -30 }, dread: 'Existential', source: [] },

	// P41 — Window (#47)
	{ id: 'O41a', text: 'The city. Your city. Still standing. Still going.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O41b', text: 'The city going on without you. It doesn\'t need you at the desk.', level: 1, concepts: { Class: 0 }, dread: 'Existential', source: [] },
	{ id: 'O41c', text: 'Rooftops, a spire, smoke. A city held together by faith and industry, or just by habit.', level: 1, concepts: { Class: -20, Faith: -20 }, dread: 'Existential', source: [] },

	// P42 — Specimen jar (#48)
	{ id: 'O42a', text: 'A relic of your studies. A time when you catalogued the world.', level: 1, concepts: { Nature: 10, Truth: 10 }, source: [] },
	{ id: 'O42b', text: 'It watches you from the shelf. That\'s absurd, of course. It\'s preserved tissue.', level: 1, concepts: { Nature: 0 }, dread: 'Existential', source: [] },
	{ id: 'O42c', text: 'Preserved. Suspended. Unable to decay or to grow. You know the feeling.', level: 1, concepts: { Nature: -30 }, dread: 'Existential', source: [] },

	// P43 — Map of the city (#49)
	{ id: 'O43a', text: 'A practical document. Routes change. You update it. That\'s all.', level: 1, concepts: { Rule: 10, Class: 10 }, source: [] },
	{ id: 'O43b', text: 'Some areas are crossed out now. Restricted. The city is getting smaller.', level: 1, concepts: { Rule: -30, Class: -30 }, source: [] },
	{ id: 'O43c', text: 'Your world, shrinking. Drawn in pencil so it can be erased more easily.', level: 1, concepts: { Rule: -60, Class: -50 }, source: [] },

	// P44 — Door and latch (#50)
	{ id: 'O44a', text: 'No need to lock it. There\'s nothing here worth stealing.', level: 1, concepts: {}, source: [] },
	{ id: 'O44b', text: 'You could leave at any time. You don\'t.', level: 1, concepts: { Rule: -10 }, dread: 'Existential', source: [] },
	{ id: 'O44c', text: 'Latched but not locked. The prison you don\'t leave is the one you\'ve built yourself.', level: 1, concepts: { Rule: -30 }, dread: 'Existential', source: [] },

	// P45 — Loose floorboard (#51)
	{ id: 'O45a', text: 'You noticed it the first week. You\'ve never fixed it. It\'s not your building.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O45b', text: 'The kind of thing you\'d fix if this were home.', level: 1, concepts: { Class: -10 }, dread: 'Economic', source: [] },
	{ id: 'O45c', text: 'Nothing in this room belongs to you. Not even the floor you stand on.', level: 1, concepts: { Class: -40 }, dread: 'Economic', source: [] },

	// P46 — Coat on hook (#52)
	{ id: 'O46a', text: 'Well-worn. Reliable. It\'s carried you through a lot.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O46b', text: 'It\'s seen better days. So have you. You grew into each other.', level: 1, concepts: { Class: 0 }, source: [] },
	{ id: 'O46c', text: 'A gentleman\'s coat, once. Now threadbare at the elbows. Class wears thin.', level: 1, concepts: { Class: -40 }, source: [] },

	// P47 — Handbill (#53)
	{ id: 'O47a', text: 'Honest work. Reliable income. There are worse choices.', level: 1, concepts: { Class: 20, Morality: 10 }, source: [] },
	{ id: 'O47b', text: 'A different life, available immediately. You could put down the pen.', level: 1, concepts: { Class: 0, Morality: -10 }, dread: 'Academic', source: [] },
	{ id: 'O47c', text: 'Twelve hours in a factory in exchange for the hours at the desk. They\'re buying the same thing: your time.', level: 1, concepts: { Class: -30, Art: -40, Morality: -30 }, source: [] },

	// P48 — Stain on ceiling (#54)
	{ id: 'O48a', text: 'Damp. The roof leaks. Landlord\'s problem, not yours.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O48b', text: 'It\'s shaped like nothing. You\'ve spent too long looking at it.', level: 1, concepts: {}, dread: 'Existential', source: [] },
	{ id: 'O48c', text: 'You\'ve been staring at it again. Finding meaning in stains. Is this what you do now?', level: 1, concepts: { Art: -20 }, dread: 'Existential', source: [] },

	// --- Sensory Events ---

	// P49 — Church bells (58a–c)
	{ id: 'O49a', text: 'Midnight. The bells mark the hour. They always have.', level: 1, concepts: { Faith: 20 }, source: [] },
	{ id: 'O49b', text: 'Twelve tolls. Each one lands in the silence of the room like a stone in water.', level: 1, concepts: { Faith: 10 }, dread: 'Existential', source: [] },
	{ id: 'O49c', text: 'The bells don\'t know what they\'re calling people to anymore. They ring because they always have.', level: 1, concepts: { Faith: -30 }, dread: 'Existential', source: [] },

	// P50 — Rain (55a–c)
	{ id: 'O50a', text: 'Rain. It\'ll pass. It always does.', level: 1, concepts: { Nature: 10 }, source: [] },
	{ id: 'O50b', text: 'A sound that makes the room smaller and the world larger.', level: 1, concepts: { Nature: 0 }, dread: 'Existential', source: [] },
	{ id: 'O50c', text: 'The rain doesn\'t know about the war, or the curfew, or the work. It falls on everything equally.', level: 1, concepts: { Nature: -20, Rule: -10 }, source: [] },

	// P51 — Distant artillery (61a–c)
	{ id: 'O51a', text: 'The front. Far enough away. You\'re safe here.', level: 1, concepts: { Rule: 20 }, source: [] },
	{ id: 'O51b', text: 'Like thunder, except thunder doesn\'t have a schedule.', level: 1, concepts: { Rule: -30, Nature: -20 }, source: [] },
	{ id: 'O51c', text: 'Someone is dying at the source of that sound. You\'re writing about it at the other end.', level: 1, concepts: { Rule: -60, Morality: -50 }, source: [] },

	// P52 — Gas lamp dims (60a–c)
	{ id: 'O52a', text: 'The pressure drops at night. It\'ll come back.', level: 1, concepts: { Nature: 10 }, source: [] },
	{ id: 'O52b', text: 'The shadows in the room rearrange themselves. Familiar things become strange.', level: 1, concepts: { Nature: -10 }, dread: 'Existential', source: [] },
	{ id: 'O52c', text: 'Your light depends on a supply you don\'t control, from a source you can\'t see, owned by someone you\'ll never meet.', level: 1, concepts: { Nature: -20, Class: -30 }, source: [] },

	// P53 — Dawn light (66a–c)
	{ id: 'O53a', text: 'Morning. Another day. A new beginning.', level: 1, concepts: { Nature: 10 }, source: [] },
	{ id: 'O53b', text: 'Dawn. The light doesn\'t care that you haven\'t slept.', level: 1, concepts: { Nature: -10 }, dread: 'Existential', source: [] },
	{ id: 'O53c', text: 'You survived the night. That used to be a figure of speech.', level: 1, concepts: { Nature: -20 }, dread: 'Existential', source: [] },

	// --- Bodily States ---

	// P54 — Hunger (#77)
	{ id: 'O54a', text: 'You\'ll eat later. The work comes first.', level: 1, concepts: { Nature: 10, Morality: 10 }, source: [] },
	{ id: 'O54b', text: 'The body has its own arguments, and they\'re hard to refute.', level: 1, concepts: { Nature: -10, Morality: -10 }, source: [] },
	{ id: 'O54c', text: 'Hunger is the body\'s politics. It doesn\'t care about your ideas. It wants bread.', level: 1, concepts: { Nature: -20, Morality: -20, Class: -30 }, source: [] },

	// P55 — Eye strain (#86)
	{ id: 'O55a', text: 'Rest them for a moment. Then back to work.', level: 1, concepts: { Nature: 10, Art: 10 }, source: [] },
	{ id: 'O55b', text: 'The words on the page swim, then steady, then swim again.', level: 1, concepts: { Nature: -10, Art: -10 }, source: [] },
	{ id: 'O55c', text: 'Your body is telling you to stop. You\'re not listening. You never listen.', level: 1, concepts: { Nature: -20, Art: -20, Morality: -20 }, source: [] },

	// P56 — Cramped hand (#80)
	{ id: 'O56a', text: 'Flex it. Shake it out. The pen doesn\'t care about your comfort.', level: 1, concepts: { Nature: 10, Art: 10 }, source: [] },
	{ id: 'O56b', text: 'The pen has been in it for hours. The hand doesn\'t care about the work.', level: 1, concepts: { Nature: -10, Art: -10 }, source: [] },
	{ id: 'O56c', text: 'The body rebels against the mind. It always does, eventually. The mind never wins.', level: 1, concepts: { Nature: -30, Art: -20 }, dread: 'Existential', source: [] },

	// P57 — Cold (#82)
	{ id: 'O57a', text: 'It\'s winter. Of course you\'re cold. Everyone is cold.', level: 1, concepts: { Nature: 10, Class: 10 }, source: [] },
	{ id: 'O57b', text: 'The kind of cold that sits in your joints and reminds you the building doesn\'t care about you.', level: 1, concepts: { Nature: -10, Class: -10 }, source: [] },
	{ id: 'O57c', text: 'Cold is the tax you pay for not being rich enough to be warm.', level: 1, concepts: { Nature: -10, Class: -50 }, source: [] },

	// P58 — Memory, unbidden (#84)
	{ id: 'O58a', text: 'Memories come and go. You let it pass.', level: 1, concepts: { Faith: 10 }, source: [] },
	{ id: 'O58b', text: 'A face, a place, a moment. Then it\'s gone.', level: 1, concepts: {}, dread: 'Existential', source: [] },
	{ id: 'O58c', text: 'You didn\'t invite this thought. It came anyway. Your mind is not entirely your own.', level: 1, concepts: { Faith: -20 }, dread: 'Existential', source: [] },

	// --- Hidden / Nested Objects ---

	// P59 — Note in Bible (#87)
	{ id: 'O59a', text: 'Someone left it by accident. A bookmark, nothing more.', level: 1, concepts: { Faith: 10 }, source: [] },
	{ id: 'O59b', text: 'A verse reference and three words: "Remember who listens." A warning? An encouragement?', level: 1, concepts: { Faith: 10, Rule: -10 }, source: [] },
	{ id: 'O59c', text: '"Remember who listens." Someone used a Bible to hide a message about surveillance. The irony is perfect.', level: 1, concepts: { Faith: -60, Rule: -50 }, source: [] },

	// P60 — Pocket watch inscription (#88)
	{ id: 'O60a', text: 'A gift, once. The watch outlasted whatever they had.', level: 1, concepts: { Faith: 10 }, source: [] },
	{ id: 'O60b', text: 'Not your initials. You wonder whose they were, and how the watch ended up here.', level: 1, concepts: {}, dread: 'Existential', source: [] },
	{ id: 'O60c', text: 'Someone\'s name, reduced to initials. Someone\'s life, reduced to a date. Everything gets abbreviated in the end.', level: 1, concepts: { Rule: -10 }, dread: 'Existential', source: [] },

	// P61 — Photograph back (#89)
	{ id: 'O61a', text: 'Faces you know. A happier time. You put it back face-down.', level: 1, concepts: { Morality: 10 }, source: [] },
	{ id: 'O61b', text: 'Everyone is smiling. That\'s the hardest part.', level: 1, concepts: { Morality: -10 }, dread: 'Existential', source: [] },
	{ id: 'O61c', text: 'Faces from before. They\'re smiling because they don\'t know what\'s coming. None of you did.', level: 1, concepts: { Morality: -30 }, dread: 'Existential', source: [] },

	// P62 — Under the mattress (#90)
	{ id: 'O62a', text: 'You should get rid of it. Having it is a risk you don\'t need.', level: 1, concepts: { Rule: 20, Morality: 10 }, source: [] },
	{ id: 'O62b', text: 'Not the political kind. The forbidden kind. You kept it because someone asked you to.', level: 1, concepts: { Rule: -30, Morality: -20 }, source: [] },
	{ id: 'O62c', text: 'Forbidden ideas, hidden under where you sleep. You dream on top of them every night.', level: 1, concepts: { Rule: -70, Morality: -50 }, source: [] },

	// P63 — Coat pocket (#91)
	{ id: 'O63a', text: 'Old. Forgotten. You should throw it away.', level: 1, concepts: {}, source: [] },
	{ id: 'O63b', text: 'From three months ago. A destination you no longer visit.', level: 1, concepts: { Rule: -10 }, dread: 'Existential', source: [] },
	{ id: 'O63c', text: 'A destination that\'s now off-limits. Evidence of a world that used to be larger.', level: 1, concepts: { Rule: -30 }, dread: 'Existential', source: [] },

	// P64 — Pressed flower (#92)
	{ id: 'O64a', text: 'A keepsake. Someone wanted to preserve a moment.', level: 1, concepts: { Nature: 10, Faith: 10 }, source: [] },
	{ id: 'O64b', text: 'Still holding its colour, barely. Pressed flat. Beautiful and dead.', level: 1, concepts: { Nature: -10, Art: -10, Faith: 0 }, source: [] },
	{ id: 'O64c', text: 'Preserved by crushing it. The only way to keep it was to kill it.', level: 1, concepts: { Nature: -30, Art: -30 }, dread: 'Existential', source: [] },

	// P65 — Under the floorboard (#93)
	{ id: 'O65a', text: 'Savings. Prudence. You put it aside for an emergency.', level: 1, concepts: { Class: 10 }, source: [] },
	{ id: 'O65b', text: 'Not much. But enough to leave, if it came to that.', level: 1, concepts: { Class: -20, Rule: -20 }, dread: 'Existential', source: [] },
	{ id: 'O65c', text: 'Escape money. You hid it, which means you\'ve already decided something you haven\'t admitted yet.', level: 1, concepts: { Class: -40, Rule: -40 }, dread: 'Existential', source: [] },

	// P66 — Specimen jar label (#95)
	{ id: 'O66a', text: 'Your studies. Classification, taxonomy. The orderly world of science.', level: 1, concepts: { Nature: 20, Truth: 10 }, source: [] },
	{ id: 'O66b', text: 'From when you still believed in classification. That seems like a long time ago.', level: 1, concepts: { Nature: -30, Truth: -30 }, source: [] },
	{ id: 'O66c', text: 'You gave it a Latin name, as if naming something gives you power over it. It doesn\'t.', level: 1, concepts: { Nature: -50, Truth: -40 }, source: [] },

	// P67 — Windowsill scratches (#97)
	{ id: 'O67a', text: 'Previous tenant\'s marks. People count things. Days, meals, whatever.', level: 1, concepts: {}, source: [] },
	{ id: 'O67b', text: 'Five marks, then a gap, then three. Someone was counting days. Then they stopped.', level: 1, concepts: { Rule: -20 }, dread: 'Existential', source: [] },
	{ id: 'O67c', text: 'Someone was counting. They stopped at eight. Did they leave, or did they stop counting?', level: 1, concepts: { Rule: -40 }, dread: 'Existential', source: [] },
];

// ---------------------------------------------------------------------------
// Inklings (Level 2)
// ---------------------------------------------------------------------------

const inklings: IdeaDef[] = [
	// Rule Inklings
	{ id: 'I1', text: 'Language shapes what can be thought. Control the words and you control the thinking.', level: 2, concepts: { Rule: -50, Truth: -40 }, source: ['O1c', 'O8c'] },
	{ id: 'I2', text: 'Rights written in law are only as strong as the will to enforce them.', level: 2, concepts: { Rule: -50, Class: -40 }, source: ['O20b', 'O20c'] },
	{ id: 'I3', text: 'The people who stop writing don\'t disappear. They just become quieter, until quiet is all they are.', level: 2, concepts: { Rule: -50, Truth: -50 }, source: ['O5b', 'O5c'] },
	{ id: 'I4', text: 'Self-censorship is the regime\'s greatest achievement. It costs them nothing and silences more than any law.', level: 2, concepts: { Rule: -60, Truth: -50 }, source: ['O4b', 'O4c'] },
	{ id: 'I5', text: 'Order requires sacrifice. The restrictions are the price of a functioning state. Everyone pays something.', level: 2, concepts: { Rule: 40, Morality: 30 }, source: ['O1a', 'O20a'] },

	// Faith Inklings
	{ id: 'I6', text: 'Scripture bends to serve whoever holds it. The text doesn\'t change; the reader does.', level: 2, concepts: { Faith: -60, Rule: -50 }, source: ['O15c'] },
	{ id: 'I7', text: 'The bells ring for an empty church. Ritual outlives the faith that built it.', level: 2, concepts: { Faith: -40 }, dread: 'Existential', source: ['O49c'] },
	{ id: 'I8', text: 'Faith is not certainty. It is continuing when certainty is gone.', level: 2, concepts: { Faith: 20 }, source: ['O23b', 'O34a'] },
	{ id: 'I9', text: 'The church has stood for centuries. The bells still ring. There is wisdom in what endures.', level: 2, concepts: { Faith: 40 }, source: ['O49a', 'O14a'] },

	// Dread Inklings
	{ id: 'I10', text: 'You could leave. The door is open. The money is there. The fact that you stay is either commitment or cowardice.', level: 2, concepts: { Rule: -20 }, dread: 'Existential', source: ['O44b', 'O44c', 'O65b', 'O65c'] },
	{ id: 'I11', text: 'Memory edits itself. What you remember is not what happened — it\'s what you can bear to keep.', level: 2, concepts: { Art: -20 }, dread: 'Existential', source: ['O9b', 'O9c', 'O58b', 'O58c'] },
	{ id: 'I12', text: 'You keep things that no longer serve you. The key. The programme. The faith. Letting go requires knowing what you are without them.', level: 2, concepts: { Faith: -20 }, dread: 'Existential', source: ['O39c', 'O36b', 'O36c'] },
	{ id: 'I13', text: 'The crack grows. Everything that holds together is in the process of coming apart.', level: 2, concepts: { Nature: -40 }, dread: 'Existential', source: ['O40c'] },

	// Class Inklings
	{ id: 'I14', text: 'Poverty is not a condition. It\'s a system of choices someone else made.', level: 2, concepts: { Class: -50 }, source: ['O3c', 'O33c', 'O57c'] },
	{ id: 'I15', text: 'There is dignity in smallness. The soap, the bread, the careful use of ink. To attend to small things is not poverty of spirit.', level: 2, concepts: { Class: 20, Morality: 10 }, source: ['O33a', 'O12b'] },

	// Art Inklings
	{ id: 'I16', text: 'Beauty serves no purpose. That may be why it matters.', level: 2, concepts: { Art: -40, Nature: -10 }, source: ['O17b'] },
	{ id: 'I17', text: 'The blank page is not potential. It is demand. It asks: what are you willing to say?', level: 2, concepts: { Art: -40 }, dread: 'Academic', source: ['O13c'] },
	{ id: 'I18', text: 'The work is all that matters tonight. Everything else — the cold, the hunger, the fear — is noise.', level: 2, concepts: { Art: 30, Truth: 20 }, source: ['O29a', 'O55a'] },
	{ id: 'I19', text: 'Art that serves the community is not diminished by its service. The cathedral was built to order. It is still beautiful.', level: 2, concepts: { Art: 40, Faith: 20 }, source: ['O17a', 'O7a'] },

	// Nature Inklings
	{ id: 'I20', text: 'The body doesn\'t negotiate. Hunger, cold, exhaustion — these are facts, not arguments.', level: 2, concepts: { Nature: -20 }, dread: 'Existential', source: ['O54b', 'O54c', 'O56b', 'O56c', 'O57b', 'O57c'] },
	{ id: 'I21', text: 'Classification is not understanding. It is the illusion of understanding, filed in alphabetical order.', level: 2, concepts: { Nature: -40, Truth: -40 }, source: ['O19c', 'O66b', 'O66c'] },
	{ id: 'I22', text: 'The natural world adapts. The strong survive. This is not cruelty — it is the mechanism by which everything improves.', level: 2, concepts: { Nature: 40, Class: 20 }, source: ['O16a', 'O22a'] },

	// Morality Inklings
	{ id: 'I23', text: 'A medal is the state\'s receipt. It acknowledges the transaction, not the cost.', level: 2, concepts: { Rule: -50, Morality: -40 }, source: ['O38c'] },
	{ id: 'I24', text: 'Obedience and virtue are not the same thing. The state has spent centuries conflating them.', level: 2, concepts: { Rule: -60, Morality: -60 }, source: ['O21b', 'O21c', 'O35b', 'O35c'] },
	{ id: 'I25', text: 'Duty is the structure that holds a person together when everything else falls apart.', level: 2, concepts: { Morality: 40 }, source: ['O29a', 'O54a'] },

	// Cross-Concept Inklings (Combinations)
	{ id: 'I26', text: 'The gazette restricts assembly. The hymnbook gathers voices in song. One is legal. Both are about control.', level: 2, concepts: { Rule: -40, Faith: -30 }, source: ['O1b', 'O1c', 'O23a', 'O23b'] },
	{ id: 'I27', text: 'The pamphlet calls hierarchy divine. The dinner bones say otherwise. God\'s order has a class system, and you know which end you\'re on.', level: 2, concepts: { Faith: -50, Class: -50, Rule: -40 }, source: ['O18a', 'O18b', 'O18c', 'O24c'] },
	{ id: 'I28', text: 'The field guide names things without meaning. The poem means things without naming. Which is closer to truth?', level: 2, concepts: { Art: -30, Nature: -20, Truth: -40 }, source: ['O19b', 'O17b', 'O17c'] },
	{ id: 'I29', text: 'Your hand cramps. The ink runs low. The body and the tools conspire against the work. Perhaps the work is the problem.', level: 2, concepts: { Art: -30, Nature: -20 }, dread: 'Academic', source: ['O56b', 'O56c', 'O12b', 'O12c'] },
	{ id: 'I30', text: 'The photograph is face-down. The medal is face-up. You display what the state honours and hide what you loved.', level: 2, concepts: { Morality: -40, Rule: -30 }, dread: 'Existential', source: ['O34c', 'O38a', 'O38b'] },
	{ id: 'I31', text: 'Someone scratched days into the windowsill. You\'re scratching ideas into paper. Both of you are counting down to something.', level: 2, concepts: { Rule: -20 }, dread: 'Existential', source: ['O67b', 'O67c', 'O13b', 'O13c'] },
	{ id: 'I32', text: 'Rain falls on the restricted areas too. Nature doesn\'t read maps.', level: 2, concepts: { Nature: -30, Rule: -30 }, source: ['O50c', 'O43b', 'O43c'] },
	{ id: 'I33', text: 'The alchemist promised transformation through fire. The state promises transformation through obedience. Both are selling the same lie.', level: 2, concepts: { Rule: -50 }, dread: 'Existential', source: ['O22c', 'O35a', 'O35b'] },
	{ id: 'I34', text: 'The landlord raises the rent. The state raises the stakes. Up and up. You\'re the only thing that doesn\'t rise.', level: 2, concepts: { Class: -50, Rule: -40 }, source: ['O3b', 'O3c', 'O43b', 'O43c'] },
	{ id: 'I35', text: 'The razor is sharp. The pen is dull. Both leave marks. One is faster.', level: 2, concepts: { Art: -20, Morality: -30 }, dread: 'Existential', source: ['O32c', 'O12b', 'O12c'] },
	{ id: 'I36', text: 'The storybook wolf and the forbidden pamphlet. Asking questions has always been punished. The punishment just got more sophisticated.', level: 2, concepts: { Rule: -60, Morality: -50 }, source: ['O21b', 'O21c', 'O62b', 'O62c'] },
	{ id: 'I37', text: 'The apple rots. The soap dwindles. The crack widens. Everything in this room is a clock, counting down differently.', level: 2, concepts: { Nature: -30 }, dread: 'Existential', source: ['O25c', 'O40b', 'O40c'] },
	{ id: 'I38', text: 'The natural order is what the powerful call the order they built.', level: 2, concepts: { Rule: -50, Nature: -40, Class: -40 }, source: ['O18b', 'O18c', 'O16b', 'O16c'] },
	{ id: 'I39', text: 'Preserved by crushing. The flower, the specimen, the faith. The things you keep alive by stopping them from growing.', level: 2, concepts: { Nature: -40, Faith: -30 }, dread: 'Existential', source: ['O64c', 'O42c'] },
	{ id: 'I40', text: 'You were given a mind that questions. Perhaps that is the point — not the answers, but the asking.', level: 2, concepts: { Faith: -20, Truth: -30, Art: -20 }, source: ['O14c', 'O8b'] },
];

// ---------------------------------------------------------------------------
// Ideas (Level 3) — writable, developed from inklings
// ---------------------------------------------------------------------------

const ideas: IdeaDef[] = [
	// Rule + Truth
	{ id: 'C1', text: 'Censorship is not the act of silencing. It is the architecture — the walls built so carefully that people forget there was ever a view.', level: 3, concepts: { Rule: -60, Truth: -50 }, source: ['I1', 'I4'] },
	{ id: 'C2', text: 'Order is not peace. It is the agreement to stop asking whether peace was what we wanted.', level: 3, concepts: { Rule: 40, Morality: 30 }, source: ['I5'] },
	{ id: 'C3', text: 'The silent collaborate. Every throat that closes around a true word tightens the noose for the next person who tries to speak.', level: 3, concepts: { Rule: -55, Truth: -55 }, source: ['I3', 'I4'] },

	// Faith
	{ id: 'C4', text: 'Scripture is a mirror held up by the powerful. They see their own authority reflected back and call it God.', level: 3, concepts: { Faith: -60, Rule: -50 }, source: ['I6'] },
	{ id: 'C5', text: 'Faith endures not because the church is right, but because the need it answers is older than any institution.', level: 3, concepts: { Faith: 30 }, source: ['I8', 'I9'] },

	// Class
	{ id: 'C6', text: 'Poverty is engineered. Every rent increase, every closed door, every "fair wage" is a brick in a wall someone else designed.', level: 3, concepts: { Class: -60, Rule: -40 }, source: ['I14', 'I34'] },
	{ id: 'C7', text: 'Dignity does not require abundance. The careful hand, the mended cloth, the last match struck with precision — these are not signs of defeat.', level: 3, concepts: { Class: 20, Morality: 15 }, source: ['I15'] },

	// Art
	{ id: 'C8', text: 'Art exists in the space between what is permitted and what is true. The blank page is not empty — it is occupied by everything you are afraid to say.', level: 3, concepts: { Art: -45, Truth: -30 }, source: ['I16', 'I17'] },
	{ id: 'C9', text: 'A cathedral built to order is still a cathedral. Art in service is not diminished — only the artist who believes otherwise.', level: 3, concepts: { Art: 40, Faith: 20 }, source: ['I19'] },

	// Nature + Truth
	{ id: 'C10', text: 'To name a thing is not to know it. The field guide pins the butterfly and calls the pin knowledge.', level: 3, concepts: { Nature: -45, Truth: -45 }, source: ['I21'] },
	{ id: 'C11', text: 'There is no natural order — only order, imposed, and then called natural by those who benefit from it.', level: 3, concepts: { Nature: -45, Rule: -50, Class: -40 }, source: ['I22', 'I38'] },

	// Morality + Rule
	{ id: 'C12', text: 'Obedience is the counterfeit of virtue. The state stamps it with the same seal, but the metal is base.', level: 3, concepts: { Morality: -55, Rule: -50 }, source: ['I23', 'I24'] },
	{ id: 'C13', text: 'Duty is the last scaffolding. When conviction fails and courage fails and even hope fails, duty remains — not because it is noble, but because it is all that is left.', level: 3, concepts: { Morality: 40 }, source: ['I25'] },

	// Cross-domain
	{ id: 'C14', text: 'The gazette and the hymnbook serve the same master. One compels with law, the other with love. Both demand submission.', level: 3, concepts: { Rule: -45, Faith: -35, Class: -30 }, source: ['I26', 'I27'] },

	// Dread ideas
	{ id: 'C15', text: 'You stay because leaving would mean admitting that staying was a choice — and choices can be wrong.', level: 3, concepts: { Rule: -25 }, dread: 'Existential', source: ['I10', 'I12'] },
	{ id: 'C16', text: 'Everything is in the process of becoming something else. Memory, matter, meaning — all of it dissolving, all of it pretending to hold.', level: 3, concepts: { Nature: -40, Art: -25 }, dread: 'Existential', source: ['I11', 'I13'] },
];

// ---------------------------------------------------------------------------
// Observation Prompts
// ---------------------------------------------------------------------------

const prompts: PromptDef[] = [
	// Work Area
	{ id: 'P1', objectName: 'Government gazette', text: 'The gazette announces new restrictions on public assembly.', readings: ['O1a', 'O1b', 'O1c'], location: 'work-area' },
	{ id: 'P2', objectName: 'Government gazette', text: 'The gazette lists promotions in the civil service.', readings: ['O2a', 'O2b', 'O2c'], location: 'work-area' },
	{ id: 'P3', objectName: 'Rent demand', text: 'The rent is due Thursday. The figure has gone up again.', readings: ['O3a', 'O3b', 'O3c'], location: 'work-area' },
	{ id: 'P4', objectName: 'Letter from a colleague', text: 'Your colleague writes about a paper they\'re preparing. Between the lines, something else.', readings: ['O4a', 'O4b', 'O4c'], location: 'work-area' },
	{ id: 'P5', objectName: 'Letter from a colleague', text: 'Your colleague mentions names. People who\'ve gone quiet.', readings: ['O5a', 'O5b', 'O5c'], location: 'work-area' },
	{ id: 'P6', objectName: 'Letter from family', text: 'Your mother\'s handwriting. She asks if you\'re eating enough.', readings: ['O6a', 'O6b', 'O6c'], location: 'work-area' },
	{ id: 'P7', objectName: 'Rejection letter', text: 'The rejection is polite. "Not suited to the present climate."', readings: ['O7a', 'O7b', 'O7c'], location: 'work-area' },
	{ id: 'P8', objectName: 'Annotated lexicon', text: 'The lexicon falls open to a page covered in your annotations.', readings: ['O8a', 'O8b', 'O8c'], location: 'work-area' },
	{ id: 'P9', objectName: 'Half-finished sketch', text: 'A sketch of a building. You drew it from memory.', readings: ['O9a', 'O9b', 'O9c'], location: 'work-area' },
	{ id: 'P10', objectName: 'Pocket watch', text: 'The pocket watch has stopped. 3:17.', readings: ['O10a', 'O10b', 'O10c'], location: 'work-area' },
	{ id: 'P11', objectName: 'Worn coin', text: 'An old coin. The face on it belongs to no current authority.', readings: ['O11a', 'O11b', 'O11c'], location: 'work-area' },
	{ id: 'P12', objectName: 'Ink pot and nib', text: 'The ink is low. The nib is worn.', readings: ['O12a', 'O12b', 'O12c'], location: 'work-area' },
	{ id: 'P13', objectName: 'Blank paper', text: 'The blank page.', readings: ['O13a', 'O13b', 'O13c'], location: 'work-area' },

	// Shelves & Books
	{ id: 'P14', objectName: 'Bible, Ecclesiastes', text: 'The Bible falls open to Ecclesiastes. "Of making many books there is no end."', readings: ['O14a', 'O14b', 'O14c'], location: 'shelves' },
	{ id: 'P15', objectName: 'Bible, Romans 13', text: 'The spine is cracked at Romans 13. "Let every soul be subject unto the higher powers."', readings: ['O15a', 'O15b', 'O15c'], location: 'shelves' },
	{ id: 'P16', objectName: 'Natural philosophy', text: 'The text describes how organisms adapt to hostile environments. Slowly, over generations.', readings: ['O16a', 'O16b', 'O16c'], location: 'shelves' },
	{ id: 'P17', objectName: 'Poetry collection', text: 'A poem about a field in summer.', readings: ['O17a', 'O17b', 'O17c'], location: 'shelves' },
	{ id: 'P18', objectName: 'Political pamphlet', text: 'The pamphlet argues that the current order is natural, inevitable, divinely ordained.', readings: ['O18a', 'O18b', 'O18c'], location: 'shelves' },
	{ id: 'P19', objectName: 'Botanical field guide', text: 'The field guide catalogues species. Precise, clinical descriptions.', readings: ['O19a', 'O19b', 'O19c'], location: 'shelves' },
	{ id: 'P20', objectName: 'Legal compendium', text: 'The compendium defines rights. Some no longer apply.', readings: ['O20a', 'O20b', 'O20c'], location: 'shelves' },
	{ id: 'P21', objectName: 'Children\'s storybook', text: 'A storybook. The wolf is punished for asking too many questions.', readings: ['O21a', 'O21b', 'O21c'], location: 'shelves' },
	{ id: 'P22', objectName: 'Alchemical text', text: 'The alchemical text promises transformation. Base metal into gold.', readings: ['O22a', 'O22b', 'O22c'], location: 'shelves' },
	{ id: 'P23', objectName: 'Hymnbook', text: 'The hymnbook is inscribed to you. The handwriting is unmistakable.', readings: ['O23a', 'O23b', 'O23c'], location: 'shelves' },

	// Kitchenette
	{ id: 'P24', objectName: 'Remains of dinner', text: 'Bones picked clean. A heel of bread gone hard.', readings: ['O24a', 'O24b', 'O24c'], location: 'kitchenette' },
	{ id: 'P25', objectName: 'Apple, browning', text: 'The apple has a brown spot. It\'s spreading.', readings: ['O25a', 'O25b', 'O25c'], location: 'kitchenette' },
	{ id: 'P26', objectName: 'Whiskey bottle', text: 'The whiskey is a quarter full.', readings: ['O26a', 'O26b', 'O26c'], location: 'kitchenette' },
	{ id: 'P27', objectName: 'Knife', text: 'The knife. Dull but clean.', readings: ['O27a', 'O27b', 'O27c'], location: 'kitchenette' },
	{ id: 'P28', objectName: 'Gas stove', text: 'The pilot light flickers.', readings: ['O28a', 'O28b', 'O28c'], location: 'kitchenette' },

	// Bed Area
	{ id: 'P29', objectName: 'The bed, unmade', text: 'The bed. Unmade.', readings: ['O29a', 'O29b', 'O29c'], location: 'bed' },
	{ id: 'P30', objectName: 'Coat as blanket', text: 'The coat is too thin for this, but it\'s warmer than the blanket.', readings: ['O30a', 'O30b', 'O30c'], location: 'bed' },

	// Bathroom
	{ id: 'P31', objectName: 'Mirror', text: 'Your face in the mirror.', readings: ['O31a', 'O31b', 'O31c'], location: 'bathroom' },
	{ id: 'P32', objectName: 'Razor', text: 'The razor. Sharp. Clean.', readings: ['O32a', 'O32b', 'O32c'], location: 'bathroom' },
	{ id: 'P33', objectName: 'Soap, nearly gone', text: 'The soap is a sliver.', readings: ['O33a', 'O33b', 'O33c'], location: 'bathroom' },

	// Walls, Fixtures, Room
	{ id: 'P34', objectName: 'Photograph, face-down', text: 'The photograph is face-down. You put it that way.', readings: ['O34a', 'O34b', 'O34c'], location: 'walls' },
	{ id: 'P35', objectName: 'Recruitment poster', text: 'The poster promises purpose, belonging, a future.', readings: ['O35a', 'O35b', 'O35c'], location: 'walls' },
	{ id: 'P36', objectName: 'Concert programme', text: 'A programme from a concert. From before.', readings: ['O36a', 'O36b', 'O36c'], location: 'walls' },
	{ id: 'P37', objectName: 'Death certificate', text: 'The certificate. Official, stamped, filed.', readings: ['O37a', 'O37b', 'O37c'], location: 'walls' },
	{ id: 'P38', objectName: 'Military medal', text: 'The medal. Heavy for its size.', readings: ['O38a', 'O38b', 'O38c'], location: 'walls' },
	{ id: 'P39', objectName: 'Key', text: 'The key doesn\'t fit anything in this room.', readings: ['O39a', 'O39b', 'O39c'], location: 'walls' },
	{ id: 'P40', objectName: 'Crack in the wall', text: 'The crack in the wall. Getting wider.', readings: ['O40a', 'O40b', 'O40c'], location: 'walls' },
	{ id: 'P41', objectName: 'Window', text: 'Through the window: rooftops, a church spire, smoke.', readings: ['O41a', 'O41b', 'O41c'], location: 'walls' },
	{ id: 'P42', objectName: 'Specimen jar', text: 'The jar holds something preserved in cloudy liquid.', readings: ['O42a', 'O42b', 'O42c'], location: 'walls' },
	{ id: 'P43', objectName: 'Map of the city', text: 'The map has pencil marks. Routes, places. Some crossed out.', readings: ['O43a', 'O43b', 'O43c'], location: 'walls' },
	{ id: 'P44', objectName: 'Door and latch', text: 'The door is latched but not locked.', readings: ['O44a', 'O44b', 'O44c'], location: 'walls' },
	{ id: 'P45', objectName: 'Loose floorboard', text: 'The floorboard is loose.', readings: ['O45a', 'O45b', 'O45c'], location: 'walls' },
	{ id: 'P46', objectName: 'Coat on hook', text: 'The coat on the hook.', readings: ['O46a', 'O46b', 'O46c'], location: 'walls' },
	{ id: 'P47', objectName: 'Handbill', text: 'The handbill offers factory work. Twelve-hour shifts. Fair wages. Housing.', readings: ['O47a', 'O47b', 'O47c'], location: 'walls' },
	{ id: 'P48', objectName: 'Stain on ceiling', text: 'The stain on the ceiling.', readings: ['O48a', 'O48b', 'O48c'], location: 'walls' },

	// Sensory Events
	{ id: 'P49', objectName: 'Church bells', text: 'Bells. Midnight.', readings: ['O49a', 'O49b', 'O49c'], location: 'sensory' },
	{ id: 'P50', objectName: 'Rain', text: 'Rain against the glass.', readings: ['O50a', 'O50b', 'O50c'], location: 'sensory' },
	{ id: 'P51', objectName: 'Distant artillery', text: 'A sound. Low. Distant. Sustained.', readings: ['O51a', 'O51b', 'O51c'], location: 'sensory' },
	{ id: 'P52', objectName: 'Gas lamp dims', text: 'The gas lamp dims.', readings: ['O52a', 'O52b', 'O52c'], location: 'sensory' },
	{ id: 'P53', objectName: 'Dawn light', text: 'Light. Through the curtains.', readings: ['O53a', 'O53b', 'O53c'], location: 'sensory' },

	// Bodily States
	{ id: 'P54', objectName: 'Hunger', text: 'Your stomach.', readings: ['O54a', 'O54b', 'O54c'], location: 'bodily' },
	{ id: 'P55', objectName: 'Eye strain', text: 'Your eyes ache.', readings: ['O55a', 'O55b', 'O55c'], location: 'bodily' },
	{ id: 'P56', objectName: 'Cramped hand', text: 'Your hand. Cramping.', readings: ['O56a', 'O56b', 'O56c'], location: 'bodily' },
	{ id: 'P57', objectName: 'Cold', text: 'You\'re cold.', readings: ['O57a', 'O57b', 'O57c'], location: 'bodily' },
	{ id: 'P58', objectName: 'Memory, unbidden', text: 'A thought surfaces. Uninvited.', readings: ['O58a', 'O58b', 'O58c'], location: 'bodily' },

	// Hidden / Nested Objects
	{ id: 'P59', objectName: 'Note in Bible', text: 'Inside the Bible, a note. Not in your handwriting.', readings: ['O59a', 'O59b', 'O59c'], location: 'hidden' },
	{ id: 'P60', objectName: 'Pocket watch inscription', text: 'The watch\'s back is engraved. A date and initials.', readings: ['O60a', 'O60b', 'O60c'], location: 'hidden' },
	{ id: 'P61', objectName: 'Photograph back', text: 'You turn the photograph over.', readings: ['O61a', 'O61b', 'O61c'], location: 'hidden' },
	{ id: 'P62', objectName: 'Under the mattress', text: 'Under the mattress. A pamphlet.', readings: ['O62a', 'O62b', 'O62c'], location: 'hidden' },
	{ id: 'P63', objectName: 'Coat pocket', text: 'The coat pocket. A tram ticket.', readings: ['O63a', 'O63b', 'O63c'], location: 'hidden' },
	{ id: 'P64', objectName: 'Pressed flower', text: 'A dried flower. Pressed between pages of verse.', readings: ['O64a', 'O64b', 'O64c'], location: 'hidden' },
	{ id: 'P65', objectName: 'Under the floorboard', text: 'Under the loose floorboard: a tin box. Inside: money.', readings: ['O65a', 'O65b', 'O65c'], location: 'hidden' },
	{ id: 'P66', objectName: 'Specimen jar label', text: 'The label on the jar. Latin. Your handwriting.', readings: ['O66a', 'O66b', 'O66c'], location: 'hidden' },
	{ id: 'P67', objectName: 'Windowsill scratches', text: 'Scratches on the windowsill. A tally.', readings: ['O67a', 'O67b', 'O67c'], location: 'hidden' },
];

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerAllIdeas(): void {
	for (const idea of observations) {
		registerIdea(idea);
	}
	for (const idea of inklings) {
		registerIdea(idea);
	}
	for (const idea of ideas) {
		registerIdea(idea);
	}
	for (const prompt of prompts) {
		registerPrompt(prompt);
	}
}
