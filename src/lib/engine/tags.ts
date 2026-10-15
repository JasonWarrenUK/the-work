/**
 * Ink tag processing for the narrative engine.
 *
 * Parses tags attached to Ink lines into structured data the renderer can act on.
 * Supports these tag conventions:
 *
 * - `#CLEAR` — signals the renderer to wipe all previous passage text.
 * - `#mood:<name>` — sets an atmospheric mood (applied to `document.documentElement.dataset.mood`).
 * - `#class:<name>` — adds a CSS class to the current paragraph.
 * - `#frame: a.png:6, b.png, c.gif:1.5; height:0.2` — layered parallax frame for the
 *   paragraph (Calico `parallaxframes` syntax). Each comma-separated entry is a layer;
 *   `:<depth>` after a layer sets how little it moves (higher = less). Options follow
 *   `;` (Calico wrote `|`, which the Ink compiler rejects inside a tag; both are accepted).
 * - `#play: rain; fadein: 500`, `#stop: rain; fadeout: 100`, `#stop`, `#pause: rain`,
 *   `#resume: rain`, `#volume: 0.3` — audio instructions (Calico `musicplayer` syntax,
 *   options after `;` or `|`), returned as commands for the attached `AudioPlayer`.
 * - Bare tags (e.g. `#italic`) — treated as CSS classes (Calico convention).
 *
 * @module
 */

/** One image layer of a parallax frame. */
export interface FrameLayer {
	/** Image name or path as written in the tag; the renderer resolves it. */
	src: string;
	/** Parallax depth: the layer moves by 1/depth of the full shift. Defaults to 1. */
	depth: number;
}

/** A parallax frame requested by a `#frame:` tag. */
export interface FrameSpec {
	layers: FrameLayer[];
	/** Frame height as a fraction of the viewport height, or null when the tag gave none. */
	height: number | null;
}

export interface TagResult {
	clear: boolean;
	classes: string[];
	mood: string | null;
	/** From the last `#frame:` tag on the line; null when there is none. */
	frame: FrameSpec | null;
	/** From `#play:`, `#stop`, `#pause:`, `#resume:` and `#volume:` tags, in the order they appear. */
	audio: AudioCommand[];
}

/** One audio instruction from a tag, for an `AudioPlayer` to carry out. */
export type AudioCommand =
	| { kind: 'play'; track: string; fadeIn: number | null }
	| { kind: 'stop'; track: string | null; fadeOut: number | null }
	| { kind: 'pause'; track: string }
	| { kind: 'resume'; track: string }
	| { kind: 'volume'; level: number };

// The word alone (`stop`), with a value (`play: rain`) or straight into options (`stop; fadeout: 0`)
const AUDIO_TAG = /^(play|stop|pause|resume|volume)(?:\s*:\s*(.*)|\s*([;|].*))?$/;

/**
 * Parse one audio tag (the part after `#`, such as `play: rain; fadein: 500`)
 * into a command. Returns null when the tag is not an audio tag, names no
 * track where one is needed or gives a volume that is not a number. Options
 * follow `;` (or Calico's `|`) as `name: value`; an unreadable duration is
 * dropped and the player's default applies.
 */
export function parseAudioTag(tag: string): AudioCommand | null {
	const match = AUDIO_TAG.exec(tag.trim());
	if (!match) return null;
	const [, kind, value, bareOptions] = match;
	const [first = '', ...optionParts] = (value ?? bareOptions ?? '').split(/[|;]/);
	const track = first.trim();
	const options: Record<string, string> = {};
	for (const part of optionParts) {
		const [name, value] = part.split(':');
		if (name && value !== undefined) options[name.trim().toLowerCase()] = value.trim();
	}
	const duration = (name: string): number | null => {
		if (options[name] === undefined) return null;
		const value = Number(options[name]);
		return Number.isFinite(value) && value >= 0 ? value : null;
	};

	switch (kind) {
		case 'play':
			return track ? { kind, track, fadeIn: duration('fadein') } : null;
		case 'stop':
			return { kind, track: track || null, fadeOut: duration('fadeout') };
		case 'pause':
		case 'resume':
			return track ? { kind, track } : null;
		default: {
			const level = Number(track);
			return track && Number.isFinite(level) ? { kind: 'volume', level } : null;
		}
	}
}

/**
 * Parse the value of a `#frame:` tag. Returns null when no layer is named.
 */
export function parseFrame(value: string): FrameSpec | null {
	// Options are separated by `;` in Ink source; `|` is Calico's original separator
	const [layersPart, ...optionParts] = value.split(/[|;]/);
	const layers: FrameLayer[] = [];
	for (const raw of layersPart.split(',')) {
		const entry = raw.trim();
		if (!entry) continue;
		let src = entry;
		let depth = 1;
		// `name:depth`; a trailing `:n` that is not a positive number stays part of the name
		const colon = entry.lastIndexOf(':');
		if (colon > 0) {
			const candidate = Number(entry.slice(colon + 1).trim());
			if (Number.isFinite(candidate) && candidate > 0) {
				src = entry.slice(0, colon).trim();
				depth = candidate;
			}
		}
		layers.push({ src, depth });
	}
	if (layers.length === 0) return null;

	let height: number | null = null;
	for (const part of optionParts) {
		const [key, rawValue] = part.split(':').map((s) => s.trim());
		if (key === 'height') {
			const parsed = Number(rawValue);
			if (Number.isFinite(parsed) && parsed > 0) height = parsed;
		}
	}
	return { layers, height };
}

/**
 * Process ink tags from a line.
 * Returns structured results for the renderer.
 */
export function processTags(tags: string[]): TagResult {
	const result: TagResult = {
		clear: false,
		classes: [],
		mood: null,
		frame: null,
		audio: []
	};

	for (const tag of tags) {
		const trimmed = tag.trim();

		if (trimmed === 'CLEAR') {
			result.clear = true;
			continue;
		}

		// #play: rain; fadein: 500 — audio instructions, carried out by the attached player
		if (AUDIO_TAG.test(trimmed)) {
			const command = parseAudioTag(trimmed);
			if (command) result.audio.push(command);
			continue;
		}

		// #frame: a.png:6, b.png | height:0.2 — layered parallax frame for this paragraph
		if (trimmed.startsWith('frame:')) {
			result.frame = parseFrame(trimmed.slice(6));
			continue;
		}

		// #mood:tense — set atmospheric mood
		if (trimmed.startsWith('mood:')) {
			result.mood = trimmed.slice(5).trim();
			continue;
		}

		// #class:italic — add CSS class to paragraph
		if (trimmed.startsWith('class:')) {
			result.classes.push(trimmed.slice(6).trim());
			continue;
		}

		// Bare tags become CSS classes (Calico convention)
		result.classes.push(trimmed);
	}

	return result;
}
