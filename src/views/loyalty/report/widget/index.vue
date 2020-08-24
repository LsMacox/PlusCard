<template>
  <div class="widget-line">
    <div class="widget-line-block">
      <clients />
    </div>
    <div class="widget-line-block">
      <operations />
    </div>
    <div class="widget-line-block">
      <operators />
    </div>
    <div class="widget-line-block">
      <volume />
    </div>
  </div>
</template>

<script>
  import Clients from './Clients'
  import Operations from './Operations'
  import Operators from './Operators'
  import Volume from './Volume'

  export default {
    components: {
      Clients,
      Operations,
      Operators,
      Volume,
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
  margin: 34px 24px 0 24px
  display: flex
  align-items: center

  .widget-line-block
    margin: 0 10px
    width: 33.3333%
</style>
