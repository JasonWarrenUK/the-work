import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Story } from 'inkjs';
import { bindStoryletFunctions } from './storylets';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('bindStoryletFunctions', () => {
	it('binds get_storylet as a stub that warns and returns an empty string', () => {
		const bind = vi.fn();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		bindStoryletFunctions({ BindExternalFunction: bind } as unknown as Story);

		expect(bind).toHaveBeenCalledOnce();
		const [name, fn] = bind.mock.calls[0];
		expect(name).toBe('get_storylet');
		expect(fn(3)).toBe('');
		expect(warn).toHaveBeenCalledOnce();
	});

	it('ignores a story compiled without the get_storylet declaration', () => {
		const bind = vi.fn(() => {
			throw new Error('function not declared');
		});

		expect(() => bindStoryletFunctions({ BindExternalFunction: bind } as unknown as Story)).not.toThrow();
	});
});
