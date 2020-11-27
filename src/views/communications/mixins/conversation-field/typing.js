export default {
  methods: {
    messageEvent (conversationId, $event) {
      // ctrl + enter новая строка
      if ($event.ctrlKey === true && $event.code === 'Enter') {
        this.newMessage = this.newMessage + '\n'
      }
      if ($event.ctrlKey === true && $event.code === 'NumpadEnter') {
        this.newMessage = this.newMessage + '\n'
      }
      // enter отправка сообщения
      if ($event.ctrlKey === false && $event.code === 'Enter') {
        if (!this.sending) this.send(this.sendType)
      }
      if ($event.ctrlKey === false && $event.code === 'NumpadEnter') {
        if (!this.sending) this.send(this.sendType)
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
