import './app.css';

import React from 'react';
import { LoaderFunction, Params, useLoaderData } from 'react-router-dom';

import { Header } from '../components/app-header';
import { DependenciesList } from '../components/dependencies-list';
import { ExtendedDescriptionText } from '../components/extended-description-text';
import { PackageList } from '../components/package-list';
import type { PackageResponse } from '../types/endpoints/package';
import type { PackageId } from '../types/package-id';
import { isPackageId } from '../types/package-id';
import * as api from './api';
import { FrontPageLink } from './containers/link--front-page';
import { PackageLink } from './containers/link--package';

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

  let res;
  try {
    res = await api.fetchPackage(packageId);
  } catch {
    res = null;
  }

  return {
    res,
  };
};

type ViewData = {
  res: PackageResponse | null;
};
function useViewData(): ViewData {
  return useLoaderData() as any;
}

export const Package: React.FC<unknown> = () => {
  const { res } = useViewData();

  if (res === null) {
    return (
      <div>
        <div>
          <Header FrontPageLink={FrontPageLink} />
          <br />
          <br />
          <br />
          <h2 style={{ textAlign: 'center' }}>404 Unknown package</h2>
          <br />
          <br />
          <p style={{ textAlign: 'center' }}>
            <FrontPageLink>package listing</FrontPageLink>
          </p>
        </div>
      </div>
    );
  }

  const { pkg } = res;

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
