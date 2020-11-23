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
    isEmptyObject (obj) {
      return JSON.stringify(obj) === '{}'
    },
  },
}
