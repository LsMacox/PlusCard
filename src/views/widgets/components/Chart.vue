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
    name: 'Chart',
    props: {
      type: {
        type: String,
        default: 'line',
      },
      data: {
        type: Object,
        default: null,
      },
      options: {
        type: Object,
        default: null,
      },
      plugins: {
        type: Array,
        default () {
          return []
        },
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
      data (val) {
        this.updateChart()
      },
    },
    mounted () {
      this.createChart()
    },
    created () {
      window.addEventListener('resize', this.handleResize)
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      createChart () {
        this.$_chart = new Chart(this.$refs['canvas-chartjs'], {
          type: this.type,
          data: this.data,
          options: this.options,
          plugins: this.plugins,
        })
        this.$_chart.render(this.animation)
      },
      updateChart () {
        this.$_chart.data.datasets = this.data.datasets
        this.$_chart.data.labels = this.data.labels
        this.$_chart.update()
      },
      handleResize () {
        this.updateChart()
      },
    },
  }
</script>
