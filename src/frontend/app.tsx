import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Package, packageLoader } from './package';
import { PackageIndex, packageIndexLoader } from './package-index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PackageIndex />,
    loader: packageIndexLoader,
  },
  {
    path: 'package/:packageId',
    element: <Package />,
    loader: packageLoader,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
