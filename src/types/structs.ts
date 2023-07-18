import * as Array_ from '../lib/array';
import { Struct, StructKey, StructValue } from './struct';

function readStructKeyValue(line: string): [StructKey, StructValue] {
  const [k, v] = line.split(': ');
  if (typeof k !== 'string') {
    throw new Error('Invalid struct key');
  }
  return [k, v ?? String()];
}

export type StructsG = AsyncGenerator<Struct, void, unknown>;

export async function* fromLinesG(lines: AsyncIterable<string>): StructsG {
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

export type Structs = Array<Struct>;

export async function fromLines(lines: AsyncIterable<string>): Promise<Structs> {
  return Array_.fromAsync(fromLinesG(lines));
}
