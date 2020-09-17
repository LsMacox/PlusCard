<template>
  <base-diagram-widget
    class="w-operation"
    :diagram-labels="diagramLabels.reverse()"
    :diagram-data="diagramData.reverse()"
    :diagram-height="diagramHeight"
    diagram-tooltip-title="операций"
    data-title="операций"
    :data-count="currentCount"
    :data-percentage-difference="percentageDifference"
  />
</template>

<script>
  import BaseDiagramWidget from '@/views/widgets/frames/BaseDiagramWidget'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { BaseDiagramWidget },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return [5].fill({
            all_count: 0,
            operations_count: 0,
            operations_increment: 0,
            date_end: '2020-09-08',
            date_start: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {
        diagramHeight: 90,
      }
    },
    computed: {
      currentCount () {
        return this.widgetData.length ? this.widgetData[0].operations_count : 0
      },
      percentageDifference () {
        if (this.widgetData && this.widgetData.length >= 2) {
          if (this.widgetData[1].operations_count > 0) {
            return this.relativeChange(this.widgetData[0].operations_count, this.widgetData[1].operations_count)
          }
        }
        return 0
      },
      diagramLabels () {
        return this.prepareDiagramLabels(this.widgetData, 'operations_count')
      },
      diagramData () {
        return this.$_.map(this.widgetData, 'operations_count')
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_operations.scss";

</style>
