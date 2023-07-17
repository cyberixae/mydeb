import React from 'react';
import { useLoaderData, LoaderFunction, Params } from 'react-router-dom';
import './app.css';
import { EDElement, PackageResponse, PackageDetails, PackageId } from '../types/status';

function absurdElement(_elem: never): never {
  throw new Error('absurd element');
}

function isPackageId(u: unknown): u is PackageId {
  return typeof u === 'string';
}

async function fetchPackage(packageId: PackageId): Promise<PackageResponse> {
  const url = `/api/package/${packageId}`;
  const res = await fetch(url);
  return res.json();
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

  const { pkg } = await fetchPackage(packageId);

  return {
    pkg,
  };
};

type ViewData = {
  pkg: PackageDetails;
};
function useViewData(): ViewData {
  return useLoaderData() as any;
}

export const Package: React.FC<unknown> = () => {
  const { pkg } = useViewData();
  console.log(pkg);

  return (
    <div>
      <h1>
        <a href="/">MyDeb</a>
      </h1>
      <br />
      <h2>{pkg.info.packageId}</h2>
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
        {pkg.info.dependencies.map((alternatives) =>
          alternatives.map((id) => {
            const avail = pkg['available'][id];
            return <span>{avail ? <a href={`/package/${id}`}>{id}</a> : id}, </span>;
          }),
        )}
      </div>
      <br />
      <div>
        Reverse:{' '}
        {pkg.reverse.map((id) => {
          return <span>{<a href={`/package/${id}`}>{id}</a>}, </span>;
        })}
      </div>
    </div>
  );
};
