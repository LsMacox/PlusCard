export default {
  computed: {
    lastTime () {
      let time = ''
      if (this.conversation.last_message) {
        time = this.conversation.last_message.created_at
        if (time) return this.getDate(time)
      }
      return time
    },
    lastMessage () {
      const msgItem = this.conversation.last_message
      if (msgItem) {
        if (msgItem.attachments.length) {
          return this.getShortMessage(msgItem)
        }

        if (msgItem.message) {
          return this.formatMessage(msgItem.message)
        }

        if (
          this.authorName === 'Вы'
        ) {
          return 'пересланное сообщение'
        }
        return ''
      }
      return ''
    },
    name () {
      let name = ''
      if (this.chatUser && !this.isEmptyObject(this.chatUser)) {
        const chatUserId = this.chatUser.id

        // чат пользователь - создатель чата
        if (this.conversation.name && chatUserId === this.conversation.creator_id) return this.conversation.name

        // количество активных участников чата
        let count = 0
        this.conversation.members.forEach(item => {
          if (item.active) count++
        })
        if (count === 1) {
          name = this.conversation.members[0].name
        }
        if (count === 2) {
          const member = this.conversation.members.filter(item => item.id !== chatUserId)
          if (member.length) {
            name = member[0].name
          }
        }
        if (count > 2) {
          if (this.conversation.name) return this.conversation.name
          this.conversation.members.forEach(item => {
            if (item.id !== chatUserId && item.active) {
              if (!name) name = item.name
              else name = name + ', ' + item.name
            }
          })
        }
      }
      return name
    },
    avatar () {
      let avatar

      // есть чат пользователь
      if (this.chatUser && this.chatUser.id) {
        if (this.activeMembers.length === 1) {
          avatar = this.conversation.members[0].avatar
        }

        if (this.activeMembers.length === 2) {
          const member = this.conversation.members.filter(item => item.id !== this.chatUser.id)
          if (member.length) {
            avatar = member[0].avatar
          }
        }

        // Group Avatar
        if (this.activeMembers.length > 2) avatar = this.getGroupImgData(this.conversation)
      }

      return avatar
    },
    authorName () {
      if (this.conversation && this.conversation.last_message) {
          const item = this.conversation.last_message

          const author = this.getAuthor(item, this.payload)
          let isEmployee = false

          if (item.sender_id === this.chatUser.id) isEmployee = true

          if (!author.id && item.real_sender_id === this.chatUser.id) {
            return this.chatUser.name
          }

          if (isEmployee) {
            if (author.id === this.profile.id) {
              return 'Вы'
            } else if (this.realChatName) {
              return `${author.name} (${this.conversationProgram.name})`
            } else {
              if (author.name) {
                return `${this.conversationProgram.name} (${author.name})`
              }
              return `${this.conversationProgram.name}`
            }
          } else {
            if (author.id) return `${author.name}`
          }
        }

        return ''
    },
  },
}
