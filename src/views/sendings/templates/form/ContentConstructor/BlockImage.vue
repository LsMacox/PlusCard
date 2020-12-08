<template>
  <div class="pls--pushcon-block-image">
    <input
      :ref="inputRef"
      type="file"
      class="pls--pushcon-block-image-input"
      @change="beforeUpload(inputRef)"
    >
    <div v-if="!loading">
      <v-img
        v-if="localBlock.value.url"
        class="pls--pushcon-block-image-img"
        height="150"
        width="150"
        :src="localBlock.value.url"
        @click="openFileWindow(inputRef)"
      >
        <div
          class="pls--pushcon-block-image-img-delete"
          @click.stop="removeFile()"
        >
          <v-icon>
            $iconify_chrome-close
          </v-icon>
        </div>
      </v-img>
      <div
        v-else
        class="pls--pushcon-block-image-img"
        @click="openFileWindow(inputRef)"
      >
        <v-icon
          class="pls--pushcon-block-image-img-dummy"
        >
          +
        </v-icon>
      </div>
    </div>
    <div v-else>
      <div class="pls--pushcon-block-image-img">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import BlockMixin from './blockMixin'
  import File from '@/mixins/file'

  export default {
    mixins: [BlockMixin, File],
    props: {
      block: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        loading: false,
        localBlock: {},
        inputRef: 'inputFile',
        maxFileSize: 10240000, // 10 Mb
        acceptedFiles: [
          'image/jpeg',
          'image/png',
        ],
      }
    },
    computed: {},
    watch: {
      block: {
        handler (v) {
          if (!this.objectComparison(v, this.localBlock)) this.initBlock(v)
        },
        deep: true,
      },
      localBlock: {
        handler (v) {
          this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock(this.block)
    },
    methods: {
      openFileWindow (inputRef) {
        this.$refs[inputRef].click()
      },
      async beforeUpload (inputRef) {
        const file = this.$refs[inputRef].files[0]
        if (!this.acceptedFiles.includes(file.type)) {
          return this.$notify({
            type: 'error',
            title: 'Изображение',
            text: 'Неверный тип файла',
          })
        }
        if (file.size > this.maxFileSize) {
          this.$refs[inputRef].value = null
          return this.$notify({
            type: 'error',
            title: 'Изображение',
            text: 'Превышен максимальный размер файла',
          })
        }
        // this.localBlock.value.url = await this.readAsDataURL(file)
        // this.localBlock.value.data = file
        await this.uploadFile(file)
      },
      async uploadFile (file) {
        try {
          this.loading = true
          const formData = new FormData()
          formData.append('id', this.localBlock.id)
          formData.append('type', this.localBlock.type)
          formData.append('files[0]', file)
          await this.$store.dispatch('company/notifications/uploadAttachmentFile', formData)
        } finally {
          this.clearFile(this.inputRef)
          this.loading = false
        }
      },
      async removeFile () {
        try {
          this.loading = true
          const item = {
            id: this.localBlock.id,
          }
          await this.$store.dispatch('company/notifications/deleteAttachmentFile', item)
        } finally {
          this.clearFile(this.inputRef)
          this.loading = false
        }
      },
      clearFile (inputRef) {
        this.$refs[inputRef].value = null
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
