<template>
  <div
    class="wrapper"
    :style="`max-width: 100%; height: ${height}px`"
  >
    <canvas
      id="canvas-chartjs"
      ref="canvas-chartjs"
      style="max-width: 100%"
    />
  </div>
</template>
<script>
  import Chart from 'chart.js'

  export default {
    name: 'BaseChart',
    props: {
      chartType: {
        type: String,
        default: 'line',
      },
      chartData: {
        type: Object,
        default: null,
      },
      chartOptions: {
        type: Object,
        default: null,
      },
      height: {
        type: Number,
        default: 100,
      },
    },
    data () {
      return {
        $_chart: null,
        animation: {
          duration: 300,
          easing: 'linear',
        },
      }
    },
    watch: {
      chartOptions: function (val) {
        this.updateChart()
      },
      chartData: function (val) {
        this.updateChart()
      },
    },
    mounted () {
      this.createChart()
    },
    methods: {
      createChart () {
        this.$_chart = new Chart(this.$refs['canvas-chartjs'], {
          type: this.chartType,
          data: this.chartData,
          options: this.chartOptions,
        })
        this.$_chart.render(this.animation)
      },
      updateChart () {
        this.$_chart.data.datasets = this.chartData.datasets
        this.$_chart.data.labels = this.chartData.labels
        this.$_chart.update()
      },
    },
  }
</script>
