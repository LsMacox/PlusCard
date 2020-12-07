<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        {{ title }}
      </p>
    </template>

    <template v-slot:body>
      <div
        :class="generateClassesByPrefix(widgetClasses, '__box')"
        class="d-flex flex-column"
      >
        <div
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ count }} {{ subTitle }}
              </p>
            </div>
            <div
              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"
            >
              <p class="statistics__number title-m-bold">
                {{ formatNumberString(sum) }} &#8381
              </p>
            </div>
          </div>
          <div :class="generateClassesByPrefix(widgetClasses, '__box-diagram')">
            <base-line-graph
              :height="diagramHeight"
              :labels="diagramLabels"
              :data="diagramData"
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
  import FormatNumber from '@/mixins/formatNumber'

  export default {
    name: 'DoubleDiagramFrame',
    components: {
      BaseLineGraph,
      WidgetTemplate,
    },
    mixins: [WidgetFunctions, FormatNumber],
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
      title: {
        type: String,
        default: '',
      },
      subTitle: {
        type: String,
        default: '',
      },
      count: {
        type: Number,
        default: 0,
      },
      sum: {
        type: Number,
        default: 0,
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

<style lang="scss" scoped>

@import "./src/styles/vuetify-preset-plus/light_theme/variables";

.statistics__number {
  color: $primary-base;
}

.widget-box {
  height: 166px!important;
}

.f-double {
  .f-double__body {

    .f-double__box {
      width: 100%;
      .f-double__box-container {
        justify-content: space-between;
        margin-top: 20px;

        .f-double__box-info {
          .f-double__info-title {
            margin-bottom: 5px;
            p {
              margin-bottom: 0;
              color: $neutral-500;
            }
          }
        }

        .f-double__box-diagram {
          width: 75%!important;
        }

        &:nth-child(1) {
          .f-double__box-diagram {
            margin-top: -9px;
          }
        }

        &:nth-child(2) {
          margin-top: 18px;
          .f-double__box-diagram {
            opacity: 0.7;
          }
        }

        .f-double__info-statistics {
          .statistics__number {
            float: left;
            margin-right: 8px;
          }
          .statistics__percent {
            margin-top: 5px;
            display: inline-block;
          }
        }

        .f-double__box-diagram {
          margin-top: -2px;
          width: 100px;
          float: left;
        }
      }
    }
  }
}
</style>
