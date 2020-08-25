
const state = {
  loadingApp: false, // отправка запроса
  loadingRequest: false, // отправка запроса
  drawer: localStorage.getItem('drawer') ? JSON.parse(localStorage.getItem('drawer')) : false, // переключатель меню
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  LOADING_APP: (state, value) => state.loadingApp = value,
  // eslint-disable-next-line no-return-assign
  LOADING_REQUEST: (state, value) => state.loadingRequest = value,
  SET_DRAWER (state, payload) {
    state.drawer = payload
    localStorage.setItem('drawer', JSON.stringify(payload))
  },
}

const actions = {
  ResetProgram ({ commit }, value) {
    commit('SET_PROGRAM', null)
  },
  changeDrawer ({ commit }, value) {
    commit('SET_DRAWER', value)
  },
  setLoadingApp ({ commit }, value) {
    commit('LOADING_APP', value)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
