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
		frame: null
	};

	for (const tag of tags) {
		const trimmed = tag.trim();

		if (trimmed === 'CLEAR') {
			result.clear = true;
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
