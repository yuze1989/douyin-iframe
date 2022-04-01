import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { getUrlOption } from 'utils';
import { useLocation } from 'react-router-dom';
import { IObjectKeys } from 'types/public';
import UserManage from './components/userManage';
import UserActiveSetting from './components/UserActiveSetting';
// import UserInformation from './components/UserInformation';

const { TabPane } = Tabs;
const Home = () => {
  const { state } = useLocation();
  const [tabKey, setTabKey] = useState(state?.tabKey || '1');
  const urlParams = getUrlOption(window.location.href);
  const channel = urlParams?.channel || localStorage.getItem('channel');
  const openId = localStorage.getItem('openId') || urlParams?.openId;
  // localStorage.setItem('openId', openId);
  const goTabs = (key: string) => {
    setTabKey(key);
  };
  return (
    <Card
      bordered={false}
      title={channel ? '蓝V获客' : ''}
      style={{ margin: '2rem 2rem 0' }}
      headStyle={{ border: 'none' }}
    >
      {/* {!urlParams?.channel && (
        <Tabs
          activeKey={tabKey}
          onTabClick={(key) => goTabs(key)}
          tabBarStyle={{ padding: '0 2rem' }}
        >
          <TabPane tab="用户管理" key="1" />
          <TabPane tab="互动方案设置" key="2" />
          <TabPane tab="账号信息" key="3" />
        </Tabs>
      )} */}
      <Tabs
        activeKey={tabKey}
        onTabClick={(key) => goTabs(key)}
        tabBarStyle={{ padding: '0 2rem' }}
      >
        <TabPane tab="互动获客记录" key="1" />
        <TabPane tab="互动方案设置" key="2" />
        {/* <TabPane tab="账号信息" key="3" /> */}
      </Tabs>
      {tabKey === '1' && <UserManage openId={openId} />}
      {tabKey === '2' && <UserActiveSetting />}
      {/* {tabKey === '3' && <UserInformation openId={openId} />} */}
    </Card>
  );
};

export default Home;
