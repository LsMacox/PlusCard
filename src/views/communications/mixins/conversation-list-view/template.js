export default {
  methods: {
    getAvatars (item) {
      let avatars = []

      // есть чат пользователь
      if (this.chatUser && this.chatUser.id) {
        const chatUserId = this.chatUser.id
        let count = 0

        // количество активных участников чата
        item.members.forEach(item => {
          if (item.active) count++
        })

        if (count === 1) {
          avatars = [item.members[0].avatar]
        }

        if (count === 2) {
          const member = item.members.filter(item => item.id !== chatUserId)
          if (member.length) {
            avatars = [member[0].avatar]
          }
        }

        // Group Avatar
        if (count > 2) avatars = [this.getGroupImgData(item)]
      }

      return avatars
    },
    getGroupImgData (item) {
      const
        imgColor = '#D63DE5'
      const imgWidth = 48
      const imgHeight = 48

      const
        cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')

      cvs.width = imgWidth
      cvs.height = imgHeight
      cvs.style.display = 'block'

      // Fill background
      ctx.moveTo(0, 0)
      ctx.lineTo(imgWidth, 0)
      ctx.lineTo(imgWidth, imgHeight)
      ctx.lineTo(0, imgHeight)
      ctx.fillStyle = imgColor
      ctx.fill()

      // Draw font
      ctx.fillStyle = '#fff'
      ctx.font = '700 28px Gilroy'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (item.name) ctx.fillText(item.name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)
      if (item.display_name) ctx.fillText(item.display_name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)

      const imgData = cvs.toDataURL()
      cvs.remove()
      return imgData
    },
    getName (item) {
      let name = ''
      if (this.chatUser && !this.isEmptyObject(this.chatUser)) {
        const chatUserId = this.chatUser.id

        // чат пользователь - создатель чата
        if (item.name && chatUserId === item.creator_id) return item.name

        // количество активных участников чата
        let count = 0
        item.members.forEach(item => {
          if (item.active) count++
        })
        if (count === 1) {
          name = item.members[0].name
        }
        if (count === 2) {
          const member = item.members.filter(item => item.id !== chatUserId)
          if (member.length) {
            name = member[0].name
          }
        }
        if (count > 2) {
          if (item.name) return item.name
          item.members.forEach(item => {
            if (item.id !== chatUserId && item.active) {
              if (!name) name = item.name
              else name = name + ', ' + item.name
            }
          })
        }
      }
      return name
    },
    getLastTime (item) {
      let time = ''
      if (item.last_message) {
        time = item.last_message.created_at
        if (time) return this.getDate(time)
      }
      return time
    },
    getAuthorName (conversation) {
      if (conversation && conversation.last_message) {
        const item = conversation.last_message

        let author = {}
        let isEmployee = false

        if (item.sender_id === this.chatUser.id) isEmployee = true

        if (isEmployee) {
          if (this.realChatName) {
            author = this.getAuthor(item)
            if (author.id) {
              if (author.id === this.profile.id) return 'Вы'
              else return `${author.name} (${this.conversationProgram.name})`
            } else if (item.real_sender_id === this.chatUser.id) {
              // реальный отправитель чат-бот
              return this.chatUser.name
            }
          } else {
            author = this.getAuthor(item)
            if (author.id) {
              if (author.id === this.profile.id) return 'Вы'
              else return `${this.conversationProgram.name} (${author.name})`
            } else if (item.real_sender_id === this.chatUser.id) {
              // реальный отправитель чат-бот
              return this.chatUser.name
            }
          }
        } else {
          author = this.getAuthor(item)
          if (author.id) return `${author.name}`
        }
      }

      return 'Пользователь'
    },
    getAuthor (item) {
      let authorId = null
      let author = []
      let isEmployee = false

      if (item.sender_id === this.chatUser.id) isEmployee = true

      if (isEmployee) {
        authorId = item.real_sender_id
        author = this.employees.filter(item => item.id === authorId)
        if (author.length) return author[0]
      } else {
        authorId = item.sender_id
        author = this.members.filter(item => item.id === authorId)
        if (author.length) return author[0]
      }

      return {}
    },
    getLastMessage (item) {
      const message = item.last_message
      if (message) {
        // console.log(message)
        if (message && message.attachments.length) {
          if (message.attachments[0].type === 'message/text') { return message.attachments[0].content }
          if (message.attachments[0].type === 'plus/account') return 'карта'
          if (message.attachments[0].type === 'media/image') { return 'изображение' }
          if (message.attachments[0].type === 'media/audio') { return 'аудиосообщение' }
          if (message.attachments[0].type === 'media/video') return 'видео'
          if (message.attachments[0].type === 'media/file') return 'файл'
        }
        return message.message
      }
      return ''
    },
  },
}
