<template>
  <v-row class="widget-line">
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <clients
        :widgetdata="widgetClientData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <operations
        :widgetdata="widgetOperationData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <operators
        :widgetdata="widgetOperatorsData"
      />
    </v-col>
    <v-col
      :xs="6"
      :sm="6"
      :md="3"
    >
      <volume
        :widgetdata="widgetVolumeData"
      />
    </v-col>
  </v-row>
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
      widgetVolumeData () {
        return this.$store.getters['widget/bonuses/widgetData']
      },
    },
  }
</script>

<style lang="scss" scoped>
.widget-line {
  padding: 22px 0 0 0;
}
</style>
