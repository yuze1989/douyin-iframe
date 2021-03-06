import React, { useEffect } from 'react';
import { ConfigProvider, message } from 'antd';
import moment from 'moment';
import DouyinISV from 'douyin-isv';
import Router from 'router/index';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import Empty from 'assets/empty.png';
import 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale/zh_CN';

moment.locale('zh-cn');
const douyinISV = new DouyinISV({ debug: true });
const getAuth = async () => {
  // 获取scope权限
  const scope = await http.get('social/api-application/get/douyin_app', {});
  if (scope?.data) {
    console.log('scope', scope, scope.data);
    const response = await douyinISV.getAuth({ scope: scope.data });
    console.log('response', response, response.code);
    if (response?.code) {
      const authInfo = await http.get('/social/douyin/api-callback/author', { code: response?.code });
      if (authInfo?.success) {
        localStorage.setItem('openId', authInfo.data);
        window.location.reload();
      }
    }
  }
};

const App = () => {
  const urlParams = getUrlOption(window.location.href);
  const channel = urlParams?.channel || localStorage.getItem('channel');
  const openId = urlParams?.openId || localStorage.getItem('openId');
  if (!openId) {
    getAuth();
  } else {
    localStorage.setItem('channel', channel);
    localStorage.setItem('openId', openId);
  }
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <img src={Empty} alt="" width="86" />
      <p>暂无数据</p>
    </div>
  );
  useEffect(() => {
  });
  return (
    <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
      <Router />
    </ConfigProvider>
  );
};

export default App;
