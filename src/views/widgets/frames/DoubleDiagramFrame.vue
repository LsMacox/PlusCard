<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        {{ title }}
      </p>
    </template>

    <template v-slot:header-right>
      <iconify-icon
        class="icon-question"
        icon="question-circle-outlined"
        height="16"
        style="cursor: pointer;"
        @click="dialogHelp = true"
      />
      <dialog-help
        :dialog.sync="dialogHelp"
        :header="title"
        :text="textHelp"
      />
    </template>

    <template v-slot:body>
      <div
        :class="generateClassesByPrefix(widgetClasses, '__box')"
        class="d-flex flex-column"
      >
        <div
          v-for="i in 2"
          :key="i"
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ subTitles[i-1] }}
              </p>
            </div>
            <div
              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"
            >
              <p class="statistics__number title-m-bold">
                {{ counts[i-1] }}
              </p>
              <span
                :class="percentageDifferences[i-1] >= 0 ? 'wc-success' : 'wc-error'"
                class="statistics__percent body-m-semibold"
              >{{ getPercentToDisplay(percentageDifferences[i-1]) }}</span>
            </div>
          </div>
          <div :class="generateClassesByPrefix(widgetClasses, '__box-diagram')">
            <base-line-graph
              :height="diagramHeight"
              :labels="diagramLabels[i-1]"
              :data="diagramData[i-1]"
              :tooltips="diagramOptions.tooltips"
              :point-radius="diagramOptions.pointRadius"
              :point-border-width="diagramOptions.pointBorderWidth"
            />
          </div>
        </div>
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import BaseLineGraph from '@/views/widgets/components/graphs/BaseLineGraph'
  import DialogHelp from '@/views/widgets/frames/DialogHelp'

  export default {
    name: 'DoubleDiagramFrame',
    components: {
      BaseLineGraph,
      WidgetTemplate,
      DialogHelp,
    },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default () {
          return undefined
        },
      },
      diagramData: {
        type: Array,
        default () {
          return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
        },
      },
      diagramLabels: {
        type: Array,
        default () {
          return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
        },
      },
      diagramHeight: {
        type: Number,
        default: 90,
      },
      title: {
        type: String,
        default: '',
      },
      subTitles: {
        type: Array,
        default () {
          return ['title', 'title']
        },
      },
      counts: {
        type: Array,
        default () {
          return [0, 0]
        },
      },
      percentageDifferences: {
        type: Array,
        default () {
          return [0, 0]
        },
      },
      titles: {
        type: Array,
        default () {
          return []
        },
      },
      textHelp: {
        type: String,
        default: null,
      },
    },
    data () {
      var _this = this
      return {
        dialogHelp: false,
        diagramOptions: {
          pointRadius: 4,
          pointBorderWidth: 2.5,
          tooltips: {
            display: true,
            callbacks: {
              title: function (tooltipItem, data) {
                if (_this.name === 'purchase') {
                  return tooltipItem[0].value + ' руб.'
                } else {
                  return tooltipItem[0].value + ' ' + _this.declOfNum(parseInt(tooltipItem[0].value), _this.titles)
                }
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
        return this.parentClass !== undefined ? this.parentClass + ' f-double' : 'f-double'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_double-frame.scss";

</style>
