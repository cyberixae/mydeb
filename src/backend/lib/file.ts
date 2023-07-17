import fs from 'fs';
import readline from 'readline';

export type FilePath = string;
export type Line = string;

export function read(filePath: FilePath): AsyncIterable<Line> {
  const input = fs.createReadStream(filePath);

  const lines = readline.createInterface({
    input,
    crlfDelay: Infinity,
  });

  return lines;
}
