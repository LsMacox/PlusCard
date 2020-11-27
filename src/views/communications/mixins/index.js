export default {
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
          return messageDate.format('h:m')
        } else {
          return messageDayAndMounth
        }
      }

      return messageDayAndMounth + ', ' + messageYear
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
