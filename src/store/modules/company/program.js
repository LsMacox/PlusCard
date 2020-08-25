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
  list ({ commit }, value) {
    commit('SET_DRAWER', value)
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
