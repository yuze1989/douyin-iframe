import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';

const Layout = () => {
  console.log('占位');
  return (
    <>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
