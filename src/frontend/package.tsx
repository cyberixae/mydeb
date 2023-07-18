import React from 'react';
import { useLoaderData, LoaderFunction, Params } from 'react-router-dom';
import './app.css';
import type { PackageId } from '../types/package-id';
import type { PackageResponse } from '../types/endpoints/package';
import * as api from './api';
import { Header } from '../components/app-header';
import { FrontPageLink } from './containers/link--front-page';
import { PackageLink } from './containers/link--package';
import { ExtendedDescriptionText } from '../components/extended-description-text';
import { DependenciesList } from '../components/dependencies-list';
import { PackageList } from '../components/package-list';

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
      <Header FrontPageLink={FrontPageLink} />
      <br />
      <h2>{pkg.info.packageId}</h2>
      <br />
      <div>{pkg.info.description.synopsis}</div>
      <br />
      <ExtendedDescriptionText extendedDescription={pkg.info.description.extended} />
      <br />
      <div>
        Dependencies:{' '}
        <DependenciesList
          dependencies={pkg.info.dependencies}
          availability={pkg.available}
          PackageLink={PackageLink}
        />
      </div>
      <br />
      <div>
        Reverse: <PackageList packages={pkg.reverse} PackageLink={PackageLink} />
      </div>
    </div>
  );
};
