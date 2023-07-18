import type { NonEmptyArray } from '../lib/non-empty-array';

import type { PackageId } from './package-id';

import type { Struct } from './struct';

export type Alternatives = Array<PackageId>;

export const examplesAlternatives: NonEmptyArray<Alternatives> = [['test123', 'test456']];

export type Dependencies = Array<Alternatives>;
export const examplesDependencies: NonEmptyArray<Dependencies> = [
  [['test123', 'test456'], ['test789']],
];

export function fromStruct(struct: Struct): Dependencies {
  const values = struct['Depends'];
  if (typeof values === 'undefined') {
    return [];
  }
  if (values.length === 1) {
    const [value] = values;
    return value.split(', ').map(
      (rawAlternatives): Alternatives =>
        rawAlternatives.split(' | ').map((alternative): PackageId => {
          const [packageId] = alternative.split(' ');
          return packageId;
        }),
    );
  }
  throw new Error('Unexpected multiline Depends field');
}
