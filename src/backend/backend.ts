import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Name, Info, Description, EDElement } from '../types/status';

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

async function main() {
  const TAG = 'NEXT';

  const file = path.join(__dirname, '../../private/status.real');
  const data = await fs.readFile(file, 'utf-8');

  const rawEntries = data.split('\n\n');
  const db = Object.fromEntries(
    rawEntries.flatMap((rawEntry): Array<[Name, Info]> => {
      const rawLines = rawEntry.split('\n ').join(TAG.concat(' ')).split('\n');
      const entries = rawLines.map((rawLine) => rawLine.split(': '));
      const entry = Object.fromEntries(entries);
      const name = entry['Package'];

      if (typeof name === 'undefined') {
        return [];
      }

      const status = entry['Status'];

      const [synopsis, ...ext] = entry['Description'].split(TAG);

      const description: Description = {
        synopsis,
        extended: Array.from(descriptionElements(ext)),
      };

      const depends =
        entry['Depends']?.split(', ').map((alternatives: string) =>
          alternatives.split(' | ').map((alternative) => {
            const [name] = alternative.split(' ');
            return name;
          }),
        ) ?? [];

      const info: Info = {
        name,
        status,
        description,
        depends,
      };
      return [[info.name, info]];
    }),
  );

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
