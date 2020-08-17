
const getDefaultState = () => {
  return {
    programs: [], // компании продавца
  }
}

// initial state
const state = getDefaultState()

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },
  SET_PROGRAMS (state, payload) {
    state.programs = payload
  }
}

const actions = {
  Reset ({ commit }) {
    commit('RESET_STATE')
  },
  changeDrawer ({ commit }, value) {
    commit('SET_DRAWER', value)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
