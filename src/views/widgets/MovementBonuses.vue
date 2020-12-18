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
      purchase () {
        return this.$store.getters['dashboard/purchase/widgetData']
      },
      creditCurrent () {
        // console.log('current credit')
        // console.log(this.credit)
        // console.log('current credit')
        return this.credit[this.credit.length - 1]
      },
      debitCurrent () {
        // console.log('current debit')
        // console.log(this.debit)
        // console.log('current debit')
        return this.debit[this.debit.length - 1]
      },
      expiredCurrent () {
        // console.log('current expired')
        // console.log(this.expired)
        // console.log('current expired')
        return this.expired[this.expired.length - 1]
      },
      percentageDiffs () {
        let creditDiff = 0
        let debitDiff = 0
        let expireDiff = 0

        if (this.credit) {
          creditDiff = this.relativeChange(this.credit[this.credit.length - 1], this.credit[this.credit.length - 2])
        }

        if (this.debit) {
          debitDiff = this.relativeChange(this.debit[this.debit.length - 1], this.debit[this.debit.length - 2])
        }

        if (this.expired) {
          expireDiff = this.relativeChange(this.expired[this.expired.length - 1], this.expired[this.expired.length - 2])
        }

        return [creditDiff, debitDiff, expireDiff]
      },
      allPercentageDiffs () {
        let creditDiff = 0
        let debitDiff = 0
        let expireDiff = 0

        if (this.purchase.byProgramSum && this.credit && this.credit[this.credit.length - 1] > 0) {
          creditDiff = (this.credit[this.credit.length - 1] / this.purchase.byProgramSum) * 100
        }

        if (this.purchase.byProgramSum && this.debit && this.debit[this.debit.length - 1] > 0) {
          debitDiff = (this.debit[this.debit.length - 1] / this.purchase.byProgramSum) * 100
        }

        if (this.purchase.byProgramSum && this.expired && this.expired[this.expired.length - 1] > 0) {
          expireDiff = (this.expired[this.expired.length - 1] / this.purchase.byProgramSum) * 100
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
