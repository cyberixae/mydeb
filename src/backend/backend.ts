import express from 'express';
import type { Request, Response } from 'express';

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import {
  InstallationStatus,
  DepAvailability,
  Alternatives,
  Dependencies,
  PackageId,
  PackageInfo,
  Description,
  PackageResponse,
  PackagesResponse,
  EDElement,
} from '../types/status';

type Line = string;

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

function* descriptionElements(lines: Array<Line>): Generator<EDElement, void, unknown> {
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

function readStructKeyValue(line: Line): [StructKey, StructValue] {
  const [k, v] = line.split(': ');
  if (typeof k !== 'string') {
    throw new Error('Invalid struct key');
  }
  return [k, v ?? String()];
}

async function* structsFromLines(
  lines: AsyncIterable<Line>,
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

function packageIdFromStruct(struct: Struct): PackageId {
  const values = struct['Package'];
  if (values.length === 1) {
    const [value] = values;
    return value;
  }
  throw new Error('Unexpected multiline Package field');
}

function installationStatusFromStruct(struct: Struct): InstallationStatus {
  const values = struct['Status'];
  if (values.length === 1) {
    const [value] = values;
    return value.endsWith(' installed');
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

function dependenciesFromStruct(struct: Struct): Dependencies {
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

async function* infosFromLines(
  lines: AsyncIterable<Line>,
): AsyncGenerator<PackageInfo, void, unknown> {
  for await (const struct of structsFromLines(lines)) {
    const info: PackageInfo = {
      packageId: packageIdFromStruct(struct),
      description: descriptionFromStruct(struct),
      dependencies: dependenciesFromStruct(struct),
      installationStatus: installationStatusFromStruct(struct),
    };
    yield info;
  }
}

async function fromAsync<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const values: Array<T> = [];
  for await (const i of iterable) {
    values.push(i);
  }
  return values;
}

type PackageInfoTable = Record<PackageId, PackageInfo>;

async function infoTableFromLines(lines: AsyncIterable<Line>): Promise<PackageInfoTable> {
  const infos = await fromAsync(infosFromLines(lines));

  return Object.fromEntries(
    infos.map((info): [PackageId, PackageInfo] => [info.packageId, info]),
  );
}

type ReverseTable = Record<PackageId, Array<PackageId>>;

type Model = {
  infos: PackageInfoTable;
  reverse: ReverseTable;
};

type FilePath = string;

async function model(lines: AsyncIterable<Line>): Promise<Model> {
  const infos = await infoTableFromLines(lines);

  const reverse: ReverseTable = collect(
    Object.values(infos).flatMap((entry) =>
      entry.dependencies.flatMap((alts) =>
        alts.map((alt: PackageId): [PackageId, PackageId] => [alt, entry.packageId]),
      ),
    ),
  );
  return {
    infos,
    reverse,
  };
}

function linesFromFile(filePath: FilePath): AsyncIterable<Line> {
  const input = fs.createReadStream(filePath);

  const lines = readline.createInterface({
    input,
    crlfDelay: Infinity,
  });

  return lines;
}

type Port = number;

async function main(port: Port, filePath: FilePath): Promise<void> {
  const lines = linesFromFile(filePath);

  const m = await model(lines);

  const app = express();

  app.get('/api/package/:packageId', (req: Request, res: Response) => {
    const { packageId } = req.params;
    const info = m.infos[packageId];

    const available: DepAvailability = Object.fromEntries(
      info.dependencies.flat().map((packageId) => {
        return [packageId, m.infos.hasOwnProperty(packageId)];
      }),
    );

    const response: PackageResponse = {
      pkg: {
        info,
        available,
        reverse: m.reverse[packageId] ?? [],
      },
    };
    res.send(response);
  });

  app.get('/api/package', (_req: Request, res: Response) => {
    const entries: Array<PackageInfo> = Object.values(m.infos);
    const response: PackagesResponse = {
      packages: entries.filter((info: PackageInfo) => info.installationStatus),
    };
    res.send(response);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

const file = path.join(__dirname, '../../private/status.real');

main(3001, file);

export {};
