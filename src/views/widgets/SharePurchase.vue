<template>
  <round-frame
    class="w-share-purchase"
    title="Общая доля продаж"
    :all-count="allCount"
    :current-count="currentCount"
    :percentage-difference="percentageDifference"
  />
</template>

<script>
  import RoundFrame from '@/views/widgets/frames/RoundFrame'

  export default {
    components: { RoundFrame },
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
        chartData: {},
      }
    },
    computed: {
      allCount () {
        if (this.chartData && this.chartData.totalSum) {
          return Number.parseInt(this.chartData.totalSum)
        }
        return 0
      },
      currentCount () {
        if (this.chartData && this.chartData.byProgramSum) {
          return Number.parseInt(this.chartData.byProgramSum)
        }
        return 0
      },
      percentageDifference () {
        if (this.chartData && this.chartData.byProgramSumPrev && this.chartData && this.chartData.byProgramSum && this.chartData.byProgramSumPrev > 0) {
          return Math.round(((Number.parseInt(this.chartData.byProgramSum) - Number.parseInt(this.chartData.byProgramSumPrev)) / this.chartData.byProgramSumPrev) * 100)
        }
        return 0
      },
    },
    watch: {
      widgetData (v) {
        console.log('watch data...')
        console.log(v)
        console.log('watch dadta...')

        this.chartData = v
      },
    },
    mounted () {
      console.log('diget data...')
      console.log(this.widgetData)
      console.log('diget data...')

      this.chartData = this.widgetData
    },
  }
</script>
