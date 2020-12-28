import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import i18n from '@/i18n'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

import '@/styles/main.sass'

import { ICONIFY_ICONS } from '@/plugins/iconify'
import { CUSTOM_ICONS } from '@/plugins/icons'

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
  for (const icon in iconList) {
      const name = `iconify_${icon}`
      // console.log('LoadIconifyIcons',name)
      icons[name] = IconifyIconWrap(icon)
  }
  return icons
}

function LoadSvgIcons (iconList) {
  const icons = {}
  for (const icon in iconList) {
      const name = `icons_${icon}`
      // console.log('LoadIconifyIcons',name)
      icons[name] = {
        component: 'inline-svg',
        props: {
          src: iconList[icon],
          // customClassName: 'simple-svg v-icon--is-component theme--light',
        },
      }
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
      delete: IconifyIconWrap('ion-close'),
      ...LoadIconifyIcons(ICONIFY_ICONS),
      ...LoadSvgIcons(CUSTOM_ICONS),
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#4776E6',
        secondary: '#8E54E9',
        accent: '#9C27b0',
        info: '#00CAE3',
        warning: 'FFA338',
        success: '#00D15D',
        error: '#EA4C2A',

        // plus color
        'success-500': '#00D15D',
        'warning-500': '#FFA338',
        'error-500': '#EA4C2A',

        'primary-base': '#4776E6',
        'primary-100': '#EBF1FF',
        'primary-700': '#C7D7FF',
        'primary-600': '#E0E9FF',
        'secondary-100': '#F3EBFF',
        'neutral-900': '#2A2A34',
        'neutral-900_50': '#2A2A34', // rgba(42, 42, 52, 0.5)
        'neutral-700': '#70707D',
        'neutral-600': '#9191A1',
        'neutral-500': '#B5B5C4',
        'neutral-400': '#D7D7E0',
        'neutral-300': '#E8E8ED',
        'neutral-250': '#f2f2f7',
        'neutral-100': '#ffffff',
        'chart-500': '#95C5DA',

        // brand color
        'logo-vk': '#4a76a8',
        'logo-youtube': '#ff0000',
        'logo-facebook': '#3b5998',
        'logo-instagram': '#c32aa3',
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
