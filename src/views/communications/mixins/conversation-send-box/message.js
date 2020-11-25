export default {
  methods: {
    closeReplyMessage () {
      this.$emit('update:quotedMessage', Object.assign({}))
      this.$emit('update:quotedMessageSender', null)
      this.$emit('update:sendType', 'send')
      this.$emit('update:dialogReplyMessage', false)
      if (this.overlayChat) {
        const elem = this.$refs.conversationField
        if (elem) elem.scrollTop = elem.scrollHeight
        this.overlayChat = false
      }
    },
    clearForm () {
      this.message = ''
      this.attachFileName = null
      this.attachFileType = null
      this.attachFilePreview = null
      this.formDataFiles = []
      this.attachFile = null
      this.files = []
      // this.$refs.attachFile.type = 'text'
      // this.$refs.attachFile.type = 'file'
      this.$emit('update:quotedMessage', Object.assign({}))
      this.$emit('update:quotedMessageSender', null)
      this.$emit('update:sendType', 'send')
      this.$emit('update:dialogReplyMessage', false)
      this.$store.commit('chat/topic/selectedTopicId', null)
      this.$store.commit('chat/message/recipients', [])
      this.$emit('send-message')
      this.$store.commit('chat/conversation/setCurrentConversationMessage', '')
      document.getElementById('message').style.height = 60 + 'px'
    },
    // отправляем сообщение
    async send (type) {
      if (this.sending) return
      /// /console.log('quotedMessage', this.quotedMessage);
      console.log({
        quotedMessage: this.quotedMessage,
        selectedTopicId: this.selectedTopicId,
        message: this.message,
        recipients: this.recipients,
        formDataFiles: this.formDataFiles,
      })
      if (this.validateSendMessage) {
        /// /console.log('topic', this.selectedTopicId);
        try {
          this.sending = true
          const message = new FormData()
          message.set('conversation_id', this.conversationId)
          // message.append('conversation_id', +this.conversationId);
          // message.append('conversation_id', parseInt(this.conversationId));

          if (this.quotedMessage && this.quotedMessage.id) {
            message.set('message_id', this.quotedMessage.id)
          }
          if (this.selectedTopicId) { message.append('topic_id', this.selectedTopicId) }
          if (this.message) message.set('message', this.message)
          let recipients = []
          recipients = Array.from(new Set(this.recipients))

          // отправка файлов

          if (Array.isArray(this.formDataFiles)) {
            for (let i = 0; i < this.formDataFiles.length; i++) {
              const file = this.formDataFiles[i]
              message.append('files[' + i + ']', file)
            }
          }

          // получатели
          for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i]
            message.append('recipients[' + i + ']', recipient)
          }

          /*
                      const message = {
                          conversation_id: this.conversationId,
                          type: type,
                          message_id: this.quotedMessage ? this.quotedMessage.id : null,
                          message: this.message,
                          media: this.files,
                          topic_id: this.selectedTopicId,
                          recipients: Array.from(new Set(this.recipients)),
                      };
                      */
          /// /console.log(message)
          await this.$store.dispatch('chat/message/send', { type, message })
        } catch (e) {
          console.error('send', e)
        } finally {
          this.sending = false
          this.clearForm()
        }
      }

      this.textAreaFocus()
    },
    textAreaFocus () {
      setTimeout(() => {
        this.$refs.messageTextArea.$el.querySelector('textarea').focus()
      }, 0)
    },
    clearMessage () {
      this.message = ''
    },
  },
}
