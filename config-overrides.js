/* eslint-disable import/no-extraneous-dependencies */
const {
  override, fixBabelImports, addWebpackAlias, addWebpackPlugin,
} = require('customize-cra');

const path = require('path');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);

// 这里的import使用的是babel-plugin-import依赖，将前缀省略去了，这个依赖需要手动安装，然后会在package.json文件中有体现
module.exports = override(
  addWebpackAlias({
    assets: pathResolve('src/assets'),
    components: pathResolve('src/components'),
    page: pathResolve('src/page'),
    utils: pathResolve('src/utils'),
  }),
  fixBabelImports('import', {
    libraryName: 'antd', // 若是为antd-mobile进行配置，则改为antd-mobile
    libraryDirectory: 'es',
    style: 'css', // 自动打包相关样式
  }),
);
