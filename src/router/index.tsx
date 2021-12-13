import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from 'utils/reactUtil';
import routeConfig from './routerConfig';

const baseName = process.env.PUBLIC_URL || '';
const Router = () => (
  <BrowserRouter basename={baseName}>
    <Routes>
      {routes(routeConfig)}
    </Routes>
  </BrowserRouter>
);

export default Router;
