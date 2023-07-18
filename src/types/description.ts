import type { NonEmptyArray } from '../lib/non-empty-array';

import * as ExtendedDescription_ from '../types/extended-description';
import type { Struct } from './struct';
import type { ExtendedDescription } from './extended-description';

export type Synopsis = string;
export const examplesSynopsis: NonEmptyArray<Synopsis> = ['test123 is cool package'];

export type Description = {
  readonly synopsis: Synopsis;
  readonly extended: ExtendedDescription;
};
export const examplesDescription: NonEmptyArray<Description> = [
  {
    synopsis: 'test123 is cool package',
    extended: [
      {
        _ED: 'paragraph',
        lines: ['it is indeed cool', 'maybe the best package ever'],
      },
    ],
  },
];

export function fromStruct(struct: Struct): Description {
  const [synopsis, ...ext] = struct['Description'];
  const extended = ExtendedDescription_.fromLines(ext);
  return {
    synopsis,
    extended,
  };
}
