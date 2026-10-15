import { describe, expect, it } from 'vitest';
import { createAudioPlayer, trackSources, DEFAULT_AUDIO_OPTIONS, type Track, type TrackFactory } from './audio';

/** A Howl stand-in that records calls and finishes a fade only when told to. */
class FakeTrack implements Track {
	calls: string[] = [];
	private fadeListeners: Array<() => void> = [];

	constructor(public sources: string[]) {}

	play() {
		this.calls.push('play');
	}
	stop() {
		this.calls.push('stop');
	}
	unload() {
		this.calls.push('unload');
	}
	volume(level: number) {
		this.calls.push(`volume:${level}`);
	}
	fade(from: number, to: number, duration: number) {
		this.calls.push(`fade:${from}>${to}@${duration}`);
	}
	once(_event: 'fade', callback: () => void) {
		this.fadeListeners.push(callback);
	}
	/** Fire every pending fade-complete listener, as Howler does when a fade ends. */
	finishFade() {
		const listeners = this.fadeListeners;
		this.fadeListeners = [];
		for (const listener of listeners) listener();
	}
}

/** A factory that keeps every track it made, keyed by the track's stem. */
function fakeFactory(): { factory: TrackFactory; made: Map<string, FakeTrack> } {
	const made = new Map<string, FakeTrack>();
	const factory: TrackFactory = (sources) => {
		const track = new FakeTrack(sources);
		made.set(sources[0].replace(/^.*\//, '').replace(/\.[^.]+$/, ''), track);
		return track;
	};
	return { factory, made };
}

/** Let queued promise callbacks run. */
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('trackSources', () => {
	it('lists one file per format under the base path, in format order', () => {
		expect(trackSources('rain', DEFAULT_AUDIO_OPTIONS)).toEqual(['/audio/rain.ogg', '/audio/rain.mp3']);
		expect(trackSources('bells', { basePath: '/sfx', formats: ['webm'] })).toEqual(['/sfx/bells.webm']);
	});
});

describe('play', () => {
	it('starts a looping track muted and fades it in to the player volume', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);

		player.play('rain');

		expect(made.get('rain')?.sources).toEqual(['/audio/rain.ogg', '/audio/rain.mp3']);
		expect(made.get('rain')?.calls).toEqual(['play', 'fade:0>0.5@2000']);
		expect(player.tracks).toEqual(['rain']);
	});

	it('honours a per-call fade-in', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);

		player.play('rain', { fadeIn: 500 });

		expect(made.get('rain')?.calls).toContain('fade:0>0.5@500');
	});

	it('ignores a track that is already playing', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({ allowMultipleTracks: true }, factory);

		player.play('rain');
		player.play('rain');

		expect(made.get('rain')?.calls.filter((call) => call === 'play')).toHaveLength(1);
	});

	it('plays alongside the current track when multiple tracks are allowed', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({ allowMultipleTracks: true }, factory);

		player.play('rain');
		player.play('bells');

		expect(player.tracks).toEqual(['rain', 'bells']);
		expect(made.get('rain')?.calls).not.toContain('stop');
	});

	it('fades the current track out and starts the new one only once that fade ends', async () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');

		player.play('bells');
		expect(made.get('rain')?.calls).toContain('fade:0.5>0@2000');
		expect(made.has('bells')).toBe(false);
		expect(player.tracks).toEqual([]);

		made.get('rain')?.finishFade();
		await flush();

		expect(made.get('rain')?.calls.slice(-2)).toEqual(['stop', 'unload']);
		expect(made.get('bells')?.calls).toEqual(['play', 'fade:0>0.5@2000']);
		expect(player.tracks).toEqual(['bells']);
	});

	it('lets the newest request replace a queued track, so one-track mode never ends with two', async () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');
		player.play('bells');

		player.play('wind');
		expect(made.has('wind')).toBe(false);
		expect(made.has('bells')).toBe(false);

		made.get('rain')?.finishFade();
		await flush();

		expect(made.has('bells')).toBe(false);
		expect(made.get('wind')?.calls).toEqual(['play', 'fade:0>0.5@2000']);
		expect(player.tracks).toEqual(['wind']);
	});

	it('waits for a track that is already fading out before starting a new one', async () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');
		player.stop('rain');

		player.play('bells');
		expect(made.has('bells')).toBe(false);

		made.get('rain')?.finishFade();
		await flush();

		expect(player.tracks).toEqual(['bells']);
	});

	it('drops a queued track if it is stopped before the old one finishes fading', async () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');
		player.play('bells');

		player.stop('bells');
		made.get('rain')?.finishFade();
		await flush();

		expect(made.has('bells')).toBe(false);
		expect(player.tracks).toEqual([]);
	});
});

describe('stop', () => {
	it('fades one track out from its current volume, then stops and unloads it', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');

		player.stop('rain', { fadeOut: 100 });
		expect(player.tracks).toEqual([]);
		expect(made.get('rain')?.calls.at(-1)).toBe('fade:0.5>0@100');

		made.get('rain')?.finishFade();
		expect(made.get('rain')?.calls.slice(-2)).toEqual(['stop', 'unload']);
	});

	it('fades a paused track out from silence', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');
		player.pause('rain');

		player.stop('rain');

		expect(made.get('rain')?.calls.at(-1)).toBe('fade:0>0@2000');
	});

	it('stops every track when given no name', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({ allowMultipleTracks: true }, factory);
		player.play('rain');
		player.play('bells');

		player.stop();

		expect(player.tracks).toEqual([]);
		expect(made.get('rain')?.calls.at(-1)).toBe('fade:0.5>0@2000');
		expect(made.get('bells')?.calls.at(-1)).toBe('fade:0.5>0@2000');
	});

	it('ignores a name it does not know', () => {
		const player = createAudioPlayer({}, fakeFactory().factory);
		expect(() => player.stop('nothing')).not.toThrow();
	});
});

describe('pause and resume', () => {
	it('mutes a track without stopping it, and restores the volume on resume', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');

		player.pause('rain');
		expect(made.get('rain')?.calls.at(-1)).toBe('volume:0');
		expect(made.get('rain')?.calls).not.toContain('stop');
		expect(player.tracks).toEqual(['rain']);

		player.resume('rain');
		expect(made.get('rain')?.calls.at(-1)).toBe('volume:0.5');
	});

	it('does nothing when paused twice or resumed while playing', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({}, factory);
		player.play('rain');
		const before = made.get('rain')?.calls.length;

		player.resume('rain');
		player.pause('rain');
		player.pause('rain');

		expect(made.get('rain')?.calls.length).toBe((before ?? 0) + 1);
	});
});

describe('setVolume', () => {
	it('applies to playing tracks at once, leaves paused tracks silent and clamps to 0..1', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({ allowMultipleTracks: true }, factory);
		player.play('rain');
		player.play('bells');
		player.pause('bells');

		player.setVolume(1.5);

		expect(player.options.volume).toBe(1);
		expect(made.get('rain')?.calls.at(-1)).toBe('volume:1');
		expect(made.get('bells')?.calls.at(-1)).toBe('volume:0');

		player.resume('bells');
		expect(made.get('bells')?.calls.at(-1)).toBe('volume:1');
	});
});

describe('dispose', () => {
	it('stops and unloads everything without fading', () => {
		const { factory, made } = fakeFactory();
		const player = createAudioPlayer({ allowMultipleTracks: true }, factory);
		player.play('rain');
		player.play('bells');

		player.dispose();

		expect(player.tracks).toEqual([]);
		for (const track of made.values()) expect(track.calls.slice(-2)).toEqual(['stop', 'unload']);
	});
});
