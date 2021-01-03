export default {
  namespaced: true,
  state: {
    messageText: '',
    attachFile: {},
    attachFiles: [],
    isReply: false,
    isEdit: false,
    isForward: false,
    isTopic: false,
    isChoice: false,
    isEmoji: false,
    topicId: NaN,
    replyMessageId: NaN,
    editMessageId: NaN,
    forwardMessageId: NaN,
    choiceMessageIds: [],
    editMessageTextOld: '',
    emojiHistory: [],
  },
  mutations: {
    clearAllModes (state) {
      state.isReply = false
      state.isEdit = false
      state.isForward = false
      state.isTopic = false
      state.isChoice = false
      state.isEmoji = false
      state.replyMessageId = NaN
      state.editMessageId = NaN
      state.forwardMessageId = NaN
      state.topicId = NaN
      state.choiceMessageIds = []
    },
    clearAllModesBoolExceptCurrent (state, currentStates) {
      if (!currentStates.includes('isReply')) state.isReply = false
      if (!currentStates.includes('isEdit')) state.isEdit = false
      if (!currentStates.includes('isForward')) state.isForward = false
      if (!currentStates.includes('isTopic')) state.isTopic = false
      if (!currentStates.includes('isChoice')) state.isChoice = false
      if (!currentStates.includes('isEmoji')) state.isEmoji = false
    },
    messageText (state, payload) {
      state.messageText = payload
    },
    attachFile (state, payload) {
      state.attachFile = payload
    },
    attachFiles (state, payload) {
      state.attachFiles = payload
    },
    isReply (state, payload) {
      state.isReply = payload
    },
    isEdit (state, payload) {
      state.isEdit = payload
    },
    isForward (state, payload) {
      state.isForward = payload
    },
    isTopic (state, payload) {
      state.isTopic = payload
    },
    isChoice (state, payload) {
      state.isChoice = payload
    },
    isEmoji (state, payload) {
      state.isEmoji = payload
    },
    isReply (state, payload) {
      state.isReply = payload
    },
    topicId (state, payload) {
      state.topicId = payload
    },
    replyMessageId (state, payload) {
      state.replyMessageId = payload
    },
    editMessageId (state, payload) {
      state.editMessageId = payload
    },
    forwardMessageId (state, payload) {
      state.forwardMessageId = payload
    },
    choiceMessageIds (state, payload) {
      state.choiceMessageIds = payload
    },
    emojiHistory (state, payload) {
      state.emojiHistory = payload
    },
    addInChoiceMessageIds (state, payload) {
      state.choiceMessageIds.push(payload)
    },
    removeInChoiceMessageIdsByIdx(state, idx) {
      state.choiceMessageIds.splice(idx, 1)
    },
    addInAttachFiles (state, payload) {
      state.attachFiles.push(payload)
    },
    removeInAttachFiles (state, idx) {
      state.attachFiles.splice(idx, 1)
    },
    editMessageTextOld (state, payload) {
      state.editMessageTextOld = payload
    },
  },
  actions: {
    async sendForm ({ state, dispatch, rootGetters }) {
      let type = 'send'
      const message = new FormData()

      // attach conversation_id
      message.set('conversation_id', rootGetters['chat/conversation/currentConversationId'])

      // attach message
      if (state.messageText) {
        message.set('message', state.messageText)
      }
      // attach reply
      if (state.isReply && !isNaN(state.replyMessageId)) {
        type = 'reply'
        message.set('message_id', state.replyMessageId)
      }
      // attach topic
      if (state.isTopic && !isNaN(state.topicId)) {
        message.append('topic_id', state.topicId)
      }
      // attach file
      if (state.attachFile instanceof File) {
        message.append('files[0]', state.attachFile)
      }
      // attach files
      if (state.attachFiles.length) {
        for (let i = 0; i < state.attachFiles.length; i++) {
          message.append('files['+ i +']', state.attachFiles[i])
        }
      }

      await dispatch('chat/message/send', { type, message }, { root: true })
    },
    async sendUpdateMessage({ state, commit, dispatch, rootGetters }) {
      if (state.editMessageTextOld === state.messageText) return

      const message = {
        conversation_id: rootGetters['chat/conversation/currentConversationId'],
        message_id: state.editMessageId,
        message: state.messageText,
      }

      await dispatch('chat/message/update', message, { root: true })
        .then(() => {
          commit('isEdit', false)
        })
    },
    async sendRecord ({ state, commit, dispatch, rootGetters }, audioUrl) {
      commit('attachFile', {})
      commit('attachFiles', [])
      commit('addInAttachFiles', audioUrl)
      await dispatch('sendForm')
    },
    clearForm ({ commit }) {
      commit('clearAllModes')
      commit('messageText', '')
      commit('attachFile', {})
      commit('attachFiles', {})
    },
  },
  getters: {
    messageText (state) {
      return state.messageText
    },
    isReply (state) {
      return state.isReply
    },
    isEdit (state) {
      return state.isEdit
    },
    isForward (state) {
      return state.isForward
    },
    isTopic (state) {
      return state.isTopic
    },
    isChoice (state) {
      return state.isChoice
    },
    isEmoji (state) {
      return state.isEmoji
    },
    topicId (state) {
      return state.topicId
    },
    replyMessageId (state) {
      return state.replyMessageId
    },
    editMessageId (state) {
      return state.editMessageId
    },
    forwardMessageId (state) {
      return state.forwardMessageId
    },
    choiceMessageIds (state) {
      return state.choiceMessageIds
    },
    editMessageTextOld (state) {
      return state.editMessageTextOld
    },
    emojiHistory (state) {
      return state.emojiHistory
    },
  },
}
