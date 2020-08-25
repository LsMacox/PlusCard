import ApiService from '@/api/api-client'

const getDefaultState = () => {
  return {
    programs: [], // компании продавца
    program: {},
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_PROGRAMS (state, payload) {
    state.programs = payload
  },
  SET_PROGRAM (state, payload) {
    state.program = payload
  },
}

const actions = {
  resetState ({ commit }) {
    commit('RESET_STATE')
  },
  async list ({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/company/list')
      // console.log(result)
      commit('SET_PROGRAMS', result)
      if (result && result.length) {
        // console.log(result[0])
        commit('SET_PROGRAM', result[0])
      }
    } catch (error) {
      throw error
    }
  },
}

const getters = {
  programs: state => state.programs,
  program: state => state.program,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
