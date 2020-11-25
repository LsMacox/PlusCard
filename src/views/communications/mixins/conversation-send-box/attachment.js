export default {
  methods: {
    readPreview (file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = () => {
        /// /console.log(reader.error);
        }
        reader.readAsDataURL(file)
      })
    },
    readFile (file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = () => {
        /// /console.log(reader.error);
        }
        reader.readAsBinaryString(file)
      })
    },
    getThumb (file) {
      if (file.type.match('image')) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()

          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } else if (file.type.match('video')) {
        return new Promise(function (resolve, reject) {
          var fileReader = new FileReader()

          fileReader.onload = function () {
            var blob = new Blob([fileReader.result], { type: file.type })
            var url = URL.createObjectURL(blob)
            var video = document.createElement('video')
            var timeupdate = function () {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate)
                video.pause()
              }
            }
            video.addEventListener('loadeddata', function () {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate)
              }
            })
            var snapImage = () => {
              var canvas = document.createElement('canvas')
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              canvas
                .getContext('2d')
                .drawImage(video, 0, 0, canvas.width, canvas.height)
              resolve(canvas.toDataURL())
            }
            video.addEventListener('timeupdate', timeupdate)
            video.preload = 'metadata'
            video.src = url
            // Load video in Safari / IE11
            video.muted = true
            video.playsInline = true
            video.play()
          }
          fileReader.onerror = reject
          fileReader.readAsArrayBuffer(file)
        })
      } else {
        return new Promise(function (resolve, reject) {
          resolve('/img/fileThumb.png')
        })
      }
    },
    async previewAttachFile (file, i) {
      this.attachLoading = true
      this.attachFileName = file.name
      this.attachFileType = file.type
      const binary = await this.readFile(file)
      this.attachFile = btoa(binary)
      const thumb = await this.getThumb(file)
      const attach = {
        name: this.attachFileName,
        mime: this.attachFileType,
        data: this.attachFile,
        original: file,
        thumb: thumb,
      }
      if (this.files.length < 10) {
        this.files.push(attach)
        this.formDataFiles.push(file)
      } else {
        this.$notify({
          message: 'Достигнуто предельное количество вложений',
          type: 'error',
        })
      }
      this.attachLoading = false
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
      this.formDataFiles.splice(index, 1)
      if (!this.files.length) this.attachPreview = false
    },
  },
}
