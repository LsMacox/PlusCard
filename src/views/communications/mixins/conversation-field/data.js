export default {
  computed: {
    loadingSend () {
      return this.$store.getters['chat/message/loading']
    },
    loadingMessagePage: {
      get () {
        return this.$store.getters['chat/message/loadingMessagePage']
      },
      set (v) {
        this.$store.commit('chat/message/loadingMessagePage', v)
      },
    },
    profile () {
      return this.$store.getters.user
    },
    programId () {
      return this.$store.getters['brand/program/programId']
    },
    chatUser () {
      return this.$store.getters['chat/chatUser/chatUser']
    },
    isAllMessagesLoaded () {
      return this.$store.getters['chat/message/isAllMessagesLoaded']
    },
    loadingConversations () {
      return this.$store.getters['chat/conversation/loadingConversations']
    },
    currentConversationId () {
      return this.$store.getters['chat/conversation/currentConversationId']
    },
    currentConversationType () {
      return this.$store.getters['chat/conversation/currentConversationType']
    },
    conversationProgram () {
      return this.$store.getters['chat/data/conversationProgram'](this.currentConversationId)
    },
    realChatName () {
      return this.$store.getters['chat/data/realChatName'](this.currentConversationId)
    },
    conversation () {
      return this.$store.getters['chat/data/conversation'](this.currentConversationId)
    },
    messages () {
      let messages = {}
      if (this.currentConversationId) {
        messages = this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ]
        if (messages) {
          messages = this.connectingMessages(messages)
        }
      }

      return messages || {}
    },
  },
}
