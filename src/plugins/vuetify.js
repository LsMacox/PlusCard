import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import '@/sass/plus_ui/overrides.sass'
import '@/sass/main.sass'

Vue.use(Vuetify)

const theme = {
  primary: '#4776E6',
  secondary: '#4776E6',
  accent: '#9C27b0',
  info: '#00CAE3',
  warning: '',
  success: '#00D15D',
  error: '#EA4C2A',
}

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'fa',
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
