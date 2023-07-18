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
    const response = PackageEndpoint_.main(db, packageId);
    if (response === null) {
      res.status(404);
    }
    res.send(response);
  });

  app.get('/api/package', (_req: Request, res: Response) => {
    const response = PackagePluralEndpoint_.main(db);
    res.send(response);
  });

  app.use(express.static('build'));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });

  app.listen(port, () => {
    console.log(`MyDeb backend listening on port ${port}`);
  });
}

const file = path.join(__dirname, '../../private/status.real');

main(8080, file);

export {};
