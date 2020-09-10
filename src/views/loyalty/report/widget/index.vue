<template>
  <div class="widget-line">
    <div class="widget-line-block">
      <clients
        :widgetdata="widgetClientData"
      />
    </div>
    <div class="widget-line-block">
      <operations
        :widgetdata="widgetOperationData"
      />
    </div>
    <div class="widget-line-block">
      <operators />
    </div>
    <div class="widget-line-block">
      <volume
        :widgetdata="widgetVolumeData"
      />
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
    data () {
      return {
      }
    },
    computed: {
      widgetClientData () {
        return this.$store.getters['widget/bonusClients/widgetData']
      },
      widgetOperationData () {
        return this.$store.getters['widget/operations/widgetData']
      },
      widgetOperatorsData () {
        return this.$store.getters['widget/operators/widgetData']
      },
      operatorsData () {
        return this.$store.getters['widget/operators/operators']
      },
      widgetVolumeData () {
        return this.$store.getters['widget/bonuses/widgetData']
      },
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
    width: 100%
</style>
