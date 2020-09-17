<template>
  <widget-template :style-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        <span class="wc-base">{{ dataCount }}</span> {{ dataTitle }}
      </p>
    </template>

    <template v-slot:header-right>
      <span
        :class="dataPercentageDifference >= 0 ? 'wc-success' : 'wc-error'"
        class="body-m-semibold"
      >{{ dataPercentageDifference > 0 ? `+${dataPercentageDifference}%` : `${dataPercentageDifference}%` }}</span>
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
        <diagram-line
          :diagram-labels="diagramLabels"
          :diagram-data="diagramData"
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
  import DiagramLine from '@/views/widgets/components/DiagramLine'

  export default {
    components: { DiagramLine, WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      diagramHeight: {
        type: Number,
        default: 90,
      },
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
      diagramTooltipTitle: {
        type: String,
        default: 'неизвестно',
      },
      dataTitle: {
        type: String,
        default: '',
      },
      dataCount: {
        type: Number,
        default: 0,
      },
      dataPercentageDifference: {
        type: Number,
        default: 0,
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
                return tooltipItem[0].xLabel.count + ' ' + _this.diagramTooltipTitle
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
      parentClass () {
        return this.$options._parentVnode.data.staticClass ?? this.$options._parentVnode.data.class
      },
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' w-base-diagram' : 'w-base-diagram'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_base-diagram.scss";

</style>
