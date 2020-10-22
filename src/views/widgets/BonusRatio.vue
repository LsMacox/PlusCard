<template>
  <vertical-progress-frame
    class="w-bonus-ratio"
    title="Cоотношение бонусов"
    :sub-titles="['Начислений', 'Списаний', 'Сгораний']"
    :percentage-differences="[creditRatio, debitRatio, expiredRatio]"
  />
</template>

<script>
  import VerticalProgressFrame from '@/views/widgets/frames/VerticalProgressFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { VerticalProgressFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        creditRatio: 0,
        debitRatio: 0,
        expiredRatio: 0,
      }
    },
    computed: {
      ratio () {
        return 0
      },
    },
    watch: {
      widgetData (v) {
        if (v) {
          this.creditRatio = v.bonusRatio[0]
          this.debitRatio = v.bonusRatio[1]
          this.expiredRatio = v.bonusRatio[2]
        }
      },
    },
    mounted () {
      console.log('bonus ratio')
      console.log(this.widgetData)
      console.log('bonus ratio')
      if (this.widgetData && this.widgetData.bonusRatio) {
        this.creditRatio = this.widgetData.bonusRatio[0]
        this.debitRatio = this.widgetData.bonusRatio[1]
        this.expiredRatio = this.widgetData.bonusRatio[2]
      }
    },
    methods: {},
  }
</script>
