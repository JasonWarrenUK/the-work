import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { Compiler } from 'inkjs/compiler/Compiler';
import { Story } from 'inkjs';
import { bindStoryletFunctions, storyletKnots } from './storylets';

/** The Calico sample patch, compiled on the fly, with the storylet externals bound. */
function patchStory(savings?: number): { story: Story; errors: string[] } {
	const source = readFileSync('story/patches/storylets.ink', 'utf8');
	const json = new Compiler(source).Compile().ToJson() ?? '';
	const story = new Story(json);
	const errors: string[] = [];
	story.onError = (message: string) => errors.push(message);
	bindStoryletFunctions(story);
	if (savings !== undefined) story.variablesState.$('savings', savings);
	return { story, errors };
}

const choices = (story: Story): string[] => story.currentChoices.map((choice) => choice.text);

describe('storyletKnots', () => {
	it('lists the knots tagged # storylet, in story order', () => {
		expect(storyletKnots(patchStory().story)).toEqual(['subway', 'cab']);
	});

	it('scans a story once and reuses the result', () => {
		const { story } = patchStory();
		const tags = vi.spyOn(story, 'TagsForContentAtPath');
		storyletKnots(story);
		const scans = tags.mock.calls.length;
		expect(scans).toBeGreaterThan(0);
		storyletKnots(story);
		expect(tags.mock.calls.length).toBe(scans);
	});
});

describe('the storylet loop', () => {
	it('threads the first storylet whose guard passes and stops there', () => {
		const { story, errors } = patchStory(50);
		story.ContinueMaximally();
		expect(choices(story)).toEqual(['Take the subway']);
		expect(errors).toEqual([]);
	});

	it('skips a storylet whose guard sends it to DONE', () => {
		const { story, errors } = patchStory(10);
		story.ContinueMaximally();
		expect(choices(story)).toContain('Take the subway');
		expect(choices(story)).not.toContain('Take a cab');
		expect(errors).toEqual([]);
	});

	it('ends cleanly when no storylet applies', () => {
		const { story, errors } = patchStory(1);
		story.ContinueMaximally();
		expect(choices(story)).not.toContain('Take the subway');
		expect(choices(story)).not.toContain('Take a cab');
		expect(errors).toEqual([]);
	});

	it('follows the chosen storylet to its destination', () => {
		const { story, errors } = patchStory(50);
		story.ContinueMaximally();
		story.ChooseChoiceIndex(choices(story).indexOf('Take the subway'));
		expect(story.ContinueMaximally()).toContain("Yeah, you should've stayed in bed.");
		expect(errors).toEqual([]);
	});
});

describe('bindStoryletFunctions', () => {
	it('binds both externals', () => {
		const bind = vi.fn();
		bindStoryletFunctions({ BindExternalFunction: bind } as unknown as Story);
		expect(bind.mock.calls.map((call) => call[0])).toEqual(['get_storylet', 'storylet_count']);
	});

	it('ignores a story compiled without the declarations', () => {
		const bind = vi.fn(() => {
			throw new Error('function not declared');
		});
		expect(() => bindStoryletFunctions({ BindExternalFunction: bind } as unknown as Story)).not.toThrow();
	});
});
