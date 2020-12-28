export default {
  methods: {
    toBottomFeed () {
      const elem = this.$refs.conversationField
      if (elem) elem.scrollTop = elem.scrollHeight
    },
    async updateMessages (messages) {
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
    async _loadData (id) {
       try {
        await this.$store.dispatch('chat/topic/list', id)
        await this.$store.dispatch('chat/group/list', id)

        const conversation = {
          id: id,
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
        if (this.isAllMessagesLoaded) return

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
          // Обновление поиска по сообщений, обновление происходит если поиск включен
          this.searchByFilterString()
        }
      }
      this.feedScrollTop = h
    },
    connectingMessages (messages) {
      const msgKeys = Object.keys(messages)
      let passed = 0
      for (const id in messages) {
        const msgIdx = msgKeys.indexOf(id)
        for (let i = msgIdx; i < (msgIdx + 2); i++) {
          if (msgKeys[i]) {
            const message = messages[msgKeys[i]]
            if (
              msgKeys[i + 1] &&
              message.sender_id === messages[msgKeys[i + 1]].sender_id &&
              message.real_sender_id === messages[msgKeys[i + 1]].real_sender_id &&
              passed < 2
            ) {
              passed++
              message.connectNexMessage = true
            } else {
              passed = 0
              message.connectNexMessage = false
            }
          } else {
            break
          }
        }
      }
      return messages
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
