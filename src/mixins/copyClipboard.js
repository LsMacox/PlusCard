export default {
    methods: {
      async copyClipboard (text, successText = 'cкопировано в буфер', errorText = '') {
        this.$copyText(text).then((e) => {
          if (successText) {
            this.$notify({
              title: successText,
              text: '',
              type: 'success',
            })
          }
        }).catch((e) => {
          console.error(e)
          if (errorText) {
            this.$notify({
              title: errorText,
              text: 'Ошибка:' + e,
              type: 'error',
            })
          }
        })
      },
    },
}
