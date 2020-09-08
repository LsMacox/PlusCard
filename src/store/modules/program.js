
const getDefaultState = () => {
  return {
    program: null, // тек. выбранная компания
    programs: [], // компании продавца
  }
}

// initial state
const state = getDefaultState()

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },
  SET_PROGRAM (state, payload) {
    state.program = payload
  },
  SET_PROGRAMS (state, payload) {
    state.programs = payload
  },
}

const actions = {
  Reset ({ commit }) {
    commit('RESET_STATE')
  },
  changeDrawer ({ commit }, value) {
    commit('SET_DRAWER', value)
  },

}

const getters = {
  program: state => state.program,
  programs: state => state.programs,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
