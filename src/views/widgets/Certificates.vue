<template>
  <cert-diagram-frame
    class="w-certificate"
    :diagram-labels="diagramLabels.reverse()"
    :diagram-data="diagramData.reverse()"
    :diagram-height="90"
    :titles="titles"
    :count="currentCount"
    :percentage-difference="percentageDifference"
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
          return [5].fill({
            all_count: 0,
            total_sum: 0,
            certs_count: 0,
            certs_increment: 0,
            date_start: '2020-09-08',
            date_end: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {
        titles: ['сертификат', 'сертификата', 'сертификатов'],
      }
    },
    computed: {
      currentCount () {
        return this.widgetData.length ? this.widgetData[0].certs_count : 0
      },
      percentageDifference () {
        if (this.widgetData && this.widgetData.length >= 2) {
          if (this.widgetData[1].certs_count > 0) {
            return this.relativeChange(this.widgetData[0].certs_count, this.widgetData[1].certs_count)
          }
        }
        return 0
      },
      diagramLabels () {
        return this.prepareDiagramLabels(this.widgetData, 'certs_count')
      },
      diagramData () {
        return this.$_.map(this.widgetData, 'certs_count')
      },
    },
    mounted () {},
    methods: {},
  }
</script>
