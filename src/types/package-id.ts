import type { Struct } from './struct';

export type PackageId = string;

export function fromStruct(struct: Struct): PackageId {
  const values = struct['Package'];
  if (values.length === 1) {
    const [value] = values;
    return value;
  }
  throw new Error('Unexpected multiline Package field');
}
