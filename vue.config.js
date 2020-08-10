module.exports = {
  devServer: {
    disableHostCheck: true,
    compress: true,
    historyApiFallback: true,
    noInfo: true,
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
