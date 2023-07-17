import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';

export async function packageIndexLoader({ params }: any) {
  const url = `/api/package`;
  const res = await fetch(url);
  const packages = await res.json();
  return { packages };
}

export function PackageIndex({}: any) {
  const { packages }: any = useLoaderData();
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
}
