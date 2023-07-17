import { ExtendedDescription } from './extended-description';

import { PackageId } from './package-id'

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

export type PackagesResponse = {
  readonly packages: Array<PackageInfo>;
};
