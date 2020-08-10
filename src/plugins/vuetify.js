import Vue from 'vue'
import Vuetify from 'pluscards_ui_kit/lib'
import i18n from '@/i18n'
import '@/sass/overrides.sass'
import '@/sass/main.sass'

Vue.use(Vuetify)

const theme = {
  primary: '#4776E6',
  secondary: '#8E54E9',
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
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
