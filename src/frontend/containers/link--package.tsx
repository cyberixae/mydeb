import { Link } from 'react-router-dom';

import { PackageId } from '../../types/package-id';

export type PackageLinkProps = {
  readonly packageId: PackageId;
  readonly children: React.ReactNode;
};

export const PackageLink: React.FC<PackageLinkProps> = ({ packageId, children }) => {
  return <Link to={`/package/${packageId}`}>{children}</Link>;
};
