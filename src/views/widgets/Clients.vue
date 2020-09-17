<template>
  <base-diagram-widget
    class="w-client"
    :diagram-labels="diagramLabels.reverse()"
    :diagram-data="diagramData.reverse()"
    :diagram-height="diagramHeight"
    diagram-tooltip-title="клиента"
    data-title="клиентов"
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
        diagramHeight: 90,
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
    methods: {
      declOfNum (number, titles) {
        number = Number(number)
        const cases = [2, 0, 1, 1, 1, 2]
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_clients.scss";

</style>
