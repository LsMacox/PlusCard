import ApiService from '@/api/api-client'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    loadingConversations: false,
    conversations: [],
    currentConversationType: 'business',
    currentConversationId: '',
    nowCreateConversation: {},
    editedConversation: {},
  },
  mutations: {
    clearState (state) {
      state.conversations = []
      state.editedConversation = {}
    },
    loadingConversations (state, payload) {
      state.loadingConversations = payload
    },
    conversations (state, payload) {
      state.conversations = payload
    },
    merge_conversations (state, chatList) {
      chatList.forEach(chat => {
        const index = state.conversations.findIndex(item => item.id === chat.id)
        if (index >= 0) {
          Vue.set(state.conversations, index, chat)
        } else {
          state.conversations.push(chat)
        }
      })
    },
    currentConversationId (state, payload) {
      state.currentConversationId = payload
    },
    nowCreateConversation (state, payload) {
      state.nowCreateConversation = payload
    },
    currentConversationType (state, payload) {
      state.currentConversationType = payload
    },
    editedConversation (state, payload) {
      state.editedConversation = payload
    },
    addInLast (state, payload) {
      const conversationId = payload.conversation_id
      state.conversations.forEach(item => {
        if (item.id === conversationId) item.last_message = payload
      })
      state.conversations = Object.assign([], state.conversations)
    },
    addUnreadCount (state, id) {
      state.conversations.forEach(item => {
        if (item.id === id) item.unread_count++
      })
      state.conversations = Object.assign([], state.conversations)
    },
    clearUnreadCount (state, id) {
      state.conversations.forEach(item => {
        if (item.id === id) item.unread_count = 0
      })
      state.conversations = Object.assign([], state.conversations)
    },
    addInConversations (state, payload) {
      const items = state.conversations
      items.push(payload)
    },
    updateInConversations (state, payload) {
      const index = state.conversations.findIndex(
        item => item.id === payload.id,
      )
      if (index >= 0) {
        Vue.set(state.conversations, index, payload)
      } else {
        state.conversations.push(payload)
      }
    },
    deleteInConversations (state, payload) {
      const items = state.conversations
      items.forEach((item, index) => {
        if (item.id === payload.id) items.splice(index, 1)
      })
    },
    setCurrentConversationMessage (state, payload) {
      const index = state.conversations.findIndex(
        item => item.id === state.currentConversationId,
      )

      if (index >= 0) {
        Vue.set(state.conversations[index], 'currentTemplateMessage', payload)
      }
    },
  },
  actions: {
    async create ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation', item)
      console.log('create conversation', result)
      commit('nowCreateConversation', result)
      commit('addInConversations', result)
    },
    async list ({ commit, rootState }) {
      const result = await ApiService.get('/api/conversation/list')
      commit('conversations', result)
    },
    async GetBusinessChatList ({ commit, rootState }, programId = null) {
      const result = await ApiService.get(
        `/api/conversation/getBusinessChats?program_id=${programId}`,
      )
      commit('merge_conversations', result)
    },
    async GetMerchantChatList ({ commit, rootState }) {
      const result = await ApiService.get('/api/conversation/getMerchantChats')
      commit('merge_conversations', result)
    },
    async read ({ commit, rootState }, conversationId) {
      const result = await ApiService.get(
        '/api/conversation?id=' + conversationId,
      )
      commit('updateInConversations', result)
    },

    async update ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation/admin', item)
      commit('updateInConversations', result)
    },

    async updateArchived ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation/archived/update', item)
      commit('updateInConversations', result)
    },

    async delete ({ commit, rootState }, conversationId) {
      await ApiService.post('/api/conversation/delete', {conversation_id: conversationId})
      commit('deleteInConversations', conversationId)
    },

    async chosenSet ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation/chosen/set', item)
      commit('updateInConversations', result)
    },

    async chosenRemove ({ commit, rootState }, item) {
      const result = await ApiService.post(
        '/api/conversation/chosen/remove',
        item,
      )
      commit('updateInConversations', result)
    },

    async mutedSet ({ commit, rootState }, item) {
      const result = await ApiService.post('/api/conversation/muted/set', item)
      commit('updateInConversations', result)
    },

    async mutedRemove ({ commit, rootState }, item) {
      const result = await ApiService.post(
        '/api/conversation/muted/remove',
        item,
      )
      commit('updateInConversations', result)
    },
  },
  getters: {
    loadingConversations (state) {
      return state.loadingConversations
    },
    currentConversationType (state) {
      return state.currentConversationType
    },
    currentConversationId (state) {
      return state.currentConversationId
    },
    conversations (state) {
      return state.conversations.map(item => {
        const activeMembers = item.members.filter(item => item.active)
        Vue.set(item, 'activeMembers', activeMembers)
        Vue.set(item, 'activeMembersCount', activeMembers.length)
        return item
      })
    },
    conversations_business (state, getters) {
      return getters.conversations.filter(item => {
        return !!item.program_id
      })
    },
    conversations_merchant (state, getters) {
      return getters.conversations.filter(item => {
        return item.program_id == null
      })
    },
    editedConversation (state) {
      return state.editedConversation
    },
    nowCreateConversation (state) {
      return state.nowCreateConversation
    },
  },
}
