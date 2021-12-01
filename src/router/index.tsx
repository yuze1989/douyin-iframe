import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from 'utils/reactUtil';
import routeConfig from './routerConfig';

const Router = () => (
  <BrowserRouter>
    <Routes>
      {routes(routeConfig)}
    </Routes>
  </BrowserRouter>
);

export default Router;
