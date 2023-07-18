import type { NonEmptyArray } from '../lib/non-empty-array';

const asciiArt = `
     *
    * *
   * * *
`.split('\n');

export type EDParagraph = {
  readonly _ED: 'paragraph';
  readonly lines: Array<string>;
};
export const paragraph = (...lines: Array<string>): EDParagraph => ({
  _ED: 'paragraph',
  lines,
});
export const examplesEDParagraph: NonEmptyArray<EDParagraph> = [
  {
    _ED: 'paragraph',
    lines: ['it is indeed cool', 'maybe the best package ever'],
  },
];

export type EDVerbatim = {
  readonly _ED: 'verbatim';
  readonly lines: Array<string>;
};
export const verbatim = (...lines: Array<string>): EDVerbatim => ({
  _ED: 'verbatim',
  lines,
});
export const examplesEDVerbatim: NonEmptyArray<EDVerbatim> = [
  {
    _ED: 'verbatim',
    lines: asciiArt,
  },
];

export type EDBlank = {
  readonly _ED: 'blank';
};
export const blank: EDBlank = {
  _ED: 'blank',
};
export const examplesEDBlank: NonEmptyArray<EDBlank> = [
  {
    _ED: 'blank',
  },
];

export type EDElement = EDParagraph | EDVerbatim | EDBlank;
export const examplesEDElement: NonEmptyArray<EDElement> = [
  {
    _ED: 'paragraph',
    lines: ['it is indeed cool', 'maybe the best package ever'],
  },
  {
    _ED: 'blank',
  },
  {
    _ED: 'verbatim',
    lines: asciiArt,
  },
];

export type ExtendedDescription = Array<EDElement>;
export const examplesExtendedDescription: NonEmptyArray<ExtendedDescription> = [
  [
    {
      _ED: 'paragraph',
      lines: ['it is indeed cool', 'maybe the best package ever'],
    },
    {
      _ED: 'blank',
    },
    {
      _ED: 'verbatim',
      lines: asciiArt,
    },
  ],
];

export function* fromEDLinesG(lines: Array<string>): Generator<EDElement, void, unknown> {
  let current: EDElement | null = null;
  for (const line of lines) {
    if (line === ' .') {
      if (current !== null) {
        yield current;
      }
      yield { _ED: 'blank' };
      current = null;
    } else if (line.startsWith(' .')) {
      if (current !== null) {
        yield current;
        current = null;
      }
      /* ignore future expansion */
    } else if (line.startsWith('  ')) {
      if (current === null) {
        current = {
          _ED: 'verbatim',
          lines: [line],
        };
      } else {
        if (current._ED === 'verbatim') {
          current.lines.push(line);
        } else {
          yield current;
          current = {
            _ED: 'verbatim',
            lines: [line],
          };
        }
      }
    } else if (line.startsWith(' ')) {
      if (current === null) {
        current = {
          _ED: 'paragraph',
          lines: [line],
        };
      } else {
        if (current._ED === 'paragraph') {
          current.lines.push(line);
        } else {
          yield current;
          current = {
            _ED: 'paragraph',
            lines: [line],
          };
        }
      }
    } else {
      console.warn(`invalid description line "${line}"`);
    }
  }
  if (current !== null) {
    yield current;
  }
}

export function fromEDLines(lines: Array<string>): Array<EDElement> {
  return Array.from(fromEDLinesG(lines));
}
