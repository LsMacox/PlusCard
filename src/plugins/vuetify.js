import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import i18n from '@/i18n'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import '@/styles/main.sass'

import { ICONIFY_ICONS } from '@/plugins/iconify'

Vue.use(Vuetify)

function IconifyIconWrap (id) {
  return {
    component: 'IconifyIcon',
    props: {
      icon: id,
    },
  }
}

function LoadIconifyIcons (iconList) {
  const icons = {}
  for (const icon of iconList) {
      const name = `iconify_${icon.id}`
      icons[name] = IconifyIconWrap(icon.id)
  }
  return icons
}

const options = {
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'fa',
    values: {
      delete: IconifyIconWrap('ion-close', 14),
      ...LoadIconifyIcons(ICONIFY_ICONS),
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#4776E6',
        secondary: '#4776E6',
        accent: '#9C27b0',
        info: '#00CAE3',
        warning: '',
        success: '#00D15D',
        error: '#EA4C2A',
      },
    },
  },
}

export default new Vuetify({
  // The provided global preset is first merged with defaults
  // preset,
  // User options are then merged, overwriting defaults and the global preset
  ...options,
})
