
export type EDParagraph = {
  readonly _ED: 'paragraph';
  readonly lines: Array<string>;
};
export type EDVerbatim = {
  readonly _ED: 'verbatim';
  readonly lines: Array<string>;
};
export type EDBlank = {
  readonly _ED: 'blank';
};
export type EDElement = EDParagraph | EDVerbatim | EDBlank;

export type ExtendedDescription = Array<EDElement>;

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
