/* eslint-disable no-undef */
import { message } from 'antd';
import axios from 'axios';

declare module 'axios' {
  interface AxiosInstance {
    // eslint-disable-next-line no-unused-vars
    (config: AxiosRequestConfig): Promise<any>;
  }
}

const info: {
  [key: string]: any;
} = {
  normal: {
    baseURL: 'https://scrm.juzhunshuyu.com',
  },
  dev: {
    baseURL: 'https://test-scrm.juzhunshuyu.com',
  },
  test: {
    baseURL: 'https://test-scrm.juzhunshuyu.com',
  },
  gray: {
    baseURL: 'https://test-scrm.juzhunshuyu.com',
  },
};
const { baseURL } = (process.env.REACT_APP_ENV && info[process.env.REACT_APP_ENV])
  ? info[process.env.REACT_APP_ENV] : info.normal;
const instance = axios.create({
  baseURL,
});
// 请求拦截添加头部参数等
instance.interceptors.request.use(
  (config) => {
    const globalOptStr = sessionStorage.getItem('globalOpt');
    const globalOpt = !globalOptStr ? {} : JSON.parse(globalOptStr);
    const configTemp = config;
    const token = localStorage.getItem('token');
    const tiktokToken = localStorage.getItem('openId');
    configTemp.headers = {
      'tiktok-token': tiktokToken || '',
    };
    Object.assign(config.headers, globalOpt);
    configTemp.headers.token = token || '';
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    const { errCode, errMessage } = response.data;
    if (errCode === '0480000008') {
      message.error(errMessage);
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    }
    return response.data;
  },
  (error) => Promise.reject(error),
);

const http = {
  post(url: string, data?: object, header?: any) {
    return instance({
      url,
      data,
      headers: header,
      method: 'post',
    });
  },
  get(url: string, params?: object) {
    return instance({
      url,
      params,
      method: 'get',
    });
  },
  postFormData(url: string, data?: object) {
    return instance({
      url,
      data, // formData形式传入
      method: 'post',
    });
  },
};

export default http;
