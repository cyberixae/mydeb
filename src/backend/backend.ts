import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import {
  Status,
  Dependencies,
  Name,
  Info,
  Description,
  EDElement,
} from '../types/status';

function collect<K extends string, V>(kvs: Array<[K, V]>): Record<K, Array<V>> {
  const result: Record<K, Array<V>> = {} as any;
  for (const kv of kvs) {
    const [k, v] = kv;
    if (result.hasOwnProperty(k) === false) {
      result[k] = [];
    }
    result[k].push(v);
  }
  return result;
}

function* descriptionElements(lines: Array<string>): Generator<EDElement, void, unknown> {
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

type StructKey = string;
type StructValue = string;
type Struct = Record<StructKey, Array<StructValue>>;

function readStructKeyValue(line: string): [StructKey, StructValue] {
  const [k, v] = line.split(': ');
  if (typeof k !== 'string') {
    throw new Error('Invalid struct key');
  }
  return [k, v ?? String()];
}

function* structsFromLines(lines: Array<string>): Generator<Struct, void, unknown> {
  let current: Struct | null = null;
  let key: StructKey | null = null;
  for (const line of lines) {
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

function nameFromStruct(struct: Struct): Name {
  const values = struct['Package'];
  if (values.length === 1) {
    const [value] = values;
    return value;
  }
  throw new Error('Unexpected multiline Package field');
}

function statusFromStruct(struct: Struct): Status {
  const values = struct['Status'];
  if (values.length === 1) {
    const [value] = values;
    return value;
  }
  throw new Error('Unexpected multiline Status field');
}

function descriptionFromStruct(struct: Struct): Description {
  const [synopsis, ...ext] = struct['Description'];
  const extended = Array.from(descriptionElements(ext));
  return {
    synopsis,
    extended,
  };
}

function dependsFromStruct(struct: Struct): Dependencies {
  const values = struct['Depends'];
  if (typeof values === 'undefined') {
    return [];
  }
  if (values.length === 1) {
    const [value] = values;
    return value.split(', ').map((alternatives: string) =>
      alternatives.split(' | ').map((alternative) => {
        const [name] = alternative.split(' ');
        return name;
      }),
    );
  }
  throw new Error('Unexpected multiline Depends field');
}

function* infosFromLines(lines: Array<string>): Generator<Info, void, unknown> {
  for (const struct of structsFromLines(lines)) {
    const info: Info = {
      name: nameFromStruct(struct),
      status: statusFromStruct(struct),
      description: descriptionFromStruct(struct),
      depends: dependsFromStruct(struct),
    };
    yield info;
  }
}

async function main() {
  const file = path.join(__dirname, '../../private/status.real');
  const data = await fs.readFile(file, 'utf-8');
  const lines = data.split('\n');
  const infos = Array.from(infosFromLines(lines));

  const db = Object.fromEntries(infos.map((info): [Name, Info] => [info.name, info]));

  const reverse = collect(
    Object.values(db).flatMap((entry) =>
      entry.depends.flatMap((alts) =>
        alts.map((alt: string): [string, string] => [alt, entry.name]),
      ),
    ),
  );

  const app = express();
  const port = 3001;

  app.get('/api', (req: unknown, res: any) => {
    res.send('Hello World!');
  });

  app.get('/api/package/:packageId', (req: any, res: any) => {
    const { packageId } = req.params;
    const info = db[packageId];
    const entry = {
      info,
      available: Object.fromEntries(
        info.depends.flat().map((name) => {
          return [name, db.hasOwnProperty(name)];
        }),
      ),
      reverse: reverse[packageId] ?? [],
    };
    res.send(entry);
  });

  app.get('/api/package', (req: unknown, res: any) => {
    const entries = Object.values(db);
    const installed = entries.filter((info: any) => info.status.endsWith(' installed'));
    res.send(installed);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();

export {};
