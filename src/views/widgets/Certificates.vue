<template>
  <cert-diagram-frame
    class="w-certificate"
    :diagram-data="periodData"
    :diagram-labels="diagramLabels"
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
        periodData: [0, 0, 0, 0, 0],
        labelData: [],
        count: 0,
        sum: 0,
        titles: ['сертификат', 'сертификата', 'сертификатов'],
      }
    },
    computed: {
      diagramLabels () {
        return this.prepareDiagramLabels(this.labelData, 'count')
      },
    },
    watch: {
      widgetData (v) {
        this.count = 0
        this.sum = 0
        if (v) {
          if (v[0] && v[0].data) {
            v[0].data.forEach(item => {
              this.count += 1
              this.sum += item.nominal.selling_price
            })
          }

          let i = 0
          this.periodData = []
          this.labelData = []
          v.forEach(item => {
            this.periodData[i] = v[i].data.length
            this.labelData.push({
              count: item.data.length,
              date_start: item.date_start,
              date_end: item.date_end,
            })
            i += 1
          })
        }
        this.periodData = this.periodData.reverse()
        this.labelData = this.labelData.reverse()
        console.log('label')
        console.log(this.labelData)
        console.log('label')
      },
    },
    mounted () {
      if (this.widgetData) {
        if (this.widgetData[0] && this.widgetData[0].data) {
          this.widgetData[0].data.forEach(item => {
            this.count += 1
            this.sum += item.nominal.selling_price
          })
        }
        let i = 0
        this.periodData = []
        this.labelData = []
        this.widgetData.forEach(item => {
          this.periodData[i] = this.widgetData[i].data.length
          this.labelData.push({
            count: item.data.length,
            date_start: item.date_start,
            date_end: item.date_end,
          })
          i += 1
        })
      }
      this.periodData = this.periodData.reverse()
      this.labelData = this.labelData.reverse()
      console.log('label')
      console.log(this.labelData)
      console.log('label')
    },
  }
</script>

<style lang="scss">

//@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
