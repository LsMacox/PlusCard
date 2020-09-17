<template>
  <div class="widget-line">
    <div class="widget-line-block">
      <clients
        :widget-data="widgetClientData"
      />
    </div>
    <div class="widget-line-block">
      <operations
        :widget-data="widgetOperationData"
      />
    </div>
    <div class="widget-line-block">
      <operators
        :widget-data="widgetOperatorsData"
        :operators="operatorsData"
      />
    </div>
    <div class="widget-line-block">
      <volume
        :widget-data="widgetVolumeData"
      />
    </div>
  </div>
</template>

<script>
  import WidgetRequest from '@/views/widgets/mixins/WidgetRequest.js'
  import Clients from '@/views/widgets/Clients'
  import Operations from '@/views/widgets/Operations'
  import Operators from '@/views/widgets/Operators'
  import Volume from '@/views/widgets/Volume'

  export default {
    components: {
      Clients,
      Operations,
      Operators,
      Volume,
    },
    mixins: [WidgetRequest],
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
      widgetVolumeData () {
        return this.$store.getters['widget/bonuses/widgetData']
      },
      operatorsData () {
        return this.$store.getters['widget/operators/operators']
      },
    },
    mounted () {},
    methods: {
      fetchData () {
        this.$store.dispatch('widget/bonusClients/widget', this.widgetRequest)
        this.$store.dispatch('widget/operations/widget', this.widgetRequest)
        this.$store.dispatch('widget/bonuses/widget', this.widgetRequest)
        // this.$store.dispatch('widget/operators/widget', this.widgetRequest)
        // this.$store.dispatch('widget/operators/operators')
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
