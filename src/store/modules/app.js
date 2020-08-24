
const state = {
  loadingRequest: false, // отправка запроса
  drawer: true, // переключатель меню
 
}

const mutations = {
  LOADING_REQUEST: (state, value) => {
    state.loadingRequest = value
  },
  SET_DRAWER (state, payload) {
    state.drawer = payload
  },  
}

const actions = { 
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
