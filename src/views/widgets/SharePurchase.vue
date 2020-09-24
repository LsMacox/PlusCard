<template>
  <round-frame
    class="w-share-purchase"
    title="Общая доля покупок"
    :all-count="allCount"
    :current-count="currentCount"
    :percentage-difference="percentageDifference"
  />
</template>

<script>
  import RoundFrame from '@/views/widgets/frames/RoundFrame'

  export default {
    components: { RoundFrame },
    props: ['widgetData'],
    data () {
      return {
        chartData: {},
      }
    },
    computed: {
      allCount () {
        console.log('allCount')
        console.log(this.chartData.total)
        return this.chartData.total
      },
      currentCount () {
        console.log('current')
        console.log(this.chartData.current)
        return this.chartData.current
      },
      prevCount () {
        console.log('prev')
        console.log(this.chartData.prev)
        return this.chartData.prev
      },
      percentageDifference () {
        if (this.prevCount && this.prevCount > 0 && this.currentCount && this.currentCount > 0) {
          return Math.round(((this.currentCount - this.prevCount) / this.prevCount) * 100)
        }
        return 0
      },
    },
    watch: {
      widgetData (v) {
        console.log('watch data...')
        console.log(v)
        console.log('watch data...')

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
