import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Hello } from './hello';
import { Deb, debLoader } from './deb';
import { DebIndex, debIndexLoader } from './deb-index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DebIndex />,
    loader: debIndexLoader,
  },
  {
    path: 'package/:packageId',
    element: <Deb />,
    loader: debLoader,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
