export default {
  data () {
    return {
      img404: 'https://storage.yandexcloud.net/plusstorage/users/avatars/default.png',
    }
  },
  methods: {
    getDate (date) {
      if (!date) return '-'
      const time = new Date(date).getTime()
      const currentDate = this.$moment()
      const messageDate = this.$moment(time).local()

      let messageShortMonth = messageDate.format('MMM')
      if (messageShortMonth.lastIndexOf('.') > -1) messageShortMonth = messageShortMonth.slice(0, -1)
      const messageYear = messageDate.format('YYYY')
      const messageDay = messageDate.format('D')
      const messageDayAndMounth = messageDay + ' ' + messageShortMonth

      if (currentDate.diff(messageDate, 'years') === 0) {
        if (currentDate.diff(messageDate, 'days') === 0) {
          return messageDate.format('H:mm')
        } else {
          return messageDayAndMounth
        }
      }

      return messageDayAndMounth + ', ' + messageYear
    },
    getGroupImgData (msgItem) {
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
      if (msgItem.name) ctx.fillText(msgItem.name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)
      if (msgItem.display_name) ctx.fillText(msgItem.display_name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)

      const imgData = cvs.toDataURL()
      cvs.remove()
      return imgData
    },
    getAuthorName (msgItem, payload) {
      if (!payload) return

      let author = {}
      let isEmployee = false

      if (msgItem.sender_id === payload.chatUser.id) isEmployee = true

      if (isEmployee) {
        author = this.getAuthor(msgItem, payload)
        if (author.id) {
          return `${payload.conversationProgram.name} (${author.name})`
        } else if (msgItem.real_sender_id === payload.chatUser.id) { // реальный отправитель чат-бот
          return payload.chatUser.name
        }
      } else {
        author = this.getAuthor(msgItem, payload)
        if (author.id) return `${author.name}`
      }

      return 'Пользователь'
    },
    getAuthorAvatar (msgItem, payload) {
      if (!payload) return

      const author = this.getAuthor(msgItem, payload)
      if (author.id) return author.avatar
      // реальный отправитель чат-бот
      else if (msgItem.real_sender_id === this.chatUser.id) {
        return payload.chatUser.avatar
      }
      return this.img404
    },
    getAuthor (msgItem, payload) {
      if (!payload) return

      let authorId = null
      let author = []
      let isEmployee = false

      if (msgItem.sender_id === payload.chatUser.id) isEmployee = true

      if (isEmployee) {
        authorId = msgItem.real_sender_id
        author = payload.employees.filter((item) => item.id === authorId)
        if (author.length) return author[0]
      } else {
        authorId = msgItem.sender_id
        author = payload.members.filter((item) => item.id === authorId)
        if (author.length) return author[0]
      }

      return {}
    },
    formatMessage (message) {
      if (message) {
        message = message.replace(/<<*\s*(\w+)\s*>*>/gm, '$1')
        let str = message
        let pos = 0
        while (true) {
          const foundPos = str.indexOf('\n', pos)
          if (foundPos !== -1) str = str.replace('\n', '<br>')
          if (foundPos === -1) break
          pos = foundPos
        }
        const regex = /^(http|https):\/\/([\S]+)/gm
        const matchString = str.match(regex)
        if (matchString && matchString[0]) {
          const link =
            '<a target="_blank" href="' +
            matchString[0] +
            '">' +
            matchString[0] +
            '</a> '
          str = str.replace(matchString[0], link)
        }
        return str
      }
      return null
    },
    getMessage (msgItem) {
      const message = msgItem
      if (message) {
        if (message && message.attachments.length) {
          if (message.attachments[0].type === 'message/text') {
            return message.attachments[0].content
          }
          if (message.attachments[0].type === 'plus/account') return 'карта'
          if (message.attachments[0].type === 'media/image') {
            return 'изображение'
          }
          if (message.attachments[0].type === 'media/audio') {
            return 'аудиосообщение'
          }
          if (message.attachments[0].type === 'media/video') return 'видео'
          if (message.attachments[0].type === 'media/file') return 'файл'
        }
        return message.message
      }
      return ''
    },
    formatStatus (status) {
      if (status === 'sending') return 'Отправлено'
      if (status === 'delivered') return 'Доставлено'
      if (status === 'seen') return 'Просмотрено'
      return status
    },
    isEmptyObject (obj) {
      return JSON.stringify(obj) === '{}'
    },
    declOfNum (number, titles) {
      const cases = [2, 0, 1, 1, 1, 2]
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    },
    toRoute (path) {
      if (this.$route.path !== path) this.$router.push(path)
    },
  },
}
