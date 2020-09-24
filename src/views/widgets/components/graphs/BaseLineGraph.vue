<template>
  <div
    class="diagram-line"
  >
    <chart
      type="line"
      :height="height+5"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import Chart from '@/views/widgets/components/Chart'

  export default {
    name: 'BaseLineGraph',
    components: { Chart },
    mixins: [WidgetFunctions],
    props: {
      labels: {
        type: Array,
        default () {
          return [10, 20, 30, 30, 50]
        },
      },
      data: {
        type: Array,
        default () {
          return [10, 20, 30, 30, 50]
        },
      },
      tooltips: {
        type: Object,
        default: function () {
          return {
            display: true,
          }
        },
      },
      pointRadius: {
        type: Number,
        default: 6,
      },
      pointBorderWidth: {
        type: Number,
        default: 4,
      },
      height: {
        type: Number,
        default: 103,
      },
    },
    data () {
      return {
        is_status: true,
      }
    },
    computed: {
      pointsBackground () {
        if (!this.data.length) return

        const pointColors = Array((this.data.length - 1)).fill(this.theme.primary)
        const firstNumber = this.data[this.data.length - 2]
        const secondNumber = this.data[this.data.length - 1]

        if (this.is_status) {
          if (firstNumber < secondNumber) pointColors.push(this.theme.success)
          else if (firstNumber === secondNumber) pointColors.push(this.theme['neutral-500'])
          else pointColors.push(this.theme.error)
        } else {
          pointColors.push(this.theme.primary)
        }

        return pointColors
      },
      baseGradient () {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 18, 0, 300)
        gradient.addColorStop(0, 'rgba(71, 118, 230, 0.1)')
        gradient.addColorStop(0.1, 'rgba(71, 118, 230, 0)')
        return gradient
      },
      chartData () {
        return {
          labels: this.labels,
          datasets: [
            {
              borderWidth: 2,
              borderColor: this.theme.primary,
              backgroundColor: this.baseGradient,
              fill: true,
              data: this.data,
              pointBorderColor: '#fff',
              pointRadius: this.pointRadius,
              pointBorderWidth: this.pointBorderWidth,
              pointBackgroundColor: this.pointsBackground,
              pointStyle: 'circle',
            },
          ],
        }
      },
      chartOptions () {
        var _this = this
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
            display: true,
            enabled: false,
            backgroundColor: this.theme.primary,
            cornerRadius: 8,
            labelTextColor: '#fff',
            yPadding: 6,
            xPadding: 12,
            custom: function (tooltipModel) {
              function getBody (bodyItem) {
                return bodyItem.lines
              }

              if (_this.tooltips.display) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip')

                // Create element on first render
                if (!tooltipEl) {
                  tooltipEl = document.createElement('div')
                  tooltipEl.id = 'chartjs-tooltip'
                  tooltipEl.innerHTML = '<table style="color:' + tooltipModel.bodyFontColor + '"></table>'
                  tooltipEl.style.zIndex = '100'
                  tooltipEl.style.background = tooltipModel.backgroundColor
                  tooltipEl.style.borderRadius = tooltipModel.cornerRadius + 'px'
                  tooltipEl.style.transition = 'all 0.4s ease 0s'
                  document.body.appendChild(tooltipEl)
                }

                // Create tooltip styles
                var styleEl = document.head.appendChild(document.createElement('style'))

                styleEl.innerHTML = `
                #chartjs-tooltip {
                  padding: 6px 12px 6px 12px;
                }
                #chartjs-tooltip::after {
                  content: "";
                  position: absolute;
                  top: -10px;
                  left: 50%;
                  margin-left: -5px;
                  border-width: 5px;
                  border-style: solid;
                  border-color: ${tooltipModel.backgroundColor} transparent transparent transparent;
                  transform: rotate(180deg);
                }`

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0
                  return
                }

                // Set Text
                if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || []
                  var bodyLines = tooltipModel.body.map(getBody)

                  var innerHtml = '<thead style="margin-bottom: ' + tooltipModel.titleMarginBottom + '">'

                  titleLines.forEach(function (title) {
                    innerHtml += '<tr><th style="font-weight: 600; font-family: Gilroy; font-size: 13px; font-style: normal;">' + title + '</th></tr>'
                  })
                  innerHtml += '</thead><tbody>'
                  bodyLines.forEach(function (body, i) {
                    innerHtml += '<tr><td style="font-weight: 600; font-family: Gilroy; font-size: 11px; font-style: normal;">' + body + '</td></tr>'
                  })
                  innerHtml += '</tbody>'

                  var tableRoot = tooltipEl.querySelector('table')
                  tableRoot.innerHTML = innerHtml
                }

                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect()

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1
                tooltipEl.style.position = 'absolute'
                tooltipEl.style.left = position.left + window.pageXOffset + (tooltipModel.caretX - (tooltipEl.clientWidth / 2)) + 'px'
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 16 + 'px'
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
                tooltipEl.style.pointerEvents = 'none'
              }
            },
          },
          scales: {
            xAxes: [{
              ticks: {
                display: false,
                stacked: true,
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

        this.$_.extend(options.tooltips, this.tooltips)

        return options
      },
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
<style lang="scss" scoped>
.diagram-line {
  width: 100%;
}
</style>
