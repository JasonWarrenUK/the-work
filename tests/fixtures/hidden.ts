/** Every hidden object: where it is found, what reveals it and what it yields. */
export interface HiddenObject {
	/** The catalogue prompt id (P59 to P67). */
	prompt: string;
	/** The "Where do you look?" choice that lists it. */
	location: string;
	/** The parent object's choice in that menu; examining it reveals the hidden object. */
	parent: string;
	/** The hidden object's own choice label once revealed. */
	label: string;
	/** The prompt line printed when it is examined. */
	text: string;
}

export const HIDDEN_OBJECTS: readonly HiddenObject[] = [
	{ prompt: 'P59', location: 'The shelves', parent: 'The Bible', label: 'A note folded inside the Bible', text: 'Inside the Bible, a note.' },
	{ prompt: 'P60', location: 'The work area', parent: 'The pocket watch', label: 'The back of the pocket watch', text: "The watch's back is engraved." },
	{ prompt: 'P61', location: 'Around the room', parent: 'The photograph, face-down', label: 'The back of the photograph', text: 'You turn the photograph over.' },
	{ prompt: 'P62', location: 'The bed', parent: 'The bed', label: 'Under the mattress', text: 'Under the mattress. A pamphlet.' },
	{ prompt: 'P63', location: 'Around the room', parent: 'The coat on the hook', label: 'The coat pocket', text: 'The coat pocket. A tram ticket.' },
	{ prompt: 'P64', location: 'The shelves', parent: 'A poetry collection', label: 'Something pressed between the pages', text: 'A dried flower.' },
	{ prompt: 'P65', location: 'Around the room', parent: 'The loose floorboard', label: 'Under the loose floorboard', text: 'Under the loose floorboard: a tin box.' },
	{ prompt: 'P66', location: 'Around the room', parent: 'A specimen jar', label: 'The label on the specimen jar', text: 'The label on the jar.' },
	{ prompt: 'P67', location: 'Around the room', parent: 'The window', label: 'The windowsill', text: 'Scratches on the windowsill.' }
];
