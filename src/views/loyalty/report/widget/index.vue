<template>
  <v-row class="widget-line">
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <clients
        :widget-data="widgetClientData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <operations
        :widget-data="widgetOperationData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <operators
        :widget-data="widgetOperatorsData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <volume
        :widget-data="widgetVolumeData"
      />
    </v-col>
  </v-row>
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

<style lang="scss" scoped>
.widget-line {
  padding: 22px 0 0 0;
}
</style>
