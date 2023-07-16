import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Hello } from './hello';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Hello />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
