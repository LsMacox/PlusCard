import ApiService from '@/api/api-client'

const getDefaultState = () => {
  return {
    cities: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_CITIES (state, payload) {
    state.cities = payload
  },
}

const actions = {

  resetState ({ commit }) {
    commit('RESET_STATE')
  },

  async list ({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/company/shops/city/list')
      // console.log('/api-cabinet/company/shops/city/list')
      // console.log(result)
      commit('SET_CITIES', result)
    } catch (error) {
      throw error
    }
  },

}

const getters = {
  cities: state => state.cities,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
