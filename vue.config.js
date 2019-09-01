const webpack = require('webpack')
let env = {}
if (process.env.NODE_DEPLOY !== 'production') {
  env = require('./env')
}

module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: env.proxy
  },
  configureWebpack: (config) => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.host': getDeployConfigDefine()
      })
    ]
  })
}
// deploy config converter
function getDeployConfigDefine() {
  let config = {}
  Object.keys(env).forEach(function(key) {
    config[key] = `'${env[key].api}'`
  })
  return config
}
