import express from 'express';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const file = path.join(__dirname, '../../private/status.real');
  const data = await fs.readFile(file, 'utf-8');

  const rawEntries = data.split('\n\n');
  const db = Object.fromEntries(
    rawEntries.flatMap((rawEntry) => {
      const rawLines = rawEntry.split('\n ').join(' ').split('\n');
      const entries = rawLines.map((rawLine) => rawLine.split(': '));
      const entry = Object.fromEntries(entries);
      if (entry.Package) {
        return [[entry.Package, entry]];
      }
      return [];
    }),
  );

  const app = express();
  const port = 3001;

  app.get('/api', (req: unknown, res: any) => {
    res.send('Hello World!');
  });

  app.get('/api/package/:packageId', (req: any, res: any) => {
    const { packageId } = req.params;
    const fields = db[packageId];
    const entry = {
      ...fields,
      mydeb_available: Object.fromEntries(
        (fields['Depends']?.split(', ') ?? []).flatMap((alts: any) =>
          alts.split(' | ').map((alt: any) => {
            const [name] = alt.split(' ');
            return [name, db.hasOwnProperty(name)];
          }),
        ),
      ),
    };
    res.send(entry);
  });

  app.get('/api/package', (req: unknown, res: any) => {
    const entries = Object.values(db);
    const installed = entries.filter((entry: any) =>
      entry['Status'].endsWith(' installed'),
    );
    res.send(installed);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();

export {};
