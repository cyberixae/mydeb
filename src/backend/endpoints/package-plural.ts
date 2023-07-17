import type { PackagePluralResponse } from '../../types/endpoints/package-plural';
import type { PackageInfo } from '../../types/package-info';
import type { Model } from '../model/model';

export function main(db: Model): PackagePluralResponse {
  const entries: Array<PackageInfo> = Object.values(db.infos);
  const response: PackagePluralResponse = {
    packages: entries.filter((info: PackageInfo) => info.installationStatus),
  };

  return response;
}
