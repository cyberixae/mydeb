import type { NonEmptyArray } from '../../lib/non-empty-array';

import { PackageInfo } from '../package-info';

export type PackagePluralResponse = {
  readonly packages: Array<PackageInfo>;
};

export const examplesPackageResponse: NonEmptyArray<PackagePluralResponse> = [
  {
    packages: [
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
        dependencies: [['test456']],
        installationStatus: true,
      },
      {
        packageId: 'test456',
        description: {
          synopsis: 'test546 might be cooler',
          extended: [],
        },
        dependencies: [],
        installationStatus: true,
      },
    ],
  },
];
