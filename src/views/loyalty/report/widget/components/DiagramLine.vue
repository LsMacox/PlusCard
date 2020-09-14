<template>
  <div
    ref="diagram-line"
    class="diagram-line"
  >
    <base-chart
      ref="base-chart"
      charttype="line"
      :height="height"
      :chartdata="chartData"
      :charoptions="chartOptions"
    />
  </div>
</template>

<script>
  import BaseChart from './BaseChart'

  export default {
    name: 'DiagramLine',
    components: { BaseChart },
    props: {
      diagramlabels: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramdata: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
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
            tooltips: {
              enabled: false,
            },
          }
        },
      },
      height: {
        type: Number,
        default: 103,
      },
    },
    data () {
      return {
        canvasWidth: 0,
        chartOptionsRaw: {
          responsive: true,
          maintainAspectRatio: false,
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
            backgroundColor: '#4776E6',
            cornerRadius: 8,
            labelTextColor: '#fff',
            yPadding: 6,
            xPadding: 12,
            custom: function (tooltipModel) {
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

              // Set caret Position
              // tooltipEl.classList.remove('above', 'below', 'no-transform')
              // if (tooltipModel.yAlign) {
              //   tooltipEl.classList.add(tooltipModel.yAlign)
              // } else {
              //   tooltipEl.classList.add('no-transform')
              // }

              function getBody (bodyItem) {
                return bodyItem.lines
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
              tooltipEl.style.left = position.left + window.pageXOffset + (tooltipModel.caretX - (tooltipModel.width / 2) + tooltipModel.xPadding) + 'px'
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 16 + 'px'
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
              tooltipEl.style.pointerEvents = 'none'
            },
          },
          scales: {
            xAxes: [{
              ticks: {
                display: false,
                stacked: true,
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
        },
      }
    },
    computed: {
      growthColor () {
        return this.options.status.growthColor ? this.options.status.growthColor : '#00D15D'
      },
      declineColor () {
        return this.options.status.declineColor ? this.options.status.declineColor : '#EA4C2A'
      },
      pointsBackground () {
        if (!this.diagramdata.length) return

        const pointColors = Array((this.diagramdata.length - 1)).fill('#4776E6')
        const firstNumber = this.diagramdata[this.diagramdata.length - 2]
        const secondNumber = this.diagramdata[this.diagramdata.length - 1]

        if (this.options.status && this.options.status.display) {
          if (firstNumber < secondNumber) pointColors.push(this.growthColor)
          else if (firstNumber === secondNumber) pointColors.push('#B5B5C4')
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
        return {
          labels: this.diagramlabels,
          datasets: [
            {
              borderWidth: 2,
              borderColor: '#4776E6',
              backgroundColor: this.fillBackground,
              fill: true,
              data: this.diagramdata,
              // lineTension: 0,
              pointBorderColor: '#fff',
              pointRadius: 6,
              pointBorderWidth: 4,
              pointBackgroundColor: this.pointsBackground,
              pointStyle: 'circle',
            },
          ],
        }
      },
      chartOptions () {
        this.$_.extend(this.chartOptionsRaw.tooltips, this.options.tooltips)
        return this.chartOptionsRaw
      },
    },
  }
</script>
<style lang="scss" scoped>
.diagram-line {
  width: 100%;
}
</style>
