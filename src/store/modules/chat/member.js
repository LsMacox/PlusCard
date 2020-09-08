import ApiService from '@/api/api-client'

export default {
  namespaced: true,
  state: {
    clients: [],
  },
  mutations: {
    clearState (state) {
      state.clients = []
    },
    clients (state, payload) {
      state.clients = payload
    },
    add (state, payload) {
      const items = state.clients
      items.push(payload)
    },
    update (state, payload) {
      const items = state.clients
      items.forEach((item, index) => {
        if (item.id === payload.id) Object.assign(items[index], payload)
      })
    },
    remove (state, payload) {
      const items = state.clients
      items.forEach((item, index) => {
        if (item.id === payload.id) items.splice(index, 1)
      })
    },
  },
  actions: {
    async list ({ commit, rootState }, id) {
      const result = await ApiService.get(
        '/api/conversation/member/program?id=' + id,
      )
      commit('clients', result)
    },

    async add ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation/member/add', item)
      commit('chat/conversation/editedConversation', result, { root: true })
      commit('chat/conversation/updateInConversations', result, { root: true })
    },

    async remove ({ commit, rootState }, item) {
      const result = await ApiService.post(
        '/api/conversation/member/remove',
        item,
      )

      commit('chat/conversation/editedConversation', result, { root: true })
      commit('chat/conversation/updateInConversations', result, { root: true })
    },
  },
  getters: {
    clients (state) {
      return state.clients
    },
  },
}
