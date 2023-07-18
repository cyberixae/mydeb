import type { PackageId } from '../types/package-id';
import { PackageResponse } from '../types/endpoints/package';
import { PackagePluralResponse } from '../types/endpoints/package-plural';

export async function fetchPackages(): Promise<PackagePluralResponse> {
  const url = `/api/package`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPackage(packageId: PackageId): Promise<PackageResponse> {
  const url = `/api/package/${packageId}`;
  const res = await fetch(url);
  if (res.ok) {
    return res.json();
  }
  throw new Error('Failed to retrieve');
}
