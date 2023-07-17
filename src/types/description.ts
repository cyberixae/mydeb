import * as ExtendedDescription_ from '../types/extended-description';
import type { Struct } from './struct';
import type { ExtendedDescription } from './extended-description';

export type Synopsis = string;

export type Description = {
  readonly synopsis: Synopsis;
  readonly extended: ExtendedDescription;
};

export function fromStruct(struct: Struct): Description {
  const [synopsis, ...ext] = struct['Description'];
  const extended = ExtendedDescription_.fromEDLines(ext);
  return {
    synopsis,
    extended,
  };
}
