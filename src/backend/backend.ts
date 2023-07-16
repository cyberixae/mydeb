import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Info } from '../types/status';

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

async function main() {
  const file = path.join(__dirname, '../../private/status.real');
  const data = await fs.readFile(file, 'utf-8');

  const rawEntries = data.split('\n\n');
  const db = Object.fromEntries(
    rawEntries.flatMap((rawEntry) => {
      const rawLines = rawEntry.split('\n ').join(' ').split('\n');
      const entries = rawLines.map((rawLine) => rawLine.split(': '));
      const entry = Object.fromEntries(entries);
      const info: Info = {
        name: entry['Package'],
        status: entry['Status'],
        description: entry['Description'],
        depends:
          entry['Depends']?.split(', ').map((alternatives: string) =>
            alternatives.split(' | ').map((alternative) => {
              const [name] = alternative.split(' ');
              return name;
            }),
          ) ?? [],
      };
      if (info.name) {
        return [[info.name, info]];
      }
      return [];
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
