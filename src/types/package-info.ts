import type { PackageId } from './package-id'; 
import type { Description } from './description'; 
import type { Dependencies } from './dependencies'; 
import type { InstallationStatus } from './installation-status'; 

export type PackageInfo = {
  readonly packageId: PackageId;
  readonly description: Description;
  readonly dependencies: Dependencies;
  readonly installationStatus: InstallationStatus;
};
