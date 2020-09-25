<template>
  <div
    class="diagram-line"
  >
    <chart
      type="line"
      :height="height"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import Chart from '@/views/widgets/components/Chart'

  export default {
    name: 'MultiFilledGraph',
    components: { Chart },
    mixins: [WidgetFunctions],
    props: {
      labels: {
        type: Array,
        default () {
          return ['09.09', '10.09', '11.09', '12.09', '13.09', '14.09', '15.09']
        },
      },
      data: {
        type: Array,
        default () {
          return [[10, 40, 50, 90, 60, 70, 20], [0, 20, 45, 56, 40, 38, 47], [0, 10, 25, 36, 20, 18, 7]]
        },
      },
      height: {
        type: Number,
        default: 168,
      },
    },
    data () {
      return {}
    },
    computed: {
      blueGradient () {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 140)
        gradient.addColorStop(0, 'rgba(71, 118, 230, 0.3)')
        gradient.addColorStop(1, 'rgba(71, 118, 230, 0)')
        return gradient
      },
      brownGradient () {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 140)
        gradient.addColorStop(0, 'rgba(255, 163, 56, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 163, 56, 0)')
        return gradient
      },
      grayGradient () {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 160)
        gradient.addColorStop(0, 'rgba(149, 197, 218, 0.3)')
        gradient.addColorStop(1, 'rgba(149, 197, 218, 0)')
        return gradient
      },
      chartData () {
        return {
          labels: this.labels,
          datasets: [
            {
              borderColor: 'transparent',
              backgroundColor: this.blueGradient,
              fill: true,
              data: this.data[0],
              pointRadius: 0,
            },
            {
              borderColor: 'transparent',
              backgroundColor: this.brownGradient,
              fill: true,
              data: this.data[1],
              pointRadius: 0,
            },
            {
              borderColor: 'transparent',
              backgroundColor: this.grayGradient,
              fill: true,
              data: this.data[2],
              pointRadius: 0,
            },
          ],
        }
      },
      chartOptions () {
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 0,
              right: 5,
              top: 5,
              bottom: 0,
            },
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          scales: {
            xAxes: [{
              ticks: {
                display: true,
                stacked: true,
                fontColor: this.theme['neutral-500'],
                fontSize: '11px',
                lineHeight: '12px',
                fontFamily: 'Gilroy',
              },
              gridLines: {
                color: this.theme['primary-100'],
                drawBorder: false,
                drawOnChartArea: true,
                zeroLineColor: this.theme['primary-100'],
              },
            }],
            yAxes: [{
              ticks: {
                display: false,
                stacked: false,
              },
              gridLines: {
                display: false,
              },
            }],
          },
        }

        return options
      },
    },
    mounted () {
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
.diagram-line {
  width: 100%;
}
</style>
