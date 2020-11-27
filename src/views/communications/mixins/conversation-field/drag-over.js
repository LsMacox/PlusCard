export default {
  methods: {
    getImagePreviews () {
      for (let i = 0; i < this.files.length; i++) {
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          const reader = new FileReader()
          reader.addEventListener(
            'load',
            function () {
              this.$refs['preview' + parseInt(i)][0].src = reader.result
              if (
                this.$refs['preview' + parseInt(i)][0].naturalHeight >
                this.$refs['preview' + parseInt(i)][0].naturalWidth
              ) {
                this.$refs['preview' + parseInt(i)][0].height = 260
                this.$refs['preview' + parseInt(i)][0].style.height = '260px'
                this.$refs['preview' + parseInt(i)][0].width = 146
                this.$refs['preview' + parseInt(i)][0].style.width = '146px'
              }
              if (
                this.$refs['preview' + parseInt(i)][0].naturalHeight <
                this.$refs['preview' + parseInt(i)][0].naturalWidth
              ) {
                this.$refs['preview' + parseInt(i)][0].height = 146
                this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                this.$refs['preview' + parseInt(i)][0].width = 260
                this.$refs['preview' + parseInt(i)][0].style.width = '260px'
              } else {
                this.$refs['preview' + parseInt(i)][0].height = 146
                this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                this.$refs['preview' + parseInt(i)][0].width = 146
                this.$refs['preview' + parseInt(i)][0].style.width = '146px'
              }
            }.bind(this),
            false,
          )
          reader.readAsDataURL(this.files[i].original)
        } else {
          this.$nextTick(function () {
            this.$refs['preview' + parseInt(i)][0].src =
              'https://nektony.com/wp-content/uploads/2016/10/file.svg'
            if (
              this.$refs['preview' + parseInt(i)][0].naturalHeight >
              this.$refs['preview' + parseInt(i)][0].naturalWidth
            ) {
              this.$refs['preview' + parseInt(i)][0].height = 260
              this.$refs['preview' + parseInt(i)][0].style.height = '260px'
              this.$refs['preview' + parseInt(i)][0].width = 146
              this.$refs['preview' + parseInt(i)][0].style.width = '146px'
            }
            if (
              this.$refs['preview' + parseInt(i)][0].naturalHeight <
              this.$refs['preview' + parseInt(i)][0].naturalWidth
            ) {
              this.$refs['preview' + parseInt(i)][0].height = 146
              this.$refs['preview' + parseInt(i)][0].style.height = '146px'
              this.$refs['preview' + parseInt(i)][0].width = 260
              this.$refs['preview' + parseInt(i)][0].style.width = '260px'
            } else {
              this.$refs['preview' + parseInt(i)][0].height = 146
              this.$refs['preview' + parseInt(i)][0].style.height = '146px'
              this.$refs['preview' + parseInt(i)][0].width = 146
              this.$refs['preview' + parseInt(i)][0].style.width = '146px'
            }
          })
        }
      }
    },
    visibleDragArea () {
      var element = document.getElementById('file-drag-drop')
      element.style.display = 'block'
    },
    onDragOver (e) {
    // console.log('files in drop zone');
    },
    determineDragAndDropCapable () {
      var div = document.createElement('div')
      return (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      )
    },
  },
}
