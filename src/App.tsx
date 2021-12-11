import React from 'react';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import DouyinISV from 'douyin-isv';
import Router from 'router/index';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import Empty from 'assets/empty.png';
import 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale/zh_CN';

moment.locale('zh-cn');
const douyinISV = new DouyinISV();
const getAuth = async () => {
  const code = await douyinISV.getAuth({
    scope: 'user_info,video.list,mobile_alert',
  });
  console.log('code', code);
  if (code) {
    const authInfo = await http.get('/social/douyin/api-callback/author', { code });
    if (authInfo.success) {
      console.log('授权成功');
      localStorage.setItem('openId', authInfo.data);
    }
  }
};

const App = () => {
  const urlParams = getUrlOption(window.location.href);
  // !!urlParams?.channel: 其他环境; !urlParams?.channel: 抖音环境
  if (!urlParams?.channel) {
    getAuth();
  }
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <img src={Empty} alt="" width="86" />
      <p>暂无数据</p>
    </div>
  );
  return (
    <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
      <Router />
    </ConfigProvider>
  );
};

export default App;
