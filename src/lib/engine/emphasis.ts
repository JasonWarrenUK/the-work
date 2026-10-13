/**
 * Inline emphasis for story text: `**strong**` and `*emphasis*`, the two
 * Markdown forms Calico's markdowntohtml patch handled.
 *
 * The parser returns styled segments rather than HTML, so a renderer can
 * build real elements and nothing in the story text is ever treated as
 * markup. Rules:
 *
 * - `*` toggles emphasis, `**` toggles strong, `***` toggles both.
 * - An opening run must be followed by a non-space; a closing run must be
 *   preceded by one. `2 * 3` therefore stays as written.
 * - A run with no partner stays literal.
 * - `\*` is a literal asterisk.
 *
 * @module
 */

export interface TextSegment {
	text: string;
	strong: boolean;
	em: boolean;
}

interface Run {
	index: number;
	length: number;
	canOpen: boolean;
	canClose: boolean;
}

/** Every unescaped run of asterisks, with whether it could open or close. */
function findRuns(text: string): Run[] {
	const runs: Run[] = [];
	let i = 0;
	while (i < text.length) {
		if (text[i] === '\\' && text[i + 1] === '*') {
			i += 2;
			continue;
		}
		if (text[i] !== '*') {
			i += 1;
			continue;
		}
		let end = i;
		while (end < text.length && text[end] === '*') end += 1;
		const before = i > 0 ? text[i - 1] : '';
		const after = end < text.length ? text[end] : '';
		runs.push({
			index: i,
			length: end - i,
			canOpen: after !== '' && !/\s/.test(after),
			canClose: before !== '' && !/\s/.test(before)
		});
		i = end;
	}
	return runs;
}

type Kind = 'strong' | 'em' | 'both';

const kindOf = (length: number): Kind => (length >= 3 ? 'both' : length === 2 ? 'strong' : 'em');

/**
 * Pair opening and closing runs. Returns the indices of runs that act as
 * markers; every other run is literal text.
 */
function pairRuns(runs: Run[]): Set<number> {
	const markers = new Set<number>();
	let open: { strong: number | null; em: number | null } = { strong: null, em: null };
	for (let r = 0; r < runs.length; r += 1) {
		const run = runs[r];
		const kind = kindOf(run.length);
		const wantsStrong = kind !== 'em';
		const wantsEm = kind !== 'strong';
		const closesStrong = wantsStrong && open.strong !== null;
		const closesEm = wantsEm && open.em !== null;
		if (run.canClose && (closesStrong || closesEm)) {
			// Close whatever this run can; a *** closing only em leaves strong open
			if (closesStrong) {
				markers.add(open.strong as number);
				open = { ...open, strong: null };
			}
			if (closesEm) {
				markers.add(open.em as number);
				open = { ...open, em: null };
			}
			markers.add(r);
			continue;
		}
		if (run.canOpen) {
			if (wantsStrong && open.strong === null) open = { ...open, strong: r };
			if (wantsEm && open.em === null) open = { ...open, em: r };
		}
	}
	return markers;
}

/** Split story text into styled segments. Plain text yields one unstyled segment; empty text yields none. */
export function parseEmphasis(text: string): TextSegment[] {
	const runs = findRuns(text);
	const markers = pairRuns(runs);
	const segments: TextSegment[] = [];
	let strong = false;
	let em = false;
	let buffer = '';
	const flush = () => {
		if (buffer === '') return;
		const last = segments.at(-1);
		if (last && last.strong === strong && last.em === em) {
			last.text += buffer;
		} else {
			segments.push({ text: buffer, strong, em });
		}
		buffer = '';
	};

	let i = 0;
	let r = 0;
	while (i < text.length) {
		if (text[i] === '\\' && text[i + 1] === '*') {
			buffer += '*';
			i += 2;
			continue;
		}
		const run = runs[r];
		if (run && run.index === i) {
			r += 1;
			if (markers.has(r - 1)) {
				flush();
				const kind = kindOf(run.length);
				if (kind !== 'em') strong = !strong;
				if (kind !== 'strong') em = !em;
			} else {
				buffer += text.slice(i, i + run.length);
			}
			i += run.length;
			continue;
		}
		buffer += text[i];
		i += 1;
	}
	flush();
	return segments;
}
