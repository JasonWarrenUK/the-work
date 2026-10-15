/**
 * Audio player for Ink narratives: looping named tracks with fades.
 *
 * A port of Calico's `musicplayer.js` on Howler.js, kept generic like the
 * rest of Nib: it knows nothing about Ink tags or the game. A track is
 * named by its file stem; the player resolves it to one source per format
 * under `basePath` and Howler picks the first the browser can play.
 *
 * Howler needs a user gesture before the browser lets audio start, so the
 * first `play()` should follow a click or a choice. The Ink tag wiring
 * (`#play`, `#stop` and friends) is a separate layer on top of this one.
 *
 * @module
 */

import { Howl } from 'howler';

/** The player's tunables, all with Calico's defaults. */
export interface AudioOptions {
	/** Directory the track files live under, without a trailing slash. */
	basePath: string;
	/** File extensions tried in order; Howler plays the first the browser supports. */
	formats: string[];
	/** Whether a new track plays alongside the current one. When false, the current track fades out first. */
	allowMultipleTracks: boolean;
	/** Default fade-in duration in milliseconds. */
	fadeIn: number;
	/** Default fade-out duration in milliseconds. */
	fadeOut: number;
	/** The volume every track plays at, 0 to 1. */
	volume: number;
}

/** The slice of Howler's `Howl` the player drives, so tests can hand in a fake. */
export interface Track {
	play(): unknown;
	stop(): unknown;
	unload(): unknown;
	volume(level: number): unknown;
	fade(from: number, to: number, duration: number): unknown;
	once(event: 'fade', callback: () => void): unknown;
}

/** Makes a looping track from its candidate sources, muted until the player fades it in. */
export type TrackFactory = (sources: string[]) => Track;

export const DEFAULT_AUDIO_OPTIONS: Readonly<AudioOptions> = {
	basePath: '/audio',
	formats: ['ogg', 'mp3'],
	allowMultipleTracks: false,
	fadeIn: 2000,
	fadeOut: 2000,
	volume: 0.5
};

/** The candidate files for a track name, one per format, under the base path. */
export function trackSources(name: string, options: Pick<AudioOptions, 'basePath' | 'formats'>): string[] {
	return options.formats.map((format) => `${options.basePath}/${name}.${format}`);
}

const howlFactory: TrackFactory = (sources) => new Howl({ src: sources, loop: true, volume: 0 });

/** What the player keeps for each track it has started. */
interface Playing {
	track: Track;
	/** Muted by `pause()`; `resume()` restores the volume. */
	muted: boolean;
}

/** A named-track audio player. Create one with {@link createAudioPlayer}. */
export interface AudioPlayer {
	/** The options this player runs with. */
	readonly options: Readonly<AudioOptions>;
	/** Names of the tracks currently started, in the order they started. */
	readonly tracks: readonly string[];
	/**
	 * Start a track with a fade-in, looping. Playing a track that is already
	 * started does nothing. With `allowMultipleTracks` false, every other
	 * track fades out first and this one starts once the fades finish.
	 */
	play(name: string, settings?: { fadeIn?: number }): void;
	/** Fade a track out and release it; with no name, every track. Unknown names are ignored. */
	stop(name?: string, settings?: { fadeOut?: number }): void;
	/** Mute a track while it keeps playing, so `resume()` picks up mid-loop. */
	pause(name: string): void;
	/** Restore a paused track's volume. */
	resume(name: string): void;
	/** Set the volume every track plays at, applied at once to any track that is not paused. */
	setVolume(level: number): void;
	/** Stop everything immediately, without fades. */
	dispose(): void;
}

/**
 * Create an audio player.
 *
 * @param overrides - Any of {@link AudioOptions}; the rest take {@link DEFAULT_AUDIO_OPTIONS}.
 * @param factory - How tracks are made; defaults to a looping Howler `Howl`.
 */
export function createAudioPlayer(overrides: Partial<AudioOptions> = {}, factory: TrackFactory = howlFactory): AudioPlayer {
	const options: AudioOptions = { ...DEFAULT_AUDIO_OPTIONS, ...overrides };
	const playing = new Map<string, Playing>();
	/** Fade-outs still running; in one-track mode a new track waits until this reaches zero. */
	let fading = 0;
	/** The one track waiting for the fade-outs to finish; the newest `play()` replaces an earlier wait. */
	let queued: { name: string; fadeIn: number } | null = null;

	function fadeOut(name: string, duration: number): void {
		const entry = playing.get(name);
		if (!entry) return;
		playing.delete(name);
		fading += 1;
		entry.track.once('fade', () => {
			entry.track.stop();
			entry.track.unload();
			fading -= 1;
			if (fading === 0 && queued) {
				const next = queued;
				queued = null;
				start(next.name, next.fadeIn);
			}
		});
		entry.track.fade(entry.muted ? 0 : options.volume, 0, duration);
	}

	function start(name: string, fadeIn: number): void {
		const track = factory(trackSources(name, options));
		playing.set(name, { track, muted: false });
		track.play();
		track.fade(0, options.volume, fadeIn);
	}

	return {
		options,

		get tracks(): readonly string[] {
			return [...playing.keys()];
		},

		play(name, settings = {}) {
			if (playing.has(name) || queued?.name === name) return;
			const fadeIn = settings.fadeIn ?? options.fadeIn;
			if (options.allowMultipleTracks || (playing.size === 0 && fading === 0)) {
				start(name, fadeIn);
				return;
			}
			// The new track waits for the old ones to finish fading, as Calico does;
			// a track already waiting gives way to this newer request
			queued = { name, fadeIn };
			for (const other of [...playing.keys()]) fadeOut(other, options.fadeOut);
		},

		stop(name, settings = {}) {
			const duration = settings.fadeOut ?? options.fadeOut;
			if (name === undefined) {
				queued = null;
				for (const other of [...playing.keys()]) fadeOut(other, duration);
				return;
			}
			if (queued?.name === name) queued = null;
			fadeOut(name, duration);
		},

		pause(name) {
			const entry = playing.get(name);
			if (!entry || entry.muted) return;
			entry.muted = true;
			entry.track.volume(0);
		},

		resume(name) {
			const entry = playing.get(name);
			if (!entry || !entry.muted) return;
			entry.muted = false;
			entry.track.volume(options.volume);
		},

		setVolume(level) {
			options.volume = Math.min(1, Math.max(0, level));
			for (const entry of playing.values()) {
				if (!entry.muted) entry.track.volume(options.volume);
			}
		},

		dispose() {
			queued = null;
			fading = 0;
			for (const entry of playing.values()) {
				entry.track.stop();
				entry.track.unload();
			}
			playing.clear();
		}
	};
}
