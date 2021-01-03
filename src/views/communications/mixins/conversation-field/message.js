export default {
  methods: {
    toBottomFeed () {
      const conversationFieldWrapper = this.$refs?.conversationFieldWrapper
      if (conversationFieldWrapper) conversationFieldWrapper.scrollTop = conversationFieldWrapper.scrollHeight
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
      const connectMessageCount = this.$store.getters['chat/message/connectMessageCount'] // макс. кол-во сообщ. для соеденения
      const msgKeys = Object.keys(messages) // массив ключей объекта messages
      let passed = 0 // для подсчета кол-во сообщений подряд от одного пользователя
      for (const id in messages) {
        const msgIdx = msgKeys.indexOf(id) // порядковый индекс
        const maxConcatCount = (msgIdx + connectMessageCount) // макс. кол-во сообщений для перебора
        for (let i = msgIdx; i < maxConcatCount; i++) {
          if (msgKeys[i]) {
            const message = messages[msgKeys[i]]
            if (
              (
                msgKeys[i + 1] &&
                message.sender_id === messages[msgKeys[i + 1]].sender_id &&
                message.real_sender_id === messages[msgKeys[i + 1]].real_sender_id
              ) && // если следующие сообщ. от проверяемого пользователя
              passed < connectMessageCount && // прошлый раз от этого пользователя проверено меньше 2 раз
              (
                !message.attachments.length ||
                (
                  message.attachments.length &&
                  message.attachments[0].type !== 'media/audio' &&
                  message.attachments[0].type !== 'media/video' &&
                  message.attachments[0].type !== 'media/image'
                )
              ) // если это не медиа файл
            ) {
              passed++
              message.connectNexMessageCount = passed
              message.connectNexMessage = true
            } else {
              passed = 0
              message.connectNexMessageCount = passed
              message.connectNexMessage = false
            }
          } else {
            break
          }
        }
      }
      return messages
    },
  },
}
