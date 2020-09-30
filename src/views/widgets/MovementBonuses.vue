<template>
  <tripple-filled-diagram-frame
    class="w-movement-bonuses"
    :diagram-data="[credit, debit, expired]"
    :diagram-labels="dateLabels"
    :diagram-height="168"
    title="Движение бонусов"
    :sub-titles="['Начислено от суммы покупок','Списано от суммы покупок','Сгорело от суммы покупок']"
    :counts="[creditCurrent, debitCurrent, expiredCurrent]"
    :all-percentage-differences="allPercentageDiffs"
    :percentage-differences="percentageDiffs"
  />
</template>

<script>
  import TrippleFilledDiagramFrame from '@/views/widgets/frames/TrippleFilledDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { TrippleFilledDiagramFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data () {
      return {
        credit: [],
        debit: [],
        expired: [],
        dateLabels: [],
        total: 0,
      }
    },
    computed: {
      creditCurrent () {
        console.log('current credit')
        console.log(this.credit)
        console.log('current credit')
        return this.credit[0]
      },
      debitCurrent () {
        console.log('current debit')
        console.log(this.debit)
        console.log('current debit')
        return this.debit[0]
      },
      expiredCurrent () {
        console.log('current expired')
        console.log(this.expired)
        console.log('current expired')
        return this.expired[0]
      },
      percentageDiffs () {
        let creditDiff = 0
        let debitDiff = 0
        let expireDiff = 0

        if (this.credit) {
          creditDiff = this.relativeChange(this.credit[0], this.credit[1])
        }

        if (this.debit) {
          debitDiff = this.relativeChange(this.debit[0], this.debit[1])
        }

        if (this.expired) {
          expireDiff = this.relativeChange(this.expired[0], this.expired[1])
        }

        return [creditDiff, debitDiff, expireDiff]
      },
      allPercentageDiffs () {
        let creditDiff = 0
        let debitDiff = 0
        let expireDiff = 0

        if (this.total && this.credit && this.credit[1] > 0) {
          creditDiff = (this.credit[0] / this.total) * 100
        }

        if (this.total && this.debit && this.debit[1] > 0) {
          debitDiff = (this.debit[0] / this.total) * 100
        }

        if (this.total && this.expired && this.expired[1] > 0) {
          expireDiff = (this.expired[0] / this.total) * 100
        }

        return [creditDiff.toFixed(2), debitDiff.toFixed(2), expireDiff.toFixed(2)]
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
    mounted () {
      this.credit = this.widgetData.chart[0]
      this.debit = this.widgetData.chart[1]
      this.expired = this.widgetData.chart[2]
      this.dateLabels = this.widgetData.dateLabels
      this.total = this.widgetData.total
    },
    methods: {},
  }
</script>
