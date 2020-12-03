<template>
  <cert-payment-statuses-frame
    class="w-payment"
    title="Выплаты"
    :sub-titles="['Всего', 'Выплачено', 'Ожидает', 'Не выплачено', 'Не требуется']"
    :colors="['#4776E6', '#00D15D', '#FFA338', '#EA4C2A', '#B5B5C4']"
    :percentage-differences="payments"
  />
</template>

<script>
  import CertPaymentStatusesFrame from '@/views/widgets/frames/CertPaymentStatusesFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { CertPaymentStatusesFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default: () => [0, 0, 0, 0, 0],
      },
    },
    data () {
      return {
        payments: [0, 0, 0, 0, 0],
      }
    },
    computed: {
    },
    watch: {
      widgetData (v) {
        if (v) {
          this.payments = v
        }
      },
    },
    mounted () {
      console.log('WIDGET_DATE')
      console.log(this.widgetData)
      console.log('WIDGET_DATE')
      this.payments = this.widgetData
    },
    methods: {},
  }
</script>
