export default {
  methods: {
    addLine (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!this.message.replace(/^\s+/, '').length) return

      this.message = this.message + '\n'
      this.$emit('send-message')
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
    handleResizeHeightTextArea () {
      const chat = document.getElementById('conversationWrap')
      const chatHeader = document.querySelector('.app--conversation--header')
      const textArea = this.$refs.messageTextArea.$el.querySelector('textarea')
      const maxHeight = (Math.round(chat.clientHeight / 2) - Math.round(chatHeader.offsetHeight) - 50)

      if (textArea.clientHeight > maxHeight) {
        console.log('add')
        textArea.style.maxHeight = textArea.clientHeight + 'px'
        textArea.style.overflowY = 'scroll'
        textArea.scrollTop = textArea.scrollHeight
      } else {
        textArea.style.maxHeight = 'inherit'
        textArea.style.overflowY = 'hidden'
      }
    },
  },
}
