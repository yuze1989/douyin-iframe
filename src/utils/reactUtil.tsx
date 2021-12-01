import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

/**
 * 根据路由配置生成相应路由
 * @param {array} routeConfig 路由配置
 * @param {string} parentPath 父级路由
 */
interface RouteType {
  path: string;
  component: React.FC | React.ComponentClass;
  name?: string;
  exact?: string;
  children?: RouteType[];
}
export const routes = (routeConfig: RouteType[], parentPath = '') => {
  if (!routeConfig || routeConfig.length === 0) return null;
  return routeConfig.map((route: any) => (
    <Route
      path={route.path}
      key={parentPath + route.path}
      element={(
        <Suspense
          fallback={
            <div className="x-loading-center">...</div>
          }
        >
          <route.component />
        </Suspense>
      )}
    >
      {route.children && routes(route.children)}
    </Route>
  ));
};

export const other = () => { };
