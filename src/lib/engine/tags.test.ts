import { describe, expect, it } from 'vitest';
import { parseAudioTag, parseFrame, processTags } from './tags';

describe('processTags', () => {
	it('returns an empty result for no tags', () => {
		expect(processTags([])).toEqual({ clear: false, classes: [], mood: null, frame: null, audio: [] });
	});

	it('collects audio tags in order without treating them as classes', () => {
		const result = processTags(['play: rain', 'class:dim', 'stop', 'volume: 0.2']);
		expect(result.audio).toEqual([
			{ kind: 'play', track: 'rain', fadeIn: null },
			{ kind: 'stop', track: null, fadeOut: null },
			{ kind: 'volume', level: 0.2 }
		]);
		expect(result.classes).toEqual(['dim']);
	});

	it('does not mistake a class that starts with an audio word for an audio tag', () => {
		expect(processTags(['playful', 'stopwatch']).classes).toEqual(['playful', 'stopwatch']);
	});

	it('reads a frame tag without treating it as a class', () => {
		const result = processTags(['frame: back.png:6, fore.png']);
		expect(result.frame).toEqual({ layers: [{ src: 'back.png', depth: 6 }, { src: 'fore.png', depth: 1 }], height: null });
		expect(result.classes).toEqual([]);
	});

	it('keeps the last frame tag when a line carries two', () => {
		const result = processTags(['frame: a.png', 'frame: b.png']);
		expect(result.frame?.layers.map((l) => l.src)).toEqual(['b.png']);
	});
});

describe('parseFrame', () => {
	it('parses the Calico example with depths and a height option', () => {
		expect(parseFrame(' image:6, image2, image3.gif:4.5 | height:0.2')).toEqual({
			layers: [
				{ src: 'image', depth: 6 },
				{ src: 'image2', depth: 1 },
				{ src: 'image3.gif', depth: 4.5 }
			],
			height: 0.2
		});
	});

	it('accepts a semicolon before options, which is what Ink source has to use', () => {
		expect(parseFrame('a.png:2, b.png; height:0.4')).toEqual({
			layers: [
				{ src: 'a.png', depth: 2 },
				{ src: 'b.png', depth: 1 }
			],
			height: 0.4
		});
	});

	it('leaves a colon that is not followed by a positive number in the name', () => {
		expect(parseFrame('https://example.test/a.png:2')).toEqual({
			layers: [{ src: 'https://example.test/a.png', depth: 2 }],
			height: null
		});
		expect(parseFrame('odd:name')?.layers).toEqual([{ src: 'odd:name', depth: 1 }]);
		expect(parseFrame('zero.png:0')?.layers).toEqual([{ src: 'zero.png:0', depth: 1 }]);
	});

	it('ignores a height that is not a positive number', () => {
		expect(parseFrame('a.png | height:tall')?.height).toBeNull();
		expect(parseFrame('a.png | height:-1')?.height).toBeNull();
	});

	it('returns null when no layer is named', () => {
		expect(parseFrame('')).toBeNull();
		expect(parseFrame(' , | height:0.5')).toBeNull();
	});

	it('reads a mood tag', () => {
		expect(processTags(['mood:textual']).mood).toBe('textual');
	});

	it('trims whitespace around tags and values', () => {
		expect(processTags(['  mood: tense  ']).mood).toBe('tense');
	});

	it('flags CLEAR', () => {
		expect(processTags(['CLEAR']).clear).toBe(true);
	});

	it('collects class tags and bare tags as classes', () => {
		expect(processTags(['class:italic', 'dim']).classes).toEqual(['italic', 'dim']);
	});

	it('does not treat a mood tag as a class', () => {
		expect(processTags(['mood:calm']).classes).toEqual([]);
	});
});

describe('parseAudioTag', () => {
	it('reads the Calico play forms, with either separator before options', () => {
		expect(parseAudioTag('play: song')).toEqual({ kind: 'play', track: 'song', fadeIn: null });
		expect(parseAudioTag('play: song | fadein: 1000')).toEqual({ kind: 'play', track: 'song', fadeIn: 1000 });
		expect(parseAudioTag('play: song; fadein: 250')).toEqual({ kind: 'play', track: 'song', fadeIn: 250 });
	});

	it('reads stop with and without a track, pause, resume and volume', () => {
		expect(parseAudioTag('stop: song')).toEqual({ kind: 'stop', track: 'song', fadeOut: null });
		expect(parseAudioTag('stop')).toEqual({ kind: 'stop', track: null, fadeOut: null });
		expect(parseAudioTag('stop; fadeout: 0')).toEqual({ kind: 'stop', track: null, fadeOut: 0 });
		expect(parseAudioTag('pause: song')).toEqual({ kind: 'pause', track: 'song' });
		expect(parseAudioTag('resume: song')).toEqual({ kind: 'resume', track: 'song' });
		expect(parseAudioTag('volume: 0.8')).toEqual({ kind: 'volume', level: 0.8 });
	});

	it('rejects a malformed tag rather than guessing', () => {
		expect(parseAudioTag('play')).toBeNull();
		expect(parseAudioTag('pause')).toBeNull();
		expect(parseAudioTag('volume: loud')).toBeNull();
		expect(parseAudioTag('mood:tense')).toBeNull();
		expect(parseAudioTag('play: song; fadein: soon')).toEqual({ kind: 'play', track: 'song', fadeIn: null });
	});
});
