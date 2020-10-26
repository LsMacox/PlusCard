import ApiService from '@/api/api-client'

// import VueSession from 'vue-session'
import FP2 from 'fingerprintjs2'
import VueSession from '@/utils/session'

import router from '@/router'

const getDefaultState = () => {
  return {
    isAuth: false,
    user: null, // профиль пользователя
    merchants: [], // доступные мерчанты
    merchant_id: null, // выбранный мерчант
    merchant: null, // выбранный мерчант
    device: null, // данные тек устройства
    client: process.env.VUE_APP_CLIENT, // тип web клиента
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_DEVICE: (state, payload) => { state.device = payload },
  SET_USER: (state, payload) => { state.user = payload },
  SET_MERCHANT: (state, payload) => { state.merchant = payload },
  SET_MERCHANT_ID: (state, payload) => { state.merchant_id = payload },
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

  async loadingApp ({ dispatch }) {
    await dispatch('auth/merchant/read', null, { root: true })
    // await dispatch('reference/city/list', null, { root: true })
    await dispatch('profile/profile/read', null, { root: true })
    await dispatch('company/program/list', null, { root: true })
  },

  async clearApp ({ commit }) {
    await commit('auth/auth/RESET_STATE', null, { root: true })
    await commit('profile/profile/RESET_STATE', null, { root: true })
    await commit('company/program/RESET_STATE', null, { root: true })
    await commit('widget/filter/RESET_STATE', null, { root: true })
    await commit('crm/client/RESET_STATE', null, { root: true })
  },

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

  // logout
  async logout ({ dispatch, commit }) {
    try {
      await ApiService.post('/api-cabinet/logout')
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      router.push('/login')
      commit('SET_AUTH', null)
      dispatch('clearApp')
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
      const result = await ApiService.post('/api-cabinet/login/refresh', {
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
  user: state => state.user,
  merchant: state => state.merchant,
  merchant_id: state => state.merchant_id,
  device: state => state.device,
  client: state => state.client,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
