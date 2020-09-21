<template>
  <double-frame
    class="w-client-program"
    :diagram-data="[testWidgetData, testWidgetData]"
    :diagram-labels="[testWidgetData, testWidgetData]"
    :diagram-height="46"
    title="Клиенты программы"
    :sub-titles="['Новые', 'Всего']"
    :counts="[currentCount, currentCount]"
    :percentage-differences="[percentageDifference, percentageDifference]"
  />
</template>

<script>
  import DoubleFrame from '@/views/widgets/frames/DoubleFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { DoubleFrame },
    mixins: [WidgetFunctions],
    // props: {
    //   widgetData: {
    //     type: Array,
    //     default () {
    //       return [5].fill({
    //         all_count: 0,
    //         clients_count: 0,
    //         client_increment: 0,
    //         date_end: '2020-09-08',
    //         date_start: '2020-09-08',
    //       })
    //     },
    //   },
    // },
    data () {
      return {
        testWidgetData: [0, 220, 330, 44],
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
      currentCount () {
        return this.testWidgetData.length ? this.testWidgetData[this.testWidgetData.length - 1] : 0
      },
      percentageDifference () {
        if (this.testWidgetData && this.testWidgetData.length >= 2) {
          if (this.testWidgetData[1] > 0) {
            return this.relativeChange(this.testWidgetData[0], this.testWidgetData[1])
          }
        }
        return 0
      },
      // diagramData () {
      //   return this.$_.map(this.widgetData, 'clients_count')
      // },
      diagramLabels () {
        return this.testWidgetData
      },
    },
    mounted () {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
