import type { NonEmptyArray } from '../../lib/non-empty-array';

import { PackageId } from '../package-id';
import { PackageInfo } from '../package-info';

export type ReverseDeps = Array<PackageId>;

export type IsAvailable = boolean;
export type DepAvailability = Record<PackageId, IsAvailable>;

export type PackageDetails = {
  readonly info: PackageInfo;
  readonly reverse: ReverseDeps;
  readonly available: DepAvailability;
};

export type PackageResponse = {
  readonly pkg: PackageDetails;
};

export const examplesPackageResponse: NonEmptyArray<PackageResponse> = [
  {
    pkg: {
      info: {
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
        dependencies: ['test456'],
        installationStatus: true,
      },
      reverse: ['test789'],
      available: {
        test456: true,
      },
    },
  },
];
