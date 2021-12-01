import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  console.log('占位');
  return (
    <>
      layout
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
