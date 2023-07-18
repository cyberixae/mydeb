import * as Array_ from '../lib/array';
import * as Dependencies_ from './dependencies';
import * as Description_ from './description';
import * as InstallationStatus_ from './installation-status';
import * as PackageId_ from './package-id';
import type { PackageInfo } from './package-info';
import * as Structs_ from './structs';

export type PackageInfosG = AsyncGenerator<PackageInfo, void, unknown>;

export async function* fromLinesG(lines: AsyncIterable<string>): PackageInfosG {
  for await (const struct of Structs_.fromLinesG(lines)) {
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
