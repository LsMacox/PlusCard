
const state = {
  loadingRequest: false, // отправка запроса
  drawer: true, // переключатель меню
  program: null, // тек. выбранная компания
}

const mutations = {
  LOADING_REQUEST: (state, value) => {
    state.loadingRequest = value
  },
  SET_DRAWER (state, payload) {
    state.drawer = payload
  },
  SET_PROGRAM (state, payload) {
    state.program = payload
  },
}

const actions = {
  ResetProgram ({ commit }, value) {
    commit('SET_PROGRAM', null)
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
