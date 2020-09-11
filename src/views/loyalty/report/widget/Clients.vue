<template>
  <div
    class="widget-box w-client"
  >
    <div class="widget-box-header w-client__header">
      <div class="widget-box-header-left w-client__header-left body-m-semibold">
        <span class="header-left__number">{{ currentClientsCount }}</span> клиентов
      </div>
      <div class="widget-box-header-right w-client__header-right">
        <span
          :class="relativeChange >= 0 ? 'wc-success' : 'wc-error'"
          class="body-m-semibold"
        >{{ relativeChange > 0 ? `+${relativeChange}%` : `${relativeChange}%` }}</span>
      </div>
    </div>
    <div
      ref="widget-box-body"
      class="widget-box-body w-client__body"
    >
      <v-progress-circular
        v-show="!_isMounted"
        indeterminate
        color="primary"
        class="widget-box-body__progress w-client__progress"
      />
      <div
        v-if="_isMounted"
        class="widget-box-body__diagram w-client__diagram"
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
            clients_count: 0,
            clients_increment: 0,
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
                return tooltipItem[0].xLabel.clients_count + ' клиента'
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
        return this.widgetdata.length ? this.widgetdata[0].clients_count : 0
      },
      relativeChange () {
        if (this.widgetdata && this.widgetdata.length >= 2) {
          if (this.widgetdata[1].clients_count > 0) {
            return Math.round((this.widgetdata[0].clients_count - this.widgetdata[1].clients_count) / this.widgetdata[1].clients_count * 100)
          }
        }
        return 0
      },
      diagramData () {
        return this.$_.map(this.widgetdata, 'clients_count')
      },
      diagramLabels () {
        var clientsCount = this.$_.map(this.widgetdata, 'clients_count')
        var diagramLabels = []
        clientsCount.forEach((val, index) => {
          diagramLabels.push({ clients_count: val, start_period: this.widgetdata[index].date_start, end_period: this.widgetdata[index].date_end })
        })
        return diagramLabels
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_clients.scss";

</style>
