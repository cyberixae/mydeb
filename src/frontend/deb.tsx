import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';

export async function debLoader({ params }: any) {
  const url = `/api/package/${params.packageId}`;
  const res = await fetch(url);
  const deb = await res.json();
  return { deb };
}

export function Deb() {
  const { deb }: any = useLoaderData();

  console.log(deb);

  return (
    <div>
      <h2>{deb['Package']}</h2>
      <br />
      <div>Description: {deb['Description']}</div>
      <br />
      <div>
        Dependencies:{' '}
        {deb['Depends']?.split(', ').map((alternatives: string) =>
          alternatives.split(' | ').map((alternative) => {
            const [name, ...extra] = alternative.split(' ');
            const avail = deb['mydeb_available'][name];
            return (
              <span>
                {avail ? <a href={`/package/${name}`}>{name}</a> : name} {extra.join(' ')}
                ,{' '}
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
