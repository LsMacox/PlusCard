
'use strict'
const path = require('path')
const AppConfig = require('./src/config/app.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = AppConfig.title || 'Plus Cabinet' // page title
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    port: port,
    disableHostCheck: true,
    compress: true,
    historyApiFallback: true,
    noInfo: true,
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack: config => {
    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      // https://github.com/vuetifyjs/vuetify-loader
      progressiveImages: false,
      // progressiveImages: {
      //   size: 9, // Use higher-resolution previews  Default: 9
      //   // sharp: true, // Use sharp instead of ImageMagick Default: false
      // },
    }])
  },
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
