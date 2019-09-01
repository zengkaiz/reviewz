const hostConfig = require('./hostConfig.' + process.env.NODE_DEPLOY)
// 本地调试代理
module.exports = {
  hostConfig,
  proxy: {
    '/reviewz': {
      target: hostConfig.api,
      changeOrigin: true
      // pathRewrite: {
      //   '/reviewz': ''
      // }
    }
  }
}
