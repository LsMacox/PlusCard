<template>
  <div style="display: flex; align-items: center;">
    <div
      v-for="(item, i) in block.value"
      :key="i"
      class="pls--pushcon-block-image"
    >
      <input
        :ref="(inputRef + i)"
        :key="(inputRef + i) + 'input'"
        type="file"
        class="pls--pushcon-block-image-input"
        @change="beforeUpload((inputRef + i))"
      >
      <div>
        <v-img
          v-if="item.url"
          class="pls--pushcon-block-image-img"
          height="150"
          width="150"
          :src="item.url"
          @click="openFileWindow((inputRef + i))"
        >
          <div
            class="pls--pushcon-block-image-img-delete"
            @click.stop="removeFile((inputRef + i))"
          >
            <v-icon>
              $iconify_chrome-close
            </v-icon>
          </div>
        </v-img>
        <div
          v-else
          class="pls--pushcon-block-image-img"
          @click="openFileWindow((inputRef + i))"
        >
          <v-icon
            class="pls--pushcon-block-image-img-dummy"
          >
            +
          </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BlockMixin from './block'
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
      localBlock: {
        handler (v) {
          this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock()
    },
    methods: {
      openFileWindow (inputRef) {
        console.log(inputRef)
        console.log(this.$refs)
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
        this.block.value = await this.readAsDataURL(file)
      },
      removeFile (inputRef) {
        this.block.value = null
        this.$refs[inputRef].value = null
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
