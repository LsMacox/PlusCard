export default {
  methods: {
    validateFile () {
      const attachFile = this.$refs.attachFile.files[0]
      if (attachFile) {
        if (attachFile.size > 30720000) {
          this.$refs.attachFile.value = null
          this.$notify({
            text: 'Размер файла превышает 30 МБ',
            type: 'error',
          })
        }
        this.previewAttachFile(attachFile)
      }
    },
    readPreview (file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    readFile (file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsBinaryString(file)
      })
    },
    async previewAttachFile (file) {
      this.attachLoading = true
      this.attachFileName = file.name
      this.attachFileType = file.type
      this.attachFilePreview = await this.readPreview(file)
      const binary = await this.readFile(file)
      this.attachFile = btoa(binary)
      const attach = {
        name: this.attachFileName,
        mime: this.attachFileType,
        data: this.attachFile,
        original: file,
      }
      if (this.files.length < 10) {
        this.files.push(attach)
        this.filesPreview.push(this.attachFilePreview)
      } else {
        this.$notify({
          text: 'Достигнуто предельное количество вложений - 10',
          type: 'error',
        })
      }
      this.attachLoading = false
      this.getImagePreviews()
    },
    // предпросмотр вложений
    showAttachments () {
      if (this.files.length) this.attachPreview = true
    },
    hideAttachments () {
      this.attachPreview = false
    },
    showAttachmentDelete (index) {
      this.$refs.attachmentPreview[index].style.display = 'block'
    },
    hideAttachmentDelete (index) {
      this.$refs.attachmentPreview[index].style.display = 'none'
    },
    attachmentDelete (index) {
      this.files.splice(index, 1)
      this.filesPreview.splice(index, 1)
      if (!this.files.length) this.attachPreview = false
    },
  },
}
