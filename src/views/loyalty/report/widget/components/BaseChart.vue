<template>
  <canvas
    id="canvas-chartjs"
    ref="canvas-chartjs"
  />
</template>
<script>
  import Chart from 'chart.js'

  export default {
    name: 'BaseChart',
    props: {
      charttype: {
        type: String,
        default: 'line',
      },
      chartdata: {
        type: Object,
        default: null,
      },
      charoptions: {
        type: Object,
        default: null,
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
      chartdata: function (val) {
        this.$_chart.data.datasets = this.chartdata.datasets
        this.$_chart.data.labels = this.chartdata.labels
        this.$_chart.update()
      },
    },
    mounted () {
      this.createChart()
      this.$_chart.render(this.animation)
    },
    methods: {
      createChart () {
        this.$_chart = new Chart(this.$refs['canvas-chartjs'], {
          type: this.charttype,
          data: this.chartdata,
          options: this.charoptions,
        })
      },
    },
  }
</script>
