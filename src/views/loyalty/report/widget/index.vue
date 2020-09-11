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
      <operators
        :widgetdata="widgetOperatorsData"
        :operators="operatorsData"
      />
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
      widgetRequest () {
        return {
          start_period: this.period.start,
          filter: this.filter,
          program_id: this.program.id,
          end_period: this.period.end,
        }
      },
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
      filter () {
        return this.$store.getters['widget/filter/filter']
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
      program () {
        return this.$store.getters['program/program']
      },
    },
    watch: {
      filter () {
        this.fetchData()
      },
      period () {
        this.fetchData()
      },
      program () {
        this.fetchData()
      },
    },
    created () {
      this.fetchData()
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
