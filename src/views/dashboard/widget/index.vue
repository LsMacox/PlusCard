<template>
  <div class="widget-line">
    <div class="widget-line-block">
      <client-program />
    </div>
    <div class="widget-line-block">
      <purchase />
    </div>
    <div class="widget-line-block">
      <share-purchase />
    </div>
    <div class="widget-line-block" />
  </div>
</template>

<script>
  import Purchase from '@/views/widgets/Purchase'
  import SharePurchase from '@/views/widgets/SharePurchase'
  import ClientProgram from '@/views/widgets/ClientProgram'

  export default {
    components: {
      ClientProgram,
      Purchase,
      SharePurchase,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {

    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="sass" scoped>
.widget-line
  margin: 34px -10px 0 -10px
  display: flex
  align-items: center

  .widget-line-block
    margin: 0 10px
</style>
