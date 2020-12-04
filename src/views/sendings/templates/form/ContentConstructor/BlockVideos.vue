<template>
  <div>
    <v-textarea
      v-model="localBlock.value"
      placeholder="Введите текст"
      outlined
      rows="3"
    >
      <template slot="prepend-inner">
        <v-icon>$iconify_feather-edit</v-icon>
      </template>
    </v-textarea>
  </div>
</template>

<script>
  import BlockMixin from './block'

  export default {
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
    methods: {},
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
