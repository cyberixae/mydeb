import type { PackageInfo } from './package-info';

import * as Array_ from '../lib/array';

import * as Struct_ from './struct';
import * as PackageId_ from './package-id';
import * as Description_ from './description';
import * as Dependencies_ from './dependencies';
import * as InstallationStatus_ from './installation-status';

export type PackageInfosG = AsyncGenerator<PackageInfo, void, unknown>;

export async function* fromLinesG(lines: AsyncIterable<string>): PackageInfosG {
  for await (const struct of Struct_.fromLinesG(lines)) {
    const info: PackageInfo = {
      packageId: PackageId_.fromStruct(struct),
      description: Description_.fromStruct(struct),
      dependencies: Dependencies_.fromStruct(struct),
      installationStatus: InstallationStatus_.fromStruct(struct),
    };
    yield info;
  }
}

export type PackageInfos = Array<PackageInfo>;

export async function fromLines(lines: AsyncIterable<string>): Promise<PackageInfos> {
  return Array_.fromAsync(fromLinesG(lines));
}
