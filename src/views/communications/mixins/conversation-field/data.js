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
    conversation () {
      this.$store.getters['chat/data/conversation'](this.currentConversationId)
    },
    messages () {
      let messages = {}
      if (this.currentConversationId) {
        messages = this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ]
        if (this.topicFilter) {
          const newMessages = {}
          for (const item in messages) {
            if (messages[item].topic_id === this.selectedTopicId) {
              newMessages[item] = messages[item]
            }
          }
          return newMessages
        }
      }

      return messages || {}
    },
    selectedTopicId () {
      return this.$store.getters['chat/topic/selectedTopicId']
    },
    recipients () {
      return this.$store.getters['chat/message/recipients']
    },
  },
}
