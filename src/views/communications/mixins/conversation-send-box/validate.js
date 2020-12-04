export default {
  computed: {
    validateSendMessage () {
      if (
        this.$store.getters['chat/message/messages'] &&
        this.$store.getters['chat/message/messages'][this.currentConversationId]
      ) {
        // проверка на строку из пробелов и вложения
        if (
          /\S/.test(this.message) ||
          this.files.length ||
          this.message.trim() !== '' ||
          this.message.replace('\n', '').trim() !== '' ||
          this.replyMessageId
        ) {
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
      ) { return true }
      return false
    },
  },
  methods: {
    validateFile () {
      for (let i = 0; i < this.$refs.attachFile.files.length; i++) {
        const attachFile = this.$refs.attachFile.files[i]
        if (attachFile) {
          if (attachFile.size > 30720000) {
            this.$refs.attachFile.type = 'text'
            this.$refs.attachFile.type = 'file'
            this.$notify({
              message: 'Размер файла превышает 30 МБ',
              type: 'error',
            })
          }
          this.previewAttachFile(attachFile, i)
        }
      }
      this.$refs.attachFile.type = 'text'
      this.$refs.attachFile.type = 'file'
    },
  },
}
