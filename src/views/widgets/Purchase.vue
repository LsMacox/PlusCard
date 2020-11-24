<template>
  <double-diagram-frame
    class="w-purchase"
    :diagram-data="[diagramNewData, diagramTotalData]"
    :diagram-labels="[diagramNewLabels, diagramNewLabels]"
    :diagram-height="46"
    title="Продажи"
    :sub-titles="subTitles()"
    :counts="[formatNumberString(widgetData.byProgramSum), formatNumberString(widgetData.totalSum)]"
    :percentage-differences="[byProgramPercentageDifference, totalPercentageDifference]"
    name="purchase"
  />
</template>

<script>
  import DoubleDiagramFrame from '@/views/widgets/frames/DoubleDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import FormatNumber from '@/mixins/formatNumber'

  export default {
    name: 'Purchase',
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
        byProgramPercentageDifference: 0,
        totalPercentageDifference: 0,
      }
    },
    computed: {
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
          const byProgramData = v.chart[0]
          const totalData = v.chart[1]
          this.byProgramPercentageDifference = this.relativeChange(byProgramData[byProgramData.length - 1], byProgramData[byProgramData.length - 2])
          this.totalPercentageDifference = this.relativeChange(totalData[totalData.length - 1], totalData[totalData.length - 2])
        }
      },
    },
    mounted () {
      const byProgramData = this.widgetData.chart[0]
      const totalData = this.widgetData.chart[1]
      this.byProgramPercentageDifference = this.relativeChange(byProgramData[byProgramData.length - 1], byProgramData[byProgramData.length - 2])
      this.totalPercentageDifference = this.relativeChange(totalData[totalData.length - 1], totalData[totalData.length - 2])
    },
    methods: {
      subTitles () {
        const words = ['продажа', 'продажи', 'продаж']
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
