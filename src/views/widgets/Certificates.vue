<template>
  <cert-diagram-frame
    class="w-certificate"
    :diagram-data="widgetData"
    :diagram-labels="widgetData"
    :diagram-height="46"
    title="Сертификаты"
    :titles="titles"
    sub-title="шт на сумму:"
    :count="count"
    :sum="sum"
  />
</template>

<script>
  import CertDiagramFrame from '@/views/widgets/frames/CertDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { CertDiagramFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return [
            {
              count: 10,
              date_start: '2020-09-08',
              date_end: '2020-09-08',
            },
            {
              count: 20,
              date_start: '2020-09-08',
              date_end: '2020-09-08',
            },
            {
              count: 30,
              date_start: '2020-09-08',
              date_end: '2020-09-08',
            },
            {
              count: 40,
              date_start: '2020-09-08',
              date_end: '2020-09-08',
            },
            {
              count: 50,
              date_start: '2020-09-08',
              date_end: '2020-09-08',
            },
          ]
        },
      },
    },
    data () {
      return {
        count: 0,
        sum: 0,
        titles: ['клиент', 'клиента', 'клиентов'],
      }
    },
    computed: {
      diagramLabels () {
        return this.prepareDiagramLabels(this.widgetData, 'count')
      },
      diagramData () {
        return this.$_.map(this.widgetData, 'count')
      },
      diagramTotalData () {
        return this.$_.map(this.widgetData, 'count')
      },
    },
    watch: {
      // widgetData (v) {
      //   if (v && v[0] && v[1]) {
      //     const newData = v[0]
      //     const totalData = v[1]
      //     this.newCount = newData.length ? newData[newData.length - 1].count : 0
      //     this.totalCount = totalData.length ? totalData[totalData.length - 1].count : 0
      //     this.newPercentageDifference = this.relativeChange(newData[newData.length - 1].count ?? 0, newData[newData.length - 2].count ?? 0) ?? 0
      //     this.totalPercentageDifference = this.relativeChange(totalData[totalData.length - 1].count ?? 0, totalData[totalData.length - 2].count ?? 0) ?? 0
      //   }
      // },
    },
    mounted () {
      this.count = this.widgetData.length ? this.widgetData[this.widgetData.length - 1].count : 0
      this.sum = this.relativeChange(this.widgetData[this.widgetData.length - 1].count, this.widgetData[this.widgetData.length - 2].count) ?? 0
    },
  }
</script>

<style lang="scss">

//@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
