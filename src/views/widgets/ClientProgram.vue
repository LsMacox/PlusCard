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
    text-help="Помощь по виджету"
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
        newCount: 0,
        totalCount: 0,
        newPercentageDifference: 0,
        totalPercentageDifference: 0,
        titles: ['клиент', 'клиента', 'клиентов'],
      }
    },
    computed: {
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
          const newData = v[0]
          const totalData = v[1]
          this.newCount = newData.length ? newData[newData.length - 1].count : 0
          this.totalCount = totalData.length ? totalData[totalData.length - 1].count : 0
          this.newPercentageDifference = this.relativeChange(newData[newData.length - 1].count ?? 0, newData[newData.length - 2].count ?? 0) ?? 0
          this.totalPercentageDifference = this.relativeChange(totalData[totalData.length - 1].count ?? 0, totalData[totalData.length - 2].count ?? 0) ?? 0
        }
      },
    },
    mounted () {
      const newData = this.widgetData[0]
      const totalData = this.widgetData[1]

      if (newData.length > 0 && totalData.length > 0) {
        this.newCount = newData.length ? newData[newData.length - 1].count : 0
        this.totalCount = totalData.length ? totalData[totalData.length - 1].count : 0
        this.newPercentageDifference = this.relativeChange(newData[newData.length - 1].count, newData[newData.length - 2].count) ?? 0
        this.totalPercentageDifference = this.relativeChange(totalData[totalData.length - 1].count, totalData[totalData.length - 2].count) ?? 0
      }
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
