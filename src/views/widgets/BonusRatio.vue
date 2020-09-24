<template>
  <vertical-progress-frame
    class="w-bonus-ratio"
    title="Cоотношение бонусов"
    :sub-titles="['Начислено', 'Списано', 'Сгорело']"
    :percentage-difference="[creditPercent, debitPercent, expiredPercent]"
  />
</template>

<script>
  import VerticalProgressFrame from '@/views/widgets/frames/VerticalProgressFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { VerticalProgressFrame },
    mixins: [WidgetFunctions],
    props: ['widgetData'],
    data () {
      return {
        creditPercent: 0,
        debitPercent: 0,
        expiredPercent: 0,
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
          this.credit = v.chart[0]
          this.debit = v.chart[1]
          this.expired = v.chart[2]
          this.dateLabels = v.dateLabels
          this.total = v.total
        }
      },
    },
    mounted () {},
    methods: {},
  }
</script>
