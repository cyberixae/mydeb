
import { PackageId } from '../package-id'
import { PackageInfo } from '../package-info'

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
