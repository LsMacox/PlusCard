<template>
  <base-frame
    class="w-client"
    :diagram-labels="diagramLabels.reverse()"
    :diagram-data="diagramData.reverse()"
    :diagram-height="90"
    :titles="titles"
    :count="currentCount"
    :percentage-difference="percentageDifference"
  />
</template>

<script>
  import BaseFrame from '@/views/widgets/frames/BaseFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { BaseFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return [5].fill({
            all_count: 0,
            clients_count: 0,
            clients_increment: 0,
            date_end: '2020-09-08',
            date_start: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {
        titles: ['клиент', 'клиента', 'клиентов'],
      }
    },
    computed: {
      currentCount () {
        return this.widgetData.length ? this.widgetData[0].clients_count : 0
      },
      percentageDifference () {
        if (this.widgetData && this.widgetData.length >= 2) {
          if (this.widgetData[1].clients_count > 0) {
            return this.relativeChange(this.widgetData[0].clients_count, this.widgetData[1].clients_count)
          }
        }
        return 0
      },
      diagramLabels () {
        return this.prepareDiagramLabels(this.widgetData, 'clients_count')
      },
      diagramData () {
        return this.$_.map(this.widgetData, 'clients_count')
      },
    },
    mounted () {},
    methods: {},
  }
</script>
