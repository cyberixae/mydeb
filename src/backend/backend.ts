import express from 'express';
import type { Request, Response } from 'express';

import path from 'path';
import { model } from './model/model';
import { FilePath, read } from './lib/file';

import * as PackageEndpoint_ from './endpoints/package';
import * as PackagePluralEndpoint_ from './endpoints/package-plural';

type Port = number;

async function main(port: Port, filePath: FilePath): Promise<void> {
  const lines = read(filePath);

  const db = await model(lines);

  const app = express();

  app.get('/api/package/:packageId', (req: Request, res: Response) => {
    const { packageId } = req.params;
    res.send(PackageEndpoint_.main(db, packageId));
  });

  app.get('/api/package', (_req: Request, res: Response) => {
    res.send(PackagePluralEndpoint_.main(db));
  });

  app.listen(port, () => {
    console.log(`MyDeb backend listening on port ${port}`);
  });
}

const file = path.join(__dirname, '../../private/status.real');

main(3001, file);

export {};
