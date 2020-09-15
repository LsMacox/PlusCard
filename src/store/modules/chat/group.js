import ApiService from '@/api/api-client'

export default {
  namespaced: true,
  state: {
    groups: [],
    selectedGroupId: null,
  },
  mutations: {
    clearState (state) {
      state.groups = []
      state.selectedGroupId = null
    },
    groups (state, payload) {
      state.groups = payload
    },
    selectedGroupId (state, payload) {
      state.selectedGroupId = payload
    },
    add (state, payload) {
      const items = state.groups
      items.push(payload)
    },
    update (state, payload) {
      const items = state.groups
      items.forEach((item, index) => {
        if (item.id === payload.id) Object.assign(items[index], payload)
      })
    },
    remove (state, payload) {
      const items = state.groups
      items.forEach((item, index) => {
        if (item.id === payload.id) items.splice(index, 1)
      })
    },
  },
  actions: {
    async create ({ commit, rootState, dispatch }, group) {
      const result = await ApiService.post(
        '/api/conversation/group/create',
        group,
      )
      commit('add', result)
    },

    async list ({ commit, rootState }, conversationId) {
      const result = await ApiService.get(
        '/api/conversation/group/list/cabinet?conversation_id=' + conversationId,
      )
      commit('groups', result)
    },

    async update ({ commit, rootState, dispatch }, item) {
      const result = await ApiService.post(
        '/api/conversation/group/update',
        item,
      )
      commit('update', result)
    },

    async delete ({ commit, rootState, dispatch }, item) {
      const result = await ApiService.delete(
        '/api/conversation/group?id=' + item.id,
      )
      commit('remove', result)
    },
  },
  getters: {
    groups (state) {
      return state.groups
    },
    selectedGroupId (state) {
      return state.selectedGroupId
    },
  },
}
