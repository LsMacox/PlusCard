import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import '@/sass/main.sass'
import '@/sass/plus_ui/overrides.sass'

import { ICONIFY_ICONS } from '@/plugins/iconify'

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

function LoadIconifyIcons (iconList) {
  const icons = {}
  for (const icon of iconList) {
      const name = `iconify_${icon.id}`
      icons[name] = {
        component: 'IconifyIcon',
        props: {
          icon: icon.id,
        },
      }
  }
  console.log('export LoadIconifyIcons', icons)
  return icons
}

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'fa',
    values: {
      ...LoadIconifyIcons(ICONIFY_ICONS),
    },
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
