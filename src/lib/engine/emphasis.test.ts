import { describe, expect, it } from 'vitest';
import { Compiler } from 'inkjs/compiler/Compiler';
import { Story } from 'inkjs';
import { parseEmphasis } from './emphasis';

describe('asterisks through the Ink compiler', () => {
	it('survive mid-line, where Ink does not read them as choice markers', () => {
		const json = new Compiler('There is only *one* option, **never** two.\n-> END\n').Compile().ToJson() ?? '';
		const line = new Story(json).Continue()?.trim() ?? '';
		expect(parseEmphasis(line)).toEqual([
			{ text: 'There is only ', strong: false, em: false },
			{ text: 'one', strong: false, em: true },
			{ text: ' option, ', strong: false, em: false },
			{ text: 'never', strong: true, em: false },
			{ text: ' two.', strong: false, em: false }
		]);
	});
});

const plain = (text: string) => ({ text, strong: false, em: false });
const em = (text: string) => ({ text, strong: false, em: true });
const strong = (text: string) => ({ text, strong: true, em: false });
const both = (text: string) => ({ text, strong: true, em: true });

describe('parseEmphasis', () => {
	it('returns plain text as one segment and empty text as none', () => {
		expect(parseEmphasis('Just words.')).toEqual([plain('Just words.')]);
		expect(parseEmphasis('')).toEqual([]);
	});

	it('marks *emphasis* and **strong**', () => {
		expect(parseEmphasis('There is only *one* option.')).toEqual([plain('There is only '), em('one'), plain(' option.')]);
		expect(parseEmphasis('**Never** again.')).toEqual([strong('Never'), plain(' again.')]);
	});

	it('marks ***both*** and nests one inside the other', () => {
		expect(parseEmphasis('***all***')).toEqual([both('all')]);
		expect(parseEmphasis('**bold with *italic* inside**')).toEqual([strong('bold with '), both('italic'), strong(' inside')]);
	});

	it('leaves an unpaired marker as literal text', () => {
		expect(parseEmphasis('a lone * here')).toEqual([plain('a lone * here')]);
		expect(parseEmphasis('*unclosed')).toEqual([plain('*unclosed')]);
		expect(parseEmphasis('unopened*')).toEqual([plain('unopened*')]);
	});

	it('does not read spaced asterisks as markers', () => {
		expect(parseEmphasis('2 * 3 * 4')).toEqual([plain('2 * 3 * 4')]);
	});

	it('treats an escaped asterisk as a literal', () => {
		expect(parseEmphasis('a \\*real\\* star')).toEqual([plain('a *real* star')]);
		expect(parseEmphasis('*em with \\* inside*')).toEqual([em('em with * inside')]);
	});

	it('handles two runs of emphasis in one line', () => {
		expect(parseEmphasis('*first* and *second*')).toEqual([em('first'), plain(' and '), em('second')]);
	});
});
