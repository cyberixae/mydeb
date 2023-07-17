
import type { Struct } from './struct'

export type InstallationStatus = boolean;

export function fromStruct(struct: Struct): InstallationStatus {
  const values = struct['Status'];
  if (values.length === 1) {
    const [value] = values;
    return value.endsWith(' installed');
  }
  throw new Error('Unexpected multiline Status field');
}
