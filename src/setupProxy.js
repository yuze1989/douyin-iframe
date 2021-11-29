const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    createProxyMiddleware('/scrm', {
      target: 'https://test-scrm.juzhunshuyu.com/scrm',
      // target: 'http://192.168.30.146:80/scrm',
      // target:'https://cnodejs.org/api',
      changeOrigin: true,
      pathRewrite: {
        '^/scrm': '',
      },
    }),
    createProxyMiddleware('/mall', {
      target: 'https://test-scrm.juzhunshuyu.com/mall',
      // target: 'http://192.168.30.146:80/scrm',
      // target:'https://cnodejs.org/api',
      changeOrigin: true,
      pathRewrite: {
        '^/mall': '',
      },
    }),
  );
};
