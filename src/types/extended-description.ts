import type { NonEmptyArray } from '../lib/non-empty-array';

const asciiArt = `
     *
    * *
   * * *
`.split('\n');

export type Paragraph = {
  readonly _ED: 'paragraph';
  readonly lines: Array<string>;
};
export const paragraph = (...lines: Array<string>): Paragraph => ({
  _ED: 'paragraph',
  lines,
});
export const examplesParagraph: NonEmptyArray<Paragraph> = [
  {
    _ED: 'paragraph',
    lines: ['it is indeed cool', 'maybe the best package ever'],
  },
];

export type Verbatim = {
  readonly _ED: 'verbatim';
  readonly lines: Array<string>;
};
export const verbatim = (...lines: Array<string>): Verbatim => ({
  _ED: 'verbatim',
  lines,
});
export const examplesVerbatim: NonEmptyArray<Verbatim> = [
  {
    _ED: 'verbatim',
    lines: asciiArt,
  },
];

export type Blank = {
  readonly _ED: 'blank';
};
export const blank: Blank = {
  _ED: 'blank',
};
export const examplesBlank: NonEmptyArray<Blank> = [
  {
    _ED: 'blank',
  },
];

export type Item = Paragraph | Verbatim | Blank;
export const examplesItem: NonEmptyArray<Item> = [
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

export type ExtendedDescription = Array<Item>;
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

export function* fromLinesG(lines: Array<string>): Generator<Item, void, unknown> {
  let current: Item | null = null;
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

export function fromLines(lines: Array<string>): Array<Item> {
  return Array.from(fromLinesG(lines));
}
