<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        <span class="wc-base">{{ count }}</span> {{ declOfNum(count, titles) }}
      </p>
    </template>

    <template v-slot:body>
      <v-progress-circular
        v-show="diagramData.length == 0"
        indeterminate
        color="primary"
        :class="generateClassesByPrefix(widgetClasses, '__progress')"
      />
      <div
        v-if="diagramData.length"
        :class="generateClassesByPrefix(widgetClasses, '__diagram')"
      >
        <base-line-graph
          :labels="diagramLabels"
          :data="diagramData"
          :point-radius="diagramOptions.pointRadius"
          :point-border-width="diagramOptions.pointBorderWidth"
          :tooltips="diagramOptions.tooltips"
          :height="diagramHeight"
        />
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import BaseLineGraph from '@/views/widgets/components/graphs/BaseLineGraph'

  export default {
    name: 'BaseDiagramFrame',
    components: { BaseLineGraph, WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      diagramData: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramLabels: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramHeight: {
        type: Number,
        default: 90,
      },
      count: {
        type: Number,
        default: 0,
      },
      percentageDifference: {
        type: Number,
        default: 0,
      },
      titles: {
        type: Array,
        default () {
          return []
        },
      },
    },
    data () {
      var _this = this
      return {
        diagramOptions: {
          pointRadius: 6,
          pointBorderWidth: 4,
          tooltips: {
            display: true,
            callbacks: {
              title: function (tooltipItem, data) {
                console.log('tooltipItem')
                console.log(tooltipItem)
                console.log('tooltipItem')
                return tooltipItem[0].xLabel.count + ' ' + _this.declOfNum(tooltipItem[0].xLabel.count, _this.titles)
              },
              label: function (tooltipItem, data) {
                var startDate = tooltipItem.xLabel.start_period
                var endDate = tooltipItem.xLabel.end_period

                const formatStart = _this.$moment(startDate, 'YYYY-MM-DD').format('D.MM.YYYY')
                const formatEnd = _this.$moment(endDate, 'YYYY-MM-DD').format('D.MM.YYYY')

                return formatStart + '-' + formatEnd
              },
            },
          },
        },
      }
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-base' : 'f-base'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_base-frame.scss";
</style>
