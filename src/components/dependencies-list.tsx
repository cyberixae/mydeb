import React from 'react';

import { Dependencies } from '../types/dependencies';
import { DepAvailability } from '../types/endpoints/package';
import { PackageId } from '../types/package-id';

interface DependenciesListProps {
  readonly dependencies: Dependencies;
  readonly availability: DepAvailability;
  readonly PackageLink: React.FC<{ packageId: PackageId; children: React.ReactNode }>;
}

export const DependenciesList: React.FC<DependenciesListProps> = (props) => {
  const { dependencies } = props;

  if (dependencies.length === 0) {
    return <i>no dependencies</i>;
  }

  return (
    <>
      {dependencies.map((alternatives, i1) => (
        <React.Fragment key={i1}>
          {i1 > 0 ? ', ' : ''}
          {alternatives.map((id, i2) => {
            const avail = props.availability[id];
            return (
              <span key={i2}>
                {i2 > 0 ? ' | ' : ''}
                {avail ? <props.PackageLink packageId={id}>{id}</props.PackageLink> : id}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};
