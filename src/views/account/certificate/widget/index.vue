<template>
  <v-row class="widget-line">
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <certificates
        :widget-data="widgetClientData"
      />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <payments/>
    </v-col>
  </v-row>
</template>

<script>
  import Certificates from '@/views/widgets/Certificates'
  import Payments from '@/views/widgets/Payments'

  export default {
    components: {
      Certificates,
      Payments,
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
  padding: 24px 0 0 0;
}
</style>
