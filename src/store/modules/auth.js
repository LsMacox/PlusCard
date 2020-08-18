import ApiService from '@/api/api-client'

// import VueSession from 'vue-session'
import FP2 from 'fingerprintjs2'
import VueSession from '@/utils/session'

import router from '@/router'

const state = {
  isAuth: false,
  user: null, // профиль пользователя
  merchants: [], // доступные мерчанты
  merchant_id: null, // выбранный мерчант
  merchant: null, // выбранный мерчант
  device: null, // данные тек устройства
}

const mutations = {
  SET_DEVICE: (state, payload) => {
    state.device = payload
  },
  SET_AUTH: (state, payload) => {
    VueSession.destroy()
    if (payload) {
      state.merchants = payload.merchants
      VueSession.start()
      VueSession.set('access_token', payload.access_token)
      VueSession.set('refresh_token', payload.refresh_token)
      if (payload.merchant) {
        state.merchant = payload.merchant
        state.merchant_id = payload.merchant.id
        VueSession.set('merchant_id', state.merchant_id)
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
  async EmailLogin ({ commit, state }, user) {
    try {
      const result = await ApiService.post(
        '/api-cabinet/merchant/login/email/signin',
        user,
      )
      console.log(result)
      commit('SET_AUTH', result)
    } catch (error) {
      commit('SET_AUTH', null)
      throw error
    }
  },

  // user logout
  async Logout ({ commit, state, dispatch }) {
    try {
      await ApiService.post('/api/Logout')
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      commit('SET_AUTH', null)
    }
  },

  async RefreshToken ({ commit, state, dispatch }) {
    try {
      let refreshToken = null
      let deviceId = null

      if (VueSession.exists()) {
        refreshToken = VueSession.get('refresh_token')
        deviceId = state.device.id
      }
      const result = await ApiService.post('/api/login/refres', {
        refresh_token: refreshToken,
        device_id: deviceId,
      }, { errorHandle: false })

      commit('SET_AUTH', result)
    } catch (error) {
      commit('SET_AUTH', null)

      router.push('/login/email')
    }
  },
}

const getters = {
  merchants: state => state.merchants,
  merchant: state => state.merchant,
  device: state => state.device,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
