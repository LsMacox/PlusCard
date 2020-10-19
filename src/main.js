// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import AppComponent from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
// import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import './plugins/iconify'

import i18n from './i18n'

import './AuthGuard'

import * as filters from './filters'

import VueSession from './utils/session'
import MessageBox from './components/message-box'
import AppConfig from './config/index'

import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'
import VueClickOutsideDirective from './directives/click-outside.js'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import VueMoment from 'vue-moment'
import VueConstants from './plugins/vue-constants'
import random from 'random'
import VueUnderScore from 'vue-underscore'
// import DateRangePicker from 'vue2-daterange-picker'
import { IsDebugQuery } from './router/router-handler-log'

import VueClipboard from 'vue-clipboard2'

//
// Vue.use(DateRangePicker)

// Load Locales ('en' comes loaded by default)
require('moment/locale/ru')

// Choose Locale
moment.locale('ru')

Vue.use(VueMoment, { moment })
Vue.use(Notifications)
Vue.use(VueConstants)
Vue.use(VueUnderScore)
Vue.use(AppConfig)
Vue.use(MessageBox)
Vue.use(VueClipboard)

const options = {
  // color: '#bffaf3',
  // failedColor: '#874b4b',
  // thickness: '5px',
  // transition: {
  //   speed: '0.2s',
  //   opacity: '0.6s',
  //   termination: 300
  // },
  // autoRevert: true,
  location: 'top',
  inverse: false,
}

Vue.use(VueProgressBar, options)

Vue.config.productionTip = false
Vue.use(VueSession)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Directives
Vue.directive('click-outside', VueClickOutsideDirective)

Object.copy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

Vue.prototype.$IsDebugMode = function () {
  return IsDebugQuery(this.$route)
}
Vue.prototype.$sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

Vue.prototype.$uuid = uuidv4

Vue.prototype.$random = random

if (process.env.NODE_ENV !== 'development') {
  console.info('mute console.log')
  window.console.log = () => { }
}

const App = new Vue({
  router,
  store,
  vuetify,
  i18n,
  async created () {
    // устройство
    await this.$store.dispatch('auth/auth/InitDevice')
  },
  render: h => h(AppComponent),
})

App.$mount('#app')

Vue.prototype.$app = App
