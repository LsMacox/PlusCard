import ApiService from '@/api/api-client'

// import VueSession from 'vue-session'
import FP2 from 'fingerprintjs2'

import router from '@/router'

const state = {
  isAuth: false,
  user: null,
  merchants: [],
  merchant_id: null,
  merchant: null,
  device: null,
}

const mutations = {
  SET_DEVICE: (state, payload) => {
    state.device = payload
  },
  SET_AUTH: (state, payload) => {
    if (payload) {
      state.merchants = payload.merchants
      if (payload.merchant) {
        state.merchant = payload.merchant
        state.merchant_id = payload.merchant.id
      }
      state.isAuth = true
    } else {
      state.isAuth = false
    }
  },

}

const actions = {
  async InitDevice ({ commit }) {
        let murmur
        const options = {}
        await FP2.getPromise(options).then(function (components) {
            const values = components.map(function (component) {
                return component.value
            })
            murmur = FP2.x64hash128(values.join(''), 31)
        })

        commit('SET_DEVICE', {
          id: murmur,
          token: murmur,
          type: 'web',
        })
  },

  // EMAIL LOGIN
  async emailLogin ({ commit, state }, {user, session}) {
    try {
      const result = await ApiService.post('/api-cabinet/merchant/login/email/signin', user)
      commit('SET_AUTH', result)
      session.start()
      session.set('access_token', result.access_token)
      session.set('refresh_token', result.refresh_token)
      session.set('merchant_id', state.merchant_id)
    } catch (error) {
      commit('SET_AUTH', null)
        throw error
    }
},

  // user logout
  logout ({ commit, state, dispatch }) {

  },

  async RefreshToken ({ commit, state, dispatch }, {session}) {
    try {
      let refreshToken = null
      let deviceId = null

      if (session.exists()) {
        refreshToken = session.get('refresh_token')
        deviceId = state.device.id
      }
      const result = await ApiService.post('/api/login/refres', {
        refresh_token: refreshToken,
        device_id: deviceId,
      })

      commit('SET_AUTH', result)
    } catch (error) {
      commit('SET_AUTH', null)

      router.push('/login/email')
    }
  },

}

const getters = {
  access_token (state) {
    if (this._vm.$session.exists()) {
      return this._vm.$session.get('access_token')
    } else {
      return null
    }
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
