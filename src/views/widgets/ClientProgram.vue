<template>
  <double-diagram-frame
    class="w-client-program"
    :diagram-data="[diagramNewData, diagramTotalData]"
    :diagram-labels="[diagramNewLabels, diagramTotalLabels]"
    :diagram-height="46"
    title="Клиенты программы"
    :titles="titles"
    :sub-titles="['Новые', 'Всего']"
    :counts="[newCount, totalCount]"
    :percentage-differences="[newPercentageDifference, totalPercentageDifference]"
  />
</template>

<script>
  import DoubleDiagramFrame from '@/views/widgets/frames/DoubleDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { DoubleDiagramFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return [4].fill({
            count: 0,
            date_start: '2020-09-08',
            date_end: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {
        newData: [0, 0, 0, 0],
        totalData: [0, 0, 0, 0],
        // diagramOptions: {
        //   pointRadius: 43,
        //   pointBorderWidth: 2.5,
        //   tooltips: {
        //     display: false,
        //   },
        // },
        titles: ['клиент', 'клиента', 'клиентов'],
      }
    },
    computed: {
      newCount () {
        return this.widgetData.length ? this.widgetData[0][this.widgetData.length - 1].count : 0
      },
      totalCount () {
        return this.widgetData.length ? this.widgetData[1][this.widgetData.length - 1].count : 0
      },
      newPercentageDifference () {
        if (this.newData && this.newData.length >= 2) {
          if (this.newData[1] > 0) {
            return this.relativeChange(this.newData[this.newData.length - 1], this.newData[this.newData.length - 2])
          }
        }
        return 0
      },
      totalPercentageDifference () {
        if (this.totalData && this.totalData.length >= 2) {
          if (this.totalData[1] > 0) {
            return this.relativeChange(this.totalData[this.newData.length - 1], this.totalData[this.newData.length - 2])
          }
        }
        return 0
      },
      diagramNewLabels () {
        return this.prepareDiagramLabels(this.widgetData[0], 'count')
      },
      diagramTotalLabels () {
        return this.prepareDiagramLabels(this.widgetData[1], 'count')
      },
      diagramNewData () {
        return this.$_.map(this.widgetData[0], 'count')
      },
      diagramTotalData () {
        return this.$_.map(this.widgetData[1], 'count')
      },
    },
    watch: {
      widgetData (v) {
        if (v && v[0] && v[1]) {
          this.newData = v[0].reverse()
          this.totalData = v[1].reverse()
        }
      },
    },
    mounted () {
      this.newData = this.widgetData[0].reverse()
      this.totalData = this.widgetData[1].reverse()
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
