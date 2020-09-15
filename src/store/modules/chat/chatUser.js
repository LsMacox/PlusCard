import ApiService from '@/api/api-client'

export default {
  namespaced: true,
  state: {
    chatUser: {},
  },
  mutations: {
    clearState (state) {
      state.chatUser = {}
    },
    chatUser (state, payload) {
      state.chatUser = Object.assign({}, payload)
    },
  },
  actions: {
    async read ({ commit }, id) {
      const result = await ApiService.get(`/api-cabinet/communication/chatuser?id=${id}`)
      commit('chatUser', result)
    },

    async update ({ commit, dispatch }, user) {
      const result = await ApiService.put('/api-cabinet/communication/chatuser', user)
      commit('chatUser', result)
    },
  },
  getters: {
    chatUser (state) {
      return state.chatUser
    },
  },
}
