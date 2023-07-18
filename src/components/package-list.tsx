import React from 'react';

import { PackageId } from '../types/package-id';

interface PackageListProps {
  readonly packages: Array<PackageId>;
  readonly PackageLink: React.FC<{ packageId: PackageId; children: React.ReactNode }>;
}

export const PackageList: React.FC<PackageListProps> = (props) => (
  <>
    {props.packages.sort().map((packageId, i) => (
      <span key={packageId}>
        {i > 0 ? ', ' : ''}
        <props.PackageLink packageId={packageId}>{packageId}</props.PackageLink>
      </span>
    ))}
  </>
);
