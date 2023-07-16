import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Hello } from './hello';
import { Deb, debLoader } from './deb';
import { DebIndex, debIndexLoader } from './deb-index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Hello />,
  },
  {
    path: 'package/:packageId',
    element: <Deb />,
    loader: debLoader
  },
  {
    path: 'package',
    element: <DebIndex />,
    loader: debIndexLoader
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
