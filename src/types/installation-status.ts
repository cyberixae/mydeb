import type { NonEmptyArray } from '../lib/non-empty-array';
import type { Struct } from './struct';

export type InstallationStatus = boolean;
export const examplesInstallationStatus: NonEmptyArray<InstallationStatus> = [
  true,
  false,
];

export function fromStruct(struct: Struct): InstallationStatus {
  const values = struct['Status'];
  if (values.length === 1) {
    const [value] = values;
    return value.endsWith(' installed');
  }
  throw new Error('Unexpected multiline Status field');
}
