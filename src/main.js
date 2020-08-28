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
import App from './App.vue'
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

import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'

import moment from 'moment'
import VueMoment from 'vue-moment'
import VueCostants  from './plugins/vue-constants'
// import DateRangePicker from 'vue2-daterange-picker'
//
// Vue.use(DateRangePicker)

// Load Locales ('en' comes loaded by default)
require('moment/locale/ru')

// Choose Locale
moment.locale('ru')

Vue.use(VueMoment, { moment })

Vue.use(Notifications)
Vue.use(VueCostants)

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

Vue.prototype.$IsDebugMode = function () {
  return this.$route.query.debug === 'true' || +this.$route.query.debug === 1
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  async created () {
    // устройство
    await this.$store.dispatch('auth/auth/InitDevice')
  },
  render: h => h(App),
}).$mount('#app')
