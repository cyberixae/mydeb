import React from 'react';
import { Link, useLoaderData, LoaderFunction } from 'react-router-dom';
import { FrontPageLink } from './containers/link--front-page';
import { PackageLink } from './containers/link--package';
import './app.css';
import { PackagePluralResponse } from '../types/endpoints/package-plural';
import * as api from './api';
import { Header } from '../components/app-header';
import { PackageList } from '../components/package-list';

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
