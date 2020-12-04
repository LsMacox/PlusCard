export default {
  methods: {
    clearForm () {
      this.message = ''
      // files
      this.attachFileName = null
      this.attachFileType = null
      this.attachFilePreview = null
      this.formDataFiles = []
      this.attachFile = null
      this.files = []

      // reply
      this.internalIsReplyMessage = false
      // edit
      this.internalIsEditMessage = false
      // topics
      this.$store.commit('chat/topic/selectedTopicId', null)
      // recipients
      this.$store.commit('chat/message/recipients', [])
      this.$store.commit('chat/conversation/setCurrentConversationMessage', '')
      this.$emit('send-message')
      document.getElementById('messageTextArea').style.height = 60 + 'px'
    },
    // отправляем сообщение
    async send () {
      if (this.sending) return

      console.log({
        replyMessageId: this.replyMessageId,
        selectedTopicId: this.selectedTopicId,
        message: this.message,
        recipients: this.recipients,
        formDataFiles: this.formDataFiles,
      })

      if (this.validateSendMessage) {
        try {
          if (this.internalIsEditMessage) {
            this._sendMessageEdit()
          } else {
            this.sending = true
            let type = 'send'
            const message = new FormData()

            message.set('conversation_id', this.currentConversationId)
            if (this.message) {
              message.set('message', this.message)
            }

            // attach reply
            if (this.replyMessageId) {
              type = 'reply'
              message.set('message_id', this.replyMessageId)
            } else if (this.selectedTopicId) {
              message.append('topic_id', this.selectedTopicId)
            }

            // attach topic
            let recipients = []
            recipients = Array.from(new Set(this.recipients))

            // recipients
            for (let i = 0; i < recipients.length; i++) {
              const recipient = recipients[i]
              message.append('recipients[' + i + ']', recipient)
            }

            // attach files
            if (Array.isArray(this.formDataFiles)) {
              for (let i = 0; i < this.formDataFiles.length; i++) {
                const file = this.formDataFiles[i]
                message.append('files[' + i + ']', file)
              }
            }

            await this.$store.dispatch('chat/message/send', { type, message })
          }
        } catch (e) {
          console.error('send', e)
        } finally {
          this.sending = false
          this.clearForm()
        }
      }

      this.textAreaFocus()
    },
    _sendMessageEdit () {
      if (this.editMessageTextOld === this.message) return

      const message = {
        conversation_id: this.currentConversationId,
        message_id: this.editMessageId,
        message: this.message,
      }

      this.$store
        .dispatch('chat/message/update', message)
        .then(() => {
          this.internalIsEditMessage = false
        })
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
