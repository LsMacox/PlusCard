export default {
  methods: {
    addLine (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!this.message.replace(/^\s+/, '').length) return
      this.message = this.message + '\n'
      this.$emit('send-message')
    },
    limitTextArea () {
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
    },
    messageEvent (conversationId, $event) {
      // ctrl + enter новая строка
      if ($event.ctrlKey === true && $event.code === 'Enter') {
        this.message = this.message + '\n'
      }
      if ($event.ctrlKey === true && $event.code === 'NumpadEnter') {
        this.message = this.message + '\n'
      }
      // enter отправка сообщения
      if ($event.ctrlKey === false && $event.code === 'Enter') {
        if (!this.sending) this.send(this.sendType)
      }
      if ($event.ctrlKey === false && $event.code === 'NumpadEnter') {
        if (!this.sending) this.send(this.sendType)
      }

      var text = document.getElementById('message')
      if (text) {
        text.style.height = 'auto'
        text.style.height = text.scrollHeight + 'px'
      }

      this.$emit('send-message')
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
