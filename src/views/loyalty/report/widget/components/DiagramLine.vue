<template>
  <base-chart
    charttype="line"
    :chartdata="chartData"
    :charoptions="chartOptions"
    :width="width"
    :height="height"
  />
</template>

<script>
  import BaseChart from './BaseChart'

  export default {
    name: 'DiagramLine',
    components: { BaseChart },
    props: {
      data: {
        type: Array,
        default: function () {
          return [0, 0, 0, 0, 0]
        },
      },
      width: {
        type: Number,
        default: 300,
      },
      height: {
        type: Number,
        default: 300,
      },
      options: {
        type: Object,
        default: function () {
          return {
            status: {
              display: true,
              growthColor: '#00D15D',
              declineColor: '#EA4C2A',
            },
          }
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      growthColor () {
        return this.options.status.growthColor ? this.options.status.growthColor : '#00D15D'
      },
      declineColor () {
        return this.options.status.declineColor ? this.options.status.declineColor : '#EA4C2A'
      },
      pointsBackground () {
        if (!this.inputData.length) return

        const pointColors = Array((this.inputData.length - 1)).fill('#4776E6')
        const firstNumber = this.inputData[this.inputData.length - 2]
        const secondNumber = this.inputData[this.inputData.length - 1]

        if (this.options.status && this.options.status.display) {
          if (firstNumber < secondNumber) pointColors.push(this.growthColor)
          else if (firstNumber === secondNumber) pointColors.push('#ffdd00')
          else pointColors.push(this.declineColor)
        } else {
          pointColors.push('#4776E6')
        }

        return pointColors
      },
      fillBackground () {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 300)
        gradient.addColorStop(0, 'rgba(71, 118, 230, 0.06)')
        gradient.addColorStop(0.5, 'transparent')

        return gradient
      },
      chartData () {
        this.eventPercentData()
        return {
          labels: this.inputData,
          datasets: [
            {
              borderWidth: 2,
              borderColor: '#4776E6',
              backgroundColor: this.fillBackground,
              fill: true,
              data: this.inputData,
              // lineTension: 0,
              pointBorderColor: '#fff',
              pointRadius: 7,
              pointBorderWidth: 4,
              pointBackgroundColor: this.pointsBackground,
              pointStyle: 'circle',
            },
          ],
        }
      },
      chartOptions () {
        return {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 5,
              top: 10,
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
                display: false,
                stacked: false,
              },
              gridLines: {
                color: '#EBF1FF',
                drawBorder: false,
                drawOnChartArea: true,
                zeroLineColor: '#EBF1FF',
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
      },
      inputData () {
        return this.data // to data change
      },
    },
    mounted () {},
    methods: {
      eventPercentData () {
        const firstNumber = this.inputData[this.inputData.length - 2]
        const secondNumber = this.inputData[this.inputData.length - 1]
        let percent = (((secondNumber - firstNumber) / firstNumber) * 100)
        const roundCondition = (percent > 1 || percent < -1 || percent === 0)

        if (firstNumber < secondNumber) {
          (roundCondition) ? percent = Math.round(percent) : percent = (percent).toFixed(1)
          percent = '+' + percent
        } else {
          (roundCondition) ? percent = Math.round(percent) : percent = (percent).toFixed(1)
        }

        percent = isNaN(percent) ? 0 : percent

        this.$emit('percent-calc', percent)
      },
    },
  }
</script>
