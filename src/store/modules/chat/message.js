import ApiService from '@/api/api-client'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    messages: {},
    unreadMessages: {},
    loading: false,
    loadingMessagePage: false,
    typing: {},
    recipients: [],
    topics: [],
  },
  mutations: {
    clearState (state) {
      state.loading = false
      state.typing = {}
      state.recipients = []
      state.topics = []
    },
    loading (state, payload) {
      state.loading = payload
    },
    loadingMessagePage (state, payload) {
      state.loadingMessagePage = payload
    },
    typing (state, payload) {
      state.typing = payload
    },
    recipients (state, payload) {
      state.recipients = payload
    },
    messages (state, payload) {
      const conversationId = payload.conversation_id
      let messages = {}

      // если сообщения уже загружены
      if (state.messages[conversationId]) { messages = state.messages[conversationId] }

      payload.forEach(item => Vue.set(messages, item.id, item))
      // ключ = id чата
      Vue.set(state.messages, conversationId, messages)
    },
    unreadMessages (state, payload) {
      const messages = {}
      payload.forEach(item => Vue.set(messages, item.id, item))
      // ключ = id чата
      Vue.set(state.unreadMessages, payload.conversation_id, messages)
    },
    addInMessages (state, payload) {
      // console.log('payload')
      // console.log(payload)
      const conversationId = payload.conversation_id
      if (state.messages[conversationId]) {
        state.messages[conversationId][payload.id] = payload
      } else {
        state.messages[conversationId] = {}
        state.messages[conversationId][payload.id] = payload
      }
      // обновление реактивности
      state.messages = Object.assign({}, state.messages)
    },
    updateInMessages (state, payload) {
      const conversationId = payload.conversation_id

      if (state.messages && state.messages[conversationId]) {
        state.messages[conversationId][payload.id] = payload
        // обновление реактивности
        state.messages = Object.assign({}, state.messages)
      }
    },
    deleteInMessages (state, payload) {
      const conversationId = payload.conversation_id

      if (state.messages && state.messages[conversationId]) {
        delete state.messages[conversationId][payload.id]
        // обновление реактивности
        state.messages = Object.assign({}, state.messages)
      }
    },
  },
  actions: {
    status ({ rootGetters, state }, payload) {
      const conversationId = payload.conversation_id
      payload.forEach(item => {
        // если send_type = null
        if (!item.send_type) {
          if (state.messages[conversationId]) {
            state.messages[conversationId][item.id] = item
          } else {
            state.messages[conversationId] = {}
            state.messages[conversationId][item.id] = item
          }
        }
        if (item.send_type === 'ALL') {
          if (state.messages[conversationId]) {
            state.messages[conversationId][item.id] = item
          } else {
            state.messages[conversationId] = {}
            state.messages[conversationId][item.id] = item
          }
        }
        if (item.send_type === 'RECEPIENTS') {
          const chatUserId = rootGetters['chat/chatUser/chatUser'].id
          const recipient = item.recipients.filter(item => item === chatUserId)
          if (recipient.length) {
            if (state.messages[conversationId]) {
              state.messages[conversationId][item.id] = item
            } else {
              state.messages[conversationId] = {}
              state.messages[conversationId][item.id] = item
            }
          }
        }
      })
      // обновление реактивности
      state.messages = Object.assign({}, state.messages)
    },

    toDelivered ({ dispatch, commit, state, rootGetters }, conversationId) {
        const chatUser = rootGetters['chat/chatUser/chatUser']
        const toDelivered = []
        let id = null
        let senderId = null
        let delivered = null

        for (const item in state.messages[conversationId]) {
          id = state.messages[conversationId][item].id
          senderId = state.messages[conversationId][item].sender_id
          delivered = state.messages[conversationId][item].delivered
          if (chatUser.id !== senderId && delivered == null) toDelivered.push(id)
        }

        if (toDelivered.length) {
          const delivered = {
            conversation_id: conversationId,
            messages: toDelivered,
          }
          dispatch('deliveredStatus', delivered)
        }
    },

    toRead ({ dispatch, commit, state, rootGetters }, conversationId) {
        const chatUser = rootGetters['chat/chatUser/chatUser']
        const toRead = []
        let msgId = null
        let senderId = null
        let read = null

        for (const item in state.messages[conversationId]) {
          msgId = state.messages[conversationId][item].id
          // id отправителя
          senderId = state.messages[conversationId][item].sender_id
          read = state.messages[conversationId][item].read
          if (!read && chatUser.id !== senderId) toRead.push(msgId)
        }

        if (toRead.length) {
          const read = {
            conversation_id: conversationId,
            messages: toRead,
          }
          dispatch('readStatus', read)
        }
    },

    async list ({ dispatch, commit, state, rootState, rootGetters }, item) {
      const id = item.id
      const offset = item.offset
      const limit = item.limit

      const result = await ApiService.get(
        `/api/message/listWithAttachments?conversation_id=${id}&offset=${offset}&limit=${limit}`,
      )

      // подставляем в ответ id чата
      result.conversation_id = id
      commit('messages', result)

      // добавляем в последнее сообщение в список чатов
      const keys = Object.keys(state.messages[id])
      const last = state.messages[id][keys[keys.length - 1]]
      commit('chat/conversation/addInLast', last, { root: true })

      // delivered
      dispatch('toDelivered', id)
    },

    async typing ({ commit, rootState }, typing) {
       await ApiService.get('/api/message/typing?conversation_id=' + typing)
      // commit('loading', false)
    },

    async send ({ commit, rootState }, { type, message }) {
      commit('loading', true)

      let result = null
      if (type === 'send') {
        result = await ApiService.post('/api/message/send',
          message,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
}
      if (type === 'reply') {
        result = await ApiService.post('/api/message/reply',
          message,
        )
}
      if (type === 'forward') {
        result = await ApiService.post('/api/message/forward',
          message,
        )
}
      /// /console.log('/api/message/send')
      /// /console.log(success)

      // добавляем новое сообщение в массив сообщений
      commit('addInMessages', result)
      // добавляем новое сообщение как последнее в списке чатов
      commit('chat/conversation/addInLast', result, { root: true })

      commit('loading', false)
    },

    async deliveredStatus ({ dispatch, commit, rootState }, delivered) {
      const result = await ApiService.post('/api/message/delivered',
        delivered,
      )
      // console.log('deliveredStatus')
      // console.log(success)
      // подставляем id чата
      result.conversation_id = delivered.conversation_id
      dispatch('status', result)
    },

    async readStatus ({ dispatch, commit, rootState }, read) {
      const result = await ApiService.post('/api/message/read',
        read,
      )
      // console.log('readStatus')
      // console.log(success)
      // подставляем id чата
      result.conversation_id = read.conversation_id
      dispatch('status', result)
    },

    async update ({ commit, rootState }, message) {
      const result = await ApiService.post('/api/message/update',
        message,
      )
      /// /console.log('/api/message/update')
      /// /console.log(success)
      // обновляем сообщение в массиве сообщений
      commit('updateInMessages', result)
    },

    async delete ({ commit, rootState }, message) {
      const result = await ApiService.post('/api/message/delete',
        message,
      )
      /// /console.log('/api/message/delete')
      /// /console.log(success)
      // удаляем сообщение из массива сообщений
      commit('deleteInMessages', result)
    },

    async deleteAll ({ commit, rootState }, message) {
      const result = await ApiService.post('/api/message/delete/all',
        message,
      )
      /// /console.log('/api/message/delete/all')
      /// /console.log(success)
      // удаляем сообщение из массива сообщений
      commit('deleteInMessages', result)
    },
  },
  getters: {
    messages (state) {
      return state.messages
    },
    loading (state) {
      return state.loading
    },
    loadingMessagePage (state) {
      return state.loadingMessagePage
    },
    typing (state) {
      return state.typing
    },
    recipients (state) {
      return state.recipients
    },
  },
}