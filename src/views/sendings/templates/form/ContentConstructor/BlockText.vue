<template>
  <div>
    <editor
      v-model="localBlock.value"
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
  </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'
  import BlockMixin from './block'

  export default {
    components: {
      Editor,
    },
    mixins: [BlockMixin],
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
      localBlock: {
        handler (v) {
          this.updateBlock(v)
        },
        deep: true,
      },
      editor: {
        handler (v) {
          console.log(v)
          // this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock()
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
