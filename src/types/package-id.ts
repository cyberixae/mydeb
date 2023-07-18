import type { NonEmptyArray } from '../lib/non-empty-array';
import type { Struct } from './struct';

export type PackageId = string;
export const examplesPackageId: NonEmptyArray<PackageId> = ['test123'];

export function isPackageId(u: unknown): u is PackageId {
  return typeof u === 'string';
}

export function fromStruct(struct: Struct): PackageId {
  const values = struct['Package'];
  if (values.length === 1) {
    const [value] = values;
    return value;
  }
  throw new Error('Unexpected multiline Package field');
}
