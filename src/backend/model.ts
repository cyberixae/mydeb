import {
  PackageId,
} from '../types/package-id';
import {
  PackageInfo,
} from '../types/package-info';
import { Line } from './lib/file';
import * as Record_ from '../lib/record';
import * as PackageInfos_ from '../types/package-infos';

type PackageInfoTable = Record<PackageId, PackageInfo>;

async function infoTableFromLines(lines: AsyncIterable<Line>): Promise<PackageInfoTable> {
  const infos = await PackageInfos_.fromLines(lines);

  return Object.fromEntries(
    infos.map((info): [PackageId, PackageInfo] => [info.packageId, info]),
  );
}

type ReverseTable = Record<PackageId, Array<PackageId>>;

type Model = {
  infos: PackageInfoTable;
  reverse: ReverseTable;
};

export async function model(lines: AsyncIterable<Line>): Promise<Model> {
  const infos = await infoTableFromLines(lines);

  const reverse: ReverseTable = Record_.collectKeyValuePairs(
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
