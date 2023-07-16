import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';
import { EDElement } from '../types/status';

function absurdElement(elem: never): never {
  throw new Error('absurd element')
}

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
      <div>{deb.info.description.synopsis}</div>
      <br />
      <div>{deb.info.description.extended.map((elem: EDElement, i: number) => (<React.Fragment key={i}>{(() => {
        if (elem._ED === 'blank') {
          return <br />
        }
        if (elem._ED === 'verbatim') {
          return <pre>{elem.lines}</pre>
        }
        if (elem._ED === 'paragraph') {
          return <p>{elem.lines}</p>
        }
        return absurdElement(elem)
      })()}</React.Fragment>))}</div>
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
