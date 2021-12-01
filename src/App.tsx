import React from 'react';
import DouyinISV from 'douyin-isv';
import Router from 'router/index';
import http from 'utils/http';
import { getUrlOption } from 'utils';

const douyinISV = new DouyinISV();
const getAuth = async () => {
  const code = await douyinISV.getAuth({
    scope: 'user_info,video.list,mobile_alert',
  });
  console.log('code', code);
  if (code) {
    const authInfo = await http.get('/social/douyin/api-callback/author', { code });
    if (authInfo.success) {
      alert('授权成功');
    }
  }
};

const App = () => {
  const urlParams = getUrlOption(window.location.href);
  // !!urlParams?.channel: 其他环境; !urlParams?.channel: 抖音环境
  if (!urlParams?.channel) {
    getAuth();
  }
  return (
    <Router />
  );
};

export default App;
