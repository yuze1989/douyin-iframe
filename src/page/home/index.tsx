import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { getUrlOption } from 'utils';
import UserManage from './components/userManage';
import UserInformation from './components/UserInformation';

const { TabPane } = Tabs;
const Home = () => {
  const [tabKey, setTabKey] = useState<string>('1');
  const urlParams = getUrlOption(window.location.href);
  const openId = localStorage.getItem('openId') || urlParams?.openId;
  console.log(openId, 'openId');
  const goTabs = (key:string) => {
    setTabKey(key);
  };
  return (
    <Card
      title={urlParams?.channel === '3332' ? '抖音获客' : ''}
      style={{ margin: '2rem 2rem 0' }}
    >
      {
        urlParams?.channel !== '3332' && (
          <Tabs activeKey={tabKey} onTabClick={(key) => goTabs(key)} tabBarStyle={{ padding: '0 2rem' }}>
            <TabPane tab="用户管理" key="1" />
            <TabPane tab="账号信息" key="2" />
          </Tabs>
        )
      }
      {tabKey === '1' && <UserManage openId={openId} />}
      {tabKey === '2' && <UserInformation openId={openId} />}
    </Card>
  );
};

export default Home;
