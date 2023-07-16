import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';

export async function debIndexLoader({ params }: any) {
  const url = `/api/package`;
  const res = await fetch(url);
  const debs = await res.json();
  return { debs };
}

export function DebIndex({}: any) {
  const { debs }: any = useLoaderData();
  console.log(debs);

  return (
    <div>
      <h1>MyDeb</h1>
      <br />
      {debs
        .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
        .map((deb: any) => (
          <span id={deb.name}>
            <a href={`/package/${deb.name}`}>{deb.name}</a>,{' '}
          </span>
        ))}
    </div>
  );
}
