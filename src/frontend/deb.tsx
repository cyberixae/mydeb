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
      <h2>{deb.info.name}</h2>
      <br />
      <div>Description: {deb.info.description}</div>
      <br />
      <div>
        Dependencies:{' '}
        {deb.info.depends.map((alternatives: Array<string>) =>
          alternatives.map((name) => {
            const avail = deb['available'][name];
            return (
              <span>{avail ? <a href={`/package/${name}`}>{name}</a> : name}, </span>
            );
          }),
        )}
      </div>
      <br />
      <div>
        Reverse:{' '}
        {deb.reverse.map((name: string) => {
          return <span>{<a href={`/package/${name}`}>{name}</a>}, </span>;
        })}
      </div>
    </div>
  );
}
