import type { NonEmptyArray } from '../lib/non-empty-array';

import * as Array_ from '../lib/array';

export type StructKey = string;
export const examplesStructKey: NonEmptyArray<StructKey> = ['Status'];

export type StructValue = string;
export const examplesStructValue: NonEmptyArray<StructValue> = ['install ok installed'];

export type Struct = Record<StructKey, Array<StructValue>>;
export const examplesStruct: NonEmptyArray<Struct> = [
  {
    Package: ['test123'],
    Description: [
      'test123 is cool package',
      ' it is indeed cool',
      ' maybe the best package ever',
    ],
    Depends: ['test456'],
    Status: ['install ok installed'],
    Extra: ['something we do not necessarily care about'],
  },
];

function readStructKeyValue(line: string): [StructKey, StructValue] {
  const [k, v] = line.split(': ');
  if (typeof k !== 'string') {
    throw new Error('Invalid struct key');
  }
  return [k, v ?? String()];
}

export async function* fromLinesG(
  lines: AsyncIterable<string>,
): AsyncGenerator<Struct, void, unknown> {
  let current: Struct | null = null;
  let key: StructKey | null = null;
  for await (const line of lines) {
    if (line === String()) {
      if (current !== null) {
        yield current;
        current = null;
      }
      continue;
    }
    if (current === null) {
      current = {};
    }
    if (key === null) {
      if (line.startsWith(' ')) {
        throw new Error('Invalid struct');
      }
      const [k, v] = readStructKeyValue(line);
      key = k;
      current[key] = [v];
      continue;
    }
    if (line.startsWith(' ')) {
      current[key].push(line);
      continue;
    }
    const [k, v] = readStructKeyValue(line);
    key = k;
    current[key] = [v];
  }
}

export async function fromLines(lines: AsyncIterable<string>): Promise<Array<Struct>> {
  return Array_.fromAsync(fromLinesG(lines));
}
