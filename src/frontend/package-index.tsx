import React from 'react';
import { useLoaderData, LoaderFunction, Params } from 'react-router-dom';
import './app.css';
import { PackagesResponse } from '../types/status';

async function fetchPackages(): Promise<unknown> {
  const url = `/api/package`;
  const res = await fetch(url);
  return res.json();
}

export const packageIndexLoader: LoaderFunction = async function (_args) {
  const res = await fetchPackages();
  return { res };
};

type ViewData = {
  res: PackagesResponse;
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
        .map((pkg) => (
          <span id={pkg.packageId}>
            <a href={`/package/${pkg.packageId}`}>{pkg.packageId}</a>,{' '}
          </span>
        ))}
    </div>
  );
};
