import './app.css';

import React from 'react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';

import { Header } from '../components/app-header';
import { PackageList } from '../components/package-list';
import { PackagePluralResponse } from '../types/endpoints/package-plural';
import * as api from './api';
import { FrontPageLink } from './containers/link--front-page';
import { PackageLink } from './containers/link--package';

export const packageIndexLoader: LoaderFunction = async function (_args) {
  const res = await api.fetchPackages();
  return { res };
};

type ViewData = {
  res: PackagePluralResponse;
};
function useViewData(): ViewData {
  return useLoaderData() as any;
}

export const PackageIndex: React.FC<unknown> = () => {
  const {
    res: { packages },
  } = useViewData();

  return (
    <div>
      <Header FrontPageLink={FrontPageLink} />
      <br />
      <PackageList
        packages={packages.map(({ packageId }) => packageId)}
        PackageLink={PackageLink}
      />
    </div>
  );
};
