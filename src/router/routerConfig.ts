import { lazy } from 'react';

const BasicLayout = lazy(() => import(/* webpackChunkName: 'BasicLayout' */ 'layout/index'));
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ 'page/home')); // 首页

const routes = [
  {
    path: '',
    component: BasicLayout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        title: '首页-抖音',
      },
    ],
  },
];

export default routes;
