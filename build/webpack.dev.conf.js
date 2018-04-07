'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')


const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
// 添加axois 创建一个express服务器通过它发送请求
const axios = require('axios')
const express=require('express')
const app = express()
const apiRoutes = express.Router()
app.use('/api', apiRoutes)





const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)



const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // // 通过传入一些配置来获取rules配置，此处传入了sourceMap: false,表示不生成sourceMap
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息，
    // 如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐。 改成'none'即可
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代重写路径
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // 启用 webpack 的模块热替换特性：
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
    // 默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录：
    contentBase: false, // since we use CopyWebpackPlugin.
    // 一切服务都启用gzip 压缩：
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    // open 这个参数就是打开自启服务器的原因
    open: config.dev.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加。默认情况下禁用。
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 此路径下的打包文件可在浏览器中访问。
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app){
      app.get('/api/getDiscList', function (req, res) {
        // console.log(123)
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

