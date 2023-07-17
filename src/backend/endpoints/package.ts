import type { DepAvailability, PackageResponse } from '../../types/endpoints/package';
import type { PackageId } from '../../types/package-id';
import type { Model } from '../model/model';

export function main(db: Model, packageId: PackageId): PackageResponse {
  const info = db.infos[packageId];

  const available: DepAvailability = Object.fromEntries(
    info.dependencies.flat().map((packageId) => {
      return [packageId, db.infos.hasOwnProperty(packageId)];
    }),
  );

  const response: PackageResponse = {
    pkg: {
      info,
      available,
      reverse: db.reverse[packageId] ?? [],
    },
  };
  return response;
}
