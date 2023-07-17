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
  const packages = await fetchPackages();
  return { packages };
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
  console.log(packages);

  return (
    <div>
      <h1>MyDeb</h1>
      <br />
      {packages
        .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
        .map((pkg: any) => (
          <span id={pkg.name}>
            <a href={`/package/${pkg.name}`}>{pkg.name}</a>,{' '}
          </span>
        ))}
    </div>
  );
};
