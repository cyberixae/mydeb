import * as Record_ from '../../lib/record';
import { tuple } from '../../lib/tuple';
import { PackageId } from '../../types/package-id';
import { PackageInfoTable } from './package-info-table';

export type ReverseLookupTable = Record<PackageId, Array<PackageId>>;

export async function fromPackageInfoTable(
  infos: PackageInfoTable,
): Promise<ReverseLookupTable> {
  const reverse: ReverseLookupTable = Record_.collectKeyValuePairs(
    Object.values(infos).flatMap((info) =>
      info.dependencies.flatMap((alternatives) =>
        alternatives.map((alternative: PackageId) => tuple(alternative, info.packageId)),
      ),
    ),
  );
  return reverse;
}
