import React, { useEffect } from 'react';
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
const douyinISV = new DouyinISV({ debug: true });
// const getAuth = async () => {
//   console.log('getAuth-111');
//   const code = await douyinISV.getAuth({
//     scope: 'user_info,video.list,mobile_alert',
//   });
//   console.log('code', code);
//   if (code) {
//     const authInfo = await http.get('/social/douyin/api-callback/author', { code });
//     if (authInfo.success) {
//       console.log('授权成功');
//       localStorage.setItem('openId', authInfo.data);
//     }
//   } else {
//     console.log('没有获取到code');
//   }
//   console.log('为什么跑这里来了');
// };

const getAuth = () => {
  try {
    douyinISV.getAuth({
      // scope: 'user_info,video.list,mobile_alert',
      scope: 'user_info',
    }).then((code) => {
      console.log('success: ', code);
      http.get('/social/douyin/api-callback/author', { code }).then((res) => {
        console.log('授权成功', res);
        localStorage.setItem('openId', res.data);
      }).catch((err) => console.log('err', err));
    }).catch((err) => {
      console.log('error: ', err);
    });
  } catch (error) {
    console.log('catch::::为什么跑这里来了呢？');
  }
  console.log('为什么走这里来了呢？');
};

const App = () => {
  const urlParams = getUrlOption(window.location.href);
  const channel = urlParams?.channel || localStorage.getItem('channel');
  const openId = urlParams?.openId || localStorage.getItem('openId');
  // !!urlParams?.channel: 其他环境; !urlParams?.channel: 抖音环境
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
