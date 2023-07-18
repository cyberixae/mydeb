import React from 'react';
import { Link, useLoaderData, LoaderFunction } from 'react-router-dom';
import './app.css';
import { PackagePluralResponse } from '../types/endpoints/package-plural';
import * as api from './api';

export const packageIndexLoader: LoaderFunction = async function (_args) {
  const res = await api.fetchPackages();
  return { res };
};

type ViewData = {
  res: PackagePluralResponse;
};
function useViewData(): ViewData {
  return useLoaderData() as any;
}

export const PackageIndex: React.FC<unknown> = () => {
  const {
    res: { packages },
  } = useViewData();

  return (
    <div>
      <h1>MyDeb</h1>
      <br />
      {packages
        .sort((a, b) => (a.packageId > b.packageId ? 1 : -1))
        .map((pkg, i) => (
          <span key={pkg.packageId}>
            {i > 0 ? ', ' : ''}
            <Link to={`/package/${pkg.packageId}`}>{pkg.packageId}</Link>
          </span>
        ))}
    </div>
  );
};
