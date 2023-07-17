import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';
import { EDElement } from '../types/status';

function absurdElement(elem: never): never {
  throw new Error('absurd element');
}

export async function packageLoader({ params }: any) {
  const url = `/api/package/${params.packageId}`;
  const res = await fetch(url);
  const pkg = await res.json();
  return { pkg };
}

export function Package() {
  const { pkg }: any = useLoaderData();

  console.log(pkg);

  return (
    <div>
      <h1>
        <a href="/">MyDeb</a>
      </h1>
      <br />
      <h2>{pkg.info.name}</h2>
      <br />
      <div>{pkg.info.description.synopsis}</div>
      <br />
      <div>
        {pkg.info.description.extended.map((elem: EDElement, i: number) => (
          <React.Fragment key={i}>
            {(() => {
              if (elem._ED === 'blank') {
                return <br />;
              }
              if (elem._ED === 'verbatim') {
                return <pre>{elem.lines.join('\n')}</pre>;
              }
              if (elem._ED === 'paragraph') {
                return <p>{elem.lines.join('\n')}</p>;
              }
              return absurdElement(elem);
            })()}
          </React.Fragment>
        ))}
      </div>
      <br />
      <div>
        Dependencies:{' '}
        {pkg.info.depends.map((alternatives: Array<string>) =>
          alternatives.map((name) => {
            const avail = pkg['available'][name];
            return (
              <span>{avail ? <a href={`/package/${name}`}>{name}</a> : name}, </span>
            );
          }),
        )}
      </div>
      <br />
      <div>
        Reverse:{' '}
        {pkg.reverse.map((name: string) => {
          return <span>{<a href={`/package/${name}`}>{name}</a>}, </span>;
        })}
      </div>
    </div>
  );
}
