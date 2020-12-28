export default {
  methods: {
    clearForm () {
      this.message = ''
      this.$store.dispatch('chat/sendbox/clearForm')
      this.$store.commit('chat/message/recipients', [])
      this.$store.commit('chat/conversation/setCurrentConversationMessage', '')
      this.$emit('send-message')
    },
    // отправляем сообщение
    async send () {
      if (this.sending) return

      if (this.validateSendMessage()) {
        try {
          this.sending = true
          if (this.isEdit) {
            await this.$store.dispatch('chat/sendbox/sendUpdateMessage')
          } else {
            await this.$store.dispatch('chat/sendbox/sendForm')
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
    textAreaFocus () {
      setTimeout(() => {
        this.$refs.messageTextArea.$el.querySelector('textarea').focus()
      }, 0)
    },
    validateSendMessage () {
      if (
        this.isAttachedFile ||
        (
          this.messageText &&
          this.formatMessage(this.messageText).replace(/\s+/, ' ').replace(/\s/, '').length
        )
      ) {
        return true
      }
      return false
    },
    clearMessage () {
      this.message = ''
    },
  },
}
