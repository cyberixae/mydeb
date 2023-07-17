
import type { PackageInfoTable } from './package-info-table';
import type { ReverseLookupTable } from './reverse-lookup-table';

import * as PackageInfoTable_ from './package-info-table';
import * as ReverseLookupTable_ from './reverse-lookup-table';

type Model = {
  infos: PackageInfoTable;
  reverse: ReverseLookupTable;
};

export async function model(lines: AsyncIterable<string>): Promise<Model> {
  const infos = await PackageInfoTable_.fromLines(lines);
  const reverse = await ReverseLookupTable_.fromPackageInfoTable(infos);
  return {
    infos,
    reverse,
  };
}
