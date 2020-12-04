import Vue from 'vue'

export default {
  namespaced: true,
  getters: {
    payload: (state, getters, rootState, rootGetters) => convId => {
      const payload = {
        profile: rootGetters.user,
        conversation: getters.conversation(convId),
        conversationProgram: getters.conversationProgram(convId),
        members: getters.members(convId),
        employees: getters.employees(convId),
        chatUser: rootGetters['chat/chatUser/chatUser'],
      }
      return payload
    },
    conversation: (state, getters, rootState, rootGetters) => convId => {
      const conversation = rootGetters[
          'chat/conversation/conversations'
      ].filter((item) => item.id === convId)

      if (!isEmptyObject(conversation)) {
        return conversation[0]
      }
      return {}
    },
    conversationProgram: (state, getters) => convId => {
      let conversation = getters.conversation(convId)

      if (!isEmptyObject(conversation)) {
        return conversation.program
      }
      return {}
    },
    realChatName: (state, getters) => convId => {
      let conversationProgram = getters.conversationProgram(convId)

      if (!isEmptyObject(conversationProgram)) {
        return conversationProgram.real_chat_name
      }
      return ''
    },
    members: (state, getters) => convId => {
      let conversation = getters.conversation(convId)

      if (!isEmptyObject(conversation)) return conversation.members || []
      return []
    },
    activeMembers: (state, getters) => convId => {
      let conversation = getters.conversation(convId)

      if (!isEmptyObject(conversation)) return conversation.members.filter(item => item.active)
      return []
    },
    employees: (state, getters) => convId => {
      let conversationProgram = getters.conversationProgram(convId)

      if (!isEmptyObject(conversationProgram)) {
        return conversationProgram.chat_members || []
      }
      return []
    },
  },
}

function isEmptyObject (obj) {
  return Object.keys(obj).length <= 0
}