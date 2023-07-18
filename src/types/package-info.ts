import type { NonEmptyArray } from '../lib/non-empty-array';
import type { Dependencies } from './dependencies';
import type { Description } from './description';
import type { InstallationStatus } from './installation-status';
import type { PackageId } from './package-id';

export type PackageInfo = {
  readonly packageId: PackageId;
  readonly description: Description;
  readonly dependencies: Dependencies;
  readonly installationStatus: InstallationStatus;
};

export const examplesPackageInfo: NonEmptyArray<PackageInfo> = [
  {
    packageId: 'test123',
    description: {
      synopsis: 'test123 is cool package',
      extended: [
        {
          _ED: 'paragraph',
          lines: ['it is indeed cool', 'maybe the best package ever'],
        },
      ],
    },
    dependencies: [],
    installationStatus: true,
  },
];
