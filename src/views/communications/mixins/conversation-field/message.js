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
    async updateMessages (messages) {
      this.overlayChat = false

      this.toBottomFeed()
      // обновление поиска по строке
      // массовое прочтение сообщений
      await this.$store.dispatch(
        'chat/message/toRead',
        this.currentConversationId,
      )
    },
    async fetchData (id) {
      // id чата
      if (id) {
        // асинхронная загрузка
        if (Object.keys(this.messages).length) {
          console.log('асинхронная загрузка')
          this._loadData(id)
        } else { // синхронная загрузка
          console.log('синхронная загрузка')
          this.loadingMessage = true
          await this._loadData(id)
        }
      }
    },
    async _loadData (convId) {
      console.log('loadData', convId)
      try {
        await this.$store.dispatch('chat/topic/list', convId)
        await this.$store.dispatch('chat/group/list', convId)

        const conversation = {
          id: convId,
          offset: 0,
          limit: 20,
        }

        await this.$store.dispatch('chat/message/list', conversation)
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingMessage = false
      }
    },
    async scrollFeed (e) {
      const h = e.target.scrollTop

      // загрузка страницы сообщений
      if (this.feedScrollTop > 0 && h === 0) {
        this.loadingMessagePage = true

        const keys = Object.keys(this.messages)
        if (keys.length) {
          this.messageIdToScrollPage = `message-${keys[0]}`
        }

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
        } finally {
          this.loadingMessagePage = false
        }
      }
      // Обновление поиска по сообщений, обновление происходит если поиск включен
      this.searchByFilterString()
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
