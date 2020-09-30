<template>
  <double-diagram-frame
    class="w-client-program"
    :diagram-data="[newData, totalData]"
    :diagram-labels="[newData, totalData]"
    :diagram-height="46"
    title="Клиенты программы"
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
          return []
        },
      },
    },
    data () {
      return {
        newData: [0, 0, 0, 0],
        totalData: [0, 0, 0, 0],
        diagramOptions: {
          pointRadius: 43,
          pointBorderWidth: 2.5,
          tooltips: {
            display: false,
          },
        },
      }
    },
    computed: {
      newCount () {
        return this.newData.length ? this.newData[this.newData.length - 1] : 0
      },
      totalCount () {
        return this.totalData.length ? this.totalData[this.newData.length - 1] : 0
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
      diagramLabels () {
        return this.newData
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
