<template>
  <div>
    <editor
      v-model="localBlock.value.text"
      api-key=""
      output-format="html"
      :init="{
        height: 264,
        language: 'ru',
        menubar: false,
        statusbar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
      }"
    />
    <div style="margin: 7px 0 0 0; text-align: right;">
      длина сообщения: {{ String(localBlock.value.text).length }} {{ declOfNum(String(localBlock.value.text).length, ['символ', 'символа', 'символов']) }}
    </div>
  </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
  import BlockMixin from './blockMixin'
  import ConvertorMixin from '@/mixins/convertor'

  export default {
    components: {
      Editor,
    },
    mixins: [BlockMixin, ConvertorMixin],
    props: {
      block: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        localBlock: {},
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
          // if (String(v.value.text).length > 2048) this.localBlock.value.text = String(v.value.text).slice(0, 2049)
          this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock(this.block)
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
