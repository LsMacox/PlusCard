export default {
  computed: {
    isAttachedFile () {
      return this.attachedFile instanceof File
    },
  },
  methods: {
    async addFile (event) {
      const file = event.target.files[0]

      if (this.validateFile(file)) {
        this.$store.commit('chat/sendbox/attachFile', file)
      }
    },
    validateFile (file) {
      if (!file) return false

      const notifyTitle = 'Прикрепление файла'

      if (file.size > 20720000) {
        this.$notify({
          title: notifyTitle,
          text: 'Размер файла превышает 20 МБ',
          type: 'error',
        })
        return false
      } else {
        this.$notify({
          title: notifyTitle,
          text: 'Файл прекреплен',
          type: 'success',
        })
        return true
      }
    },
  },
}
