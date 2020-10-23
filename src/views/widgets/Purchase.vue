<template>
  <double-diagram-frame
    class="w-purchase"
    :diagram-data="[diagramNewData, diagramTotalData]"
    :diagram-labels="[diagramNewLabels, diagramNewLabels]"
    :diagram-height="46"
    title="Покупки"
    :titles="titles"
    :sub-titles="subTitles()"
    :counts="[formatNumberString(widgetData.byProgramSum), formatNumberString(widgetData.totalSum)]"
    :percentage-differences="[byProgramPD, totalPD]"
  />
</template>

<script>
  import DoubleDiagramFrame from '@/views/widgets/frames/DoubleDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import FormatNumber from '@/mixins/formatNumber'

  export default {
    components: { DoubleDiagramFrame },
    mixins: [WidgetFunctions, FormatNumber],
    props: {
      widgetData: {
        type: Object,
        default: () => {
          return [7].fill({
            count: 0,
            date_start: '2020-09-08',
            date_end: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {
        totalWD: [0, 0, 0, 0, 0, 0, 0],
        byProgramWD: [0, 0, 0, 0, 0, 0, 0],
        // diagramOptions: {
        //   pointRadius: 4,
        //   pointBorderWidth: 2.5,
        //   tooltips: {
        //     display: false,
        //   },
        // },
        titles: ['покупка', 'покупки', 'покупок'],
      }
    },
    computed: {
      byProgramPurchases () {
        console.log('this.byProgramWD')
        console.log(this.byProgramWD)
        console.log('this.byProgramWD')
        return this.byProgramWD.length ? this.byProgramWD[0][this.byProgramWD.length - 1].sum / 100 : 0
      },
      totalPurchases () {
        return this.totalWD.length ? this.totalWD[1][this.totalWD.length - 1].sum / 100 : 0
      },
      totalPD () {
        if (this.totalWD && this.totalWD.length >= 2) {
          if (this.totalWD[1] > 0) {
            return this.relativeChange(this.totalWD[this.totalWD.length - 1].sum, this.totalWD[this.totalWD.length - 2].sum)
          }
        }
        return 0
      },
      byProgramPD () {
        if (this.byProgramWD && this.byProgramWD.length >= 2) {
          if (this.byProgramWD[1] > 0) {
            return this.relativeChange(this.byProgramWD[this.byProgramWD.length - 1], this.byProgramWD[this.byProgramWD.length - 2])
          }
        }
        return 0
      },
      diagramNewLabels () {
        return this.prepareDiagramLabels(this.widgetData.chart[0], 'count')
      },
      diagramTotalLabels () {
        return this.prepareDiagramLabels(this.widgetData.chart[1], 'count')
      },
      diagramNewData () {
        return this.$_.map(this.widgetData.chart[0], 'count')
      },
      diagramTotalData () {
        return this.$_.map(this.widgetData.chart[1], 'count')
      },
    },
    watch: {
      widgetData (v) {
        if (v && v.chart[0] && v.chart[1]) {
          this.byProgramWD = v.chart[0].reverse()
          this.totalWD = v.chart[1].reverse()
        }
      },
    },
    mounted () {
      this.byProgramWD = this.widgetData.chart[0].reverse()
      this.totalWD = this.widgetData.chart[1].reverse()
    },
    methods: {
      subTitles () {
        const words = ['покупка', 'покупки', 'покупок']
        return [
          this.formatNumberString(this.widgetData.byProgramCount) + ' ' + this.getWord(this.widgetData.byProgramCount, words) + ' по программе',
          this.formatNumberString(this.widgetData.totalCount) + ' ' + this.getWord(this.widgetData.totalCount, words) + ' всего',
        ]
      },
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_purchase.scss";

</style>
