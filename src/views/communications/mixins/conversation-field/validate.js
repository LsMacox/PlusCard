export default {
  methods: {
    issetMessages () {
      return Object.keys(this.messages).length
    },
    validateSendMessage () {
      if (
        typeof this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ] !== 'undefined'
      ) {
        // проверка на строку из пробелов и вложения
        if (/\S/.test(this.newMessage) || this.files.length) {
          return true
        }
      }
      return false
    },
    validateAttachment () {
      if (
        typeof this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ] !== 'undefined'
      ) {
        return true
      }
      return false
    },
  },
}
