import express from 'express';
import type { Request, Response } from 'express';

import path from 'path';
import {
  DepAvailability,
  PackageResponse,
} from '../types/endpoints/package';
import {
  PackagePluralResponse,
} from '../types/endpoints/package-plural';
import {
  PackageInfo,
} from '../types/package-info';
import { model } from './model/model';
import { FilePath, read } from './lib/file';

type Port = number;

async function main(port: Port, filePath: FilePath): Promise<void> {
  const lines = read(filePath);

  const db = await model(lines);

  const app = express();

  app.get('/api/package/:packageId', (req: Request, res: Response) => {
    const { packageId } = req.params;
    const info = db.infos[packageId];

    const available: DepAvailability = Object.fromEntries(
      info.dependencies.flat().map((packageId) => {
        return [packageId, db.infos.hasOwnProperty(packageId)];
      }),
    );

    const response: PackageResponse = {
      pkg: {
        info,
        available,
        reverse: db.reverse[packageId] ?? [],
      },
    };
    res.send(response);
  });

  app.get('/api/package', (_req: Request, res: Response) => {
    const entries: Array<PackageInfo> = Object.values(db.infos);
    const response: PackagePluralResponse = {
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
