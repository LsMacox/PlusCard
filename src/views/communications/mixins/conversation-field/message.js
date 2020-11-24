export default {
  methods: {
    getMessageIndexById (id) {
      const msg = Object.values(this.messages)
      const msgIndex = msg.findIndex(m => {
        return String(m.id) === String(id)
      })

      return msgIndex
    },
    closeReplyMessage () {
      this.quotedMessage = {}
      this.quotedMessageSender = null
      this.sendType = 'send'
      this.dialogReplyMessage = false
      if (this.overlayChat) {
        const elem = this.$refs.conversationField
        if (elem) elem.scrollTop = elem.scrollHeight
        this.overlayChat = false
      }
    },
    toBottomFeed () {
      const elem = this.$refs.conversationField
      if (elem) elem.scrollTop = elem.scrollHeight
    },
    scrollToMessageById (id) {
      const feed = this.$refs.conversationField
      const msg = document.getElementById('message-' + id)
      console.log(feed)

      if (msg) {
        console.log('scroll')
        feed.scrollTop = msg.offsetTop - 80 // поправка скролла ленты сообщений
      }
    },
    async updateMessages (messages) {
      this.overlayChat = false

      this.toBottomFeed()
      // массовое прочтение сообщений
      await this.$store.dispatch(
        'chat/message/toRead',
        this.currentConversationId,
      )
    },
    async send (type) {
      if (this.validateSendMessage) {
        this.sending = true
        // токен чат-пользователя для операций с чатами
        const message = {
          conversation_id: this.currentConversationId,
          message_id: this.quotedMessage ? this.quotedMessage.id : null,
          message: this.newMessage,
          media: this.files,
          topic_id: this.selectedTopicId,
          recipients: Array.from(new Set(this.recipients)),
          type: type,
        }

        await this.$store.dispatch('chat/message/send', message)
        this.clearForm()
      }
    },
    async fetchData (id) {
      // id чата
      if (id) {
        this.loadingMessage = true

        // асинхронная загрузка
        if (Object.keys(this.messages).length) {
          console.log('асинхронная загрузка')
          try {
            this.$store.dispatch('chat/topic/list', id)
            this.$store.dispatch('chat/group/list', id)

            const conversation = {
              id,
              offset: 0,
              limit: 20,
            }

            this.$store.dispatch('chat/message/list', conversation)
          } catch (e) {
            console.error(e)
          } finally {
            this.loadingMessage = false
          }
        } else { // синхронная загрузка
          console.log('синхронная загрузка')
          try {
            await this.$store.dispatch('chat/topic/list', id)
            await this.$store.dispatch('chat/group/list', id)

            const conversation = {
              id,
              offset: 0,
              limit: 20,
            }

            await this.$store.dispatch('chat/message/list', conversation)
          } catch (e) {
            console.error(e)
          } finally {
            this.loadingMessage = false
          }
        }
      }
    },
    async scrollFeed (e) {
      const h = e.target.scrollTop

      // загрузка страницы сообщений
      if (this.feedScrollTop > 0 && h === 0) {
        const keys = Object.keys(this.messages)
        if (keys.length) {
          this.messageIdToScrollPage = `message${keys[0]}`
        }

        this.loadingMessagePage = true
        try {
          const conversation = {
            id: this.currentConversationId,
            offset: 0,
            limit: 20,
          }

          if (this.messages && Object.keys(this.messages).length) {
            conversation.offset = Object.keys(this.messages).length
          }

          await this.$store.dispatch('chat/message/list', conversation)
        } catch (e) {}
        this.loadingMessagePage = false
      }
      this.feedScrollTop = h
    },
    init () {
      var observe
      if (window.attachEvent) {
        observe = function (element, event, handler) {
          element.attachEvent('on' + event, handler)
        }
      } else {
        observe = function (element, event, handler) {
          element.addEventListener(event, handler, false)
        }
      }
      var text = document.getElementById('message')

      if (text) {
        const resize = () => {
          text.style.height = 'auto'
          text.style.height = text.scrollHeight + 'px'
        }

        /* 0-timeout to get the already changed text */
        const delayedResize = () => {
          window.setTimeout(resize, 0)
        }

        observe(text, 'change', resize)
        observe(text, 'cut', delayedResize)
        observe(text, 'paste', delayedResize)
        observe(text, 'drop', delayedResize)
        observe(text, 'keydown', delayedResize)

        text.focus()
        text.select()
        resize()
      }

      window.onresize = this.toBottomFeed()
    },
  },
}
