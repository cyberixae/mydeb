import { PackageId, PackageResponse, PackagesResponse } from '../types/status';

export async function fetchPackages(): Promise<PackagesResponse> {
  const url = `/api/package`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchPackage(packageId: PackageId): Promise<PackageResponse> {
  const url = `/api/package/${packageId}`;
  const res = await fetch(url);
  return res.json();
}
