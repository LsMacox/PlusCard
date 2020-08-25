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
import i18n from './i18n'

import './AuthGuard'

import * as filters from './filters'

import VueSession from './utils/session'

import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'

Vue.use(Notifications)

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
    /*
     * глобальный прелоадер (обязательно первый)
     */

    await this.$store.dispatch('app/setLoadingApp', true)

    console.log(this.$store.getters.loadingApp)

    // устройство
    await this.$store.dispatch('auth/auth/InitDevice')

    /*
     * проверка наличия access/refresh
     */

    let auth = false

    const accessToken = this.$store._vm.$session.get('access_token')
    const refreshToken = this.$store._vm.$session.get('refresh_token')
    const merchantId = this.$store._vm.$session.get('merchant_id')

    if (accessToken && refreshToken && merchantId) {
      auth = true
    }

    if (auth) {
      console.log('loadingApp')
      await this.$store.dispatch('auth/auth/loadingApp')
    } else {
      if (this.$route.path !== '/login/email') this.$router.push('/login/email')
      await this.stopLoading()
      return
    }

    /*
     * окончание загрузки
     */

    await this.$store.dispatch('app/setLoadingApp', false)
  },
  methods: {
    async stopLoading () {
      await this.$store.dispatch('app/setLoadingApp', false)
    },
  },
  render: h => h(App),
}).$mount('#app')
