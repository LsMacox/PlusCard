export default {
  methods: {
    addLine (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!this.messageText.replace(/^\s+/, '').length) return
      this.message = this.message + '\n'
      this.$emit('send-message')
    },
    limitTextArea () {
      if (this.$refs?.messageTextArea) {
        const field = document.getElementById('conversationField')
        const header = document.querySelector('.app--conversation--header')
        const textAreaField = this.$refs.messageTextArea.$el
        const topHeight = ((field.clientHeight + header.clientHeight) / 2)

        if (textAreaField.clientHeight === 60) return

        if (
          textAreaField.clientHeight > topHeight &&
          textAreaField.style.overflowY !== 'scroll'
        ) {
          textAreaField.style.overflowY = 'scroll'
          textAreaField.style.maxHeight = textAreaField.clientHeight + 'px'
        } else if (textAreaField.clientHeight < topHeight) {
          textAreaField.style.maxHeight = 'inherit'
          textAreaField.style.overflowY = 'hidden'
        }
      }
    },
    sendTypingEvent (conversationId) {
      const currentTime = new Date().getTime()

      if (currentTime - this.typingTime > 1000) {
        // сообщение валидно
        if (this.validateSendMessage) {
          this.typingTime = currentTime
          this.$store.dispatch('chat/message/typing', conversationId)
        }
      }
    },
  },
}
