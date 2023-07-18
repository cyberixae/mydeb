import React from 'react';
import { Link, useLoaderData, LoaderFunction, Params } from 'react-router-dom';
import './app.css';
import type { Item } from '../types/extended-description';
import type { PackageId } from '../types/package-id';
import type { PackageResponse } from '../types/endpoints/package';
import { absurd } from '../lib/function';
import * as api from './api';

function isPackageId(u: unknown): u is PackageId {
  return typeof u === 'string';
}

type ViewParams = {
  packageId: PackageId;
};

function parseParams(params: Params): ViewParams {
  const { packageId } = params;
  if (isPackageId(packageId)) {
    return { packageId };
  }
  throw new Error('Invalid args');
}

export const packageLoader: LoaderFunction = async function (args) {
  const { packageId } = parseParams(args.params);

  const res = await api.fetchPackage(packageId);

  return {
    res,
  };
};

type ViewData = {
  res: PackageResponse;
};
function useViewData(): ViewData {
  return useLoaderData() as any;
}

export const Package: React.FC<unknown> = () => {
  const {
    res: { pkg },
  } = useViewData();

  return (
    <div>
      <h1>
        <Link to="/">MyDeb</Link>
      </h1>
      <br />
      <h2>{pkg.info.packageId}</h2>
      <br />
      <div>{pkg.info.description.synopsis}</div>
      <br />
      <div>
        {pkg.info.description.extended.map((elem: Item, i: number) => (
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
              return absurd(elem, 'absurd description element');
            })()}
          </React.Fragment>
        ))}
      </div>
      <br />
      <div>
        Dependencies:{' '}
        {pkg.info.dependencies.map((alternatives, i1) => (
          <React.Fragment key={i1}>
            {i1 > 0 ? ', ' : ''}
            {alternatives.map((id, i2) => {
              const avail = pkg['available'][id];
              return (
                <span key={i2}>
                  {i2 > 0 ? ' | ' : ''}
                  {avail ? <Link to={`/package/${id}`}>{id}</Link> : id}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <br />
      <div>
        Reverse:{' '}
        {pkg.reverse.map((id, i) => {
          return (
            <span key={i}>
              {i > 0 ? ', ' : ''}
              {<Link to={`/package/${id}`}>{id}</Link>}
            </span>
          );
        })}
      </div>
    </div>
  );
};
