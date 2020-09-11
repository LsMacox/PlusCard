<template>
  <div
    class="widget-box"
  >
    <div class="widget-box-header">
      <div class="widget-box-header-left">
        <span>{{ currentClientsCount }}</span> операций
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        <span
          v-if="relativeChange !== 0"
          :class="relativeChange > 0 ? 'growth' : 'decline'"
        >{{ relativeChange > 0 ? `+${relativeChange}%` : `${relativeChange}%` }}</span>
        <span
          v-else
          class="neutral"
        >{{ `${relativeChange}%` }}</span>
      </div>
    </div>
    <div
      ref="widget-box-body"
      class="widget-box-body"
    >
      <v-progress-circular
        v-show="!_isMounted"
        indeterminate
        color="primary"
        class="widget-box-body__progress"
      />
      <div
        v-if="_isMounted"
        class="widget-box-body__diagram"
      >
        <diagram-line
          :diagramlabels="diagramLabels.reverse()"
          :diagramdata="diagramData.reverse()"
          :options="options"
          :height="height"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import DiagramLine from './components/DiagramLine'

  export default {
    components: { DiagramLine },
    props: {
      widgetdata: {
        type: Array,
        default () {
          return [{
            all_count: 0,
            operations_count: 0,
            operations_increment: 0,
            date_end: '2020-09-08',
            date_start: '2020-09-08',
          }]
        },
      },
    },
    data () {
      var _this = this
      return {
        height: 90,
        options: {
          status: {
            display: true,
            growthColor: '#00D15D',
            declineColor: '#EA4C2A',
          },
          tooltips: {
            enabled: false,
            callbacks: {
              title: function (tooltipItem, data) {
                return tooltipItem[0].xLabel.operations_count + ' операций'
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
      currentClientsCount () {
        return this.widgetdata.length ? this.widgetdata[0].operations_count : 0
      },
      relativeChange () {
        if (this.widgetdata && this.widgetdata.length >= 2) {
          if (this.widgetdata[1].operations_count > 0) {
            return Math.round((this.widgetdata[0].operations_count - this.widgetdata[1].operations_count) / this.widgetdata[1].operations_count * 100)
          }
        }
        return 0
      },
      diagramData () {
        return this.$_.map(this.widgetdata, 'operations_count')
      },
      diagramLabels () {
        var clientsCount = this.$_.map(this.widgetdata, 'operations_count')
        var diagramLabels = []
        clientsCount.forEach((val, index) => {
          diagramLabels.push({ operations_count: val, start_period: this.widgetdata[index].date_start, end_period: this.widgetdata[index].date_end })
        })
        return diagramLabels
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.widget-box {
  height: 100%;
  padding: 20px;
  border: 1px solid $neutral-250;
  box-sizing: border-box;
  border-radius: 12px;

  .widget-box-header {
      display: flex;
      align-items: center;

      .widget-box-header-left {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $neutral-900;
        span {
          color: $primary-base;
        }
      }
      .widget-box-header-right {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $success-500;
        span.growth {
          color: $success-500;
        }
        span.decline {
          color: $error-500;
        }
        span.neutral {
          color: $neutral-500;
        }
      }
    }
    .widget-box-body {
        width: 100%;
        display: flex;
        justify-content: center;
        .widget-box-body__diagram {
          width: 100%;
          margin-top: 12px;
        }
        .widget-box-body__progress {
          margin-top: 35px;
          margin-bottom: 12px;
        }
      }
  }
</style>
