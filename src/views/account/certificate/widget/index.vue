<template>
  <v-row class="widget-line">
    <v-col
      :cols="6"
      :sm="6"
      :md="6"
    >
      <certificates />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="6"
    >
      <payments :widget-data="payments" />
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
        widgetData: [],
      }
    },
    computed: {
      payments () {
        return this.$store.getters['account/certificate/certificate/payments']
      },
    },
    watch: {
      payments (v) {
        console.log('WIDGETLINE')
        console.log(v)
        console.log('WIDGETLINE')
        this.widgetData = v
      },
    },
    mounted () {
      this.widgetData = this.payments
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
.widget-line {
  padding: 24px 0 0 0;
}
</style>
