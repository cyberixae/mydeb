import { PackageId } from '../../types/package-id';
import { PackageInfo } from '../../types/package-info';
import * as PackageInfos_ from '../../types/package-infos';

export type PackageInfoTable = Record<PackageId, PackageInfo>;

export async function fromLines(lines: AsyncIterable<string>): Promise<PackageInfoTable> {
  const infos = await PackageInfos_.fromLines(lines);

  return Object.fromEntries(
    infos.map((info): [PackageId, PackageInfo] => [info.packageId, info]),
  );
}
