<template>
  <double-diagram-frame
    class="w-purchase"
    :diagram-data="[byProgramWD, totalWD]"
    :diagram-labels="[totalWD, byProgramWD]"
    :diagram-height="46"
    title="Покупки"
    :sub-titles="subTitles()"
    :counts="[byProgramPurchases, totalPurchases]"
    :percentage-differences="[byProgramPD, totalPD]"
  />
</template>

<script>
  import DoubleDiagramFrame from '@/views/widgets/frames/DoubleDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { DoubleDiagramFrame },
    mixins: [WidgetFunctions],
    props: ['widgetData'],
    data () {
      return {
        totalWD: [0, 0, 0, 0, 0, 0, 0],
        byProgramWD: [0, 0, 0, 0, 0, 0, 0],
        diagramOptions: {
          pointRadius: 4,
          pointBorderWidth: 2.5,
          tooltips: {
            display: false,
          },
        },
      }
    },
    computed: {
      totalPurchases () {
        return this.totalWD.length ? this.totalWD[this.totalWD.length - 1] : 0
      },
      byProgramPurchases () {
        return this.byProgramWD.length ? this.byProgramWD[this.byProgramWD.length - 1] : 0
      },
      totalPD () {
        if (this.totalWD && this.totalWD.length >= 2) {
          if (this.totalWD[1] > 0) {
            return this.relativeChange(this.totalWD[this.totalWD.length - 1], this.totalWD[this.totalWD.length - 2])
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
      diagramLabels () {
        return this.total
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
        return [
          this.widgetData.byProgramCount + ' покупки по программе',
          this.widgetData.totalCount + ' покупки всего',
        ]
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_purchase.scss";

</style>
