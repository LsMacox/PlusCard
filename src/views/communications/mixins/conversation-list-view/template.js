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
      const message = this.conversation.last_message
      if (message) {
        if (message && message.attachments.length) {
          if (message.attachments[0].type === 'message/text') { return message.attachments[0].content }
          if (message.attachments[0].type === 'plus/account') return 'карта'
          if (message.attachments[0].type === 'media/image') { return 'изображение' }
          if (message.attachments[0].type === 'media/audio') { return 'аудиосообщение' }
          if (message.attachments[0].type === 'media/video') return 'видео'
          if (message.attachments[0].type === 'media/file') return 'файл'
        }
        if (message.message) {
          return message.message
        }

        if (this.authorName === 'Вы') {
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
      let avatars

      // есть чат пользователь
      if (this.chatUser && this.chatUser.id) {
        const chatUserId = this.chatUser.id
        const activeMembers = this.activeMembers.length

        if (activeMembers === 1) {
          avatars = this.conversation.members[0].avatar
        }

        if (activeMembers === 2) {
          const member = this.conversation.members.filter(item => item.id !== chatUserId)
          if (member.length) {
            avatars = member[0].avatar
          }
        }

        // Group Avatar
        if (activeMembers > 2) avatars = this.getGroupImgData(this.conversation)
      }

      return avatars
    },
    authorName () {
      if (this.conversation && this.conversation.last_message) {
        const item = this.conversation.last_message

        let author = {}
        let isEmployee = false

        if (item.sender_id === this.chatUser.id) isEmployee = true

        if (isEmployee) {
          if (this.realChatName) {
            author = this.getAuthor(item, this.payload)
            if (author.id) {
              if (author.id === this.profile.id) return 'Вы'
              else return `${author.name} (${this.conversationProgram.name})`
            } else if (item.real_sender_id === this.chatUser.id) {
              // реальный отправитель чат-бот
              return this.chatUser.name
            }
          } else {
            author = this.getAuthor(item, this.payload)
            if (author.id) {
              if (author.id === this.profile.id) return 'Вы'
              else return `${this.conversationProgram.name} (${author.name})`
            } else if (item.real_sender_id === this.chatUser.id) {
              // реальный отправитель чат-бот
              return this.chatUser.name
            }
          }
        } else {
          author = this.getAuthor(item, this.payload)
          if (author.id) return `${author.name}`
        }
      }

      return ''
    },
  },
}
