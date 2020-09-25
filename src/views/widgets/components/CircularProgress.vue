
<template>
  <div class="vue-circular-progress">
    <div class="circle">
      <svg
        :width="circleSize"
        :height="circleSize"
        class="circle__svg"
      >
        <circle
          :cx="centralP"
          :cy="centralP"
          :r="radius"
          :style="{ 'stroke-width': strokeWidth, stroke: strokeBackground }"
          class="circle__progress circle__progress--path"
        />
        <circle
          :cx="centralP"
          :cy="centralP"
          :r="radius"
          :style="fileStyl"
          class="circle__progress circle__progress--fill"
        />
      </svg>

      <div class="percent">
        <slot>
          <span class="percent__int">{{ int }}</span>
          <span class="percent_sign">%</span>
        </slot>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>
<script>
  export default {
    name: 'CircularProgress',
    props: {
      strokeWidth: {
        type: Number,
        default: 4,
      },
      radius: {
        type: Number,
        default: 38,
      },
      transitionDuration: {
        type: Number,
        default: 1000,
      },
      strokeBackground: {
        type: String,
        default: '#aaff00',
      },
      strokeColor: {
        type: String,
        default: '#aaff00',
      },
      value: {
        // validator: function (value) {
        //   // should be a number and less or equal than 100
        //   return !Number.isNaN(Number(value)) && Number(value) <= 100
        // },
        default: '0',
      },
    },
    data () {
      return {
        offset: '',
        int: 0,
      }
    },
    computed: {
      circumference () {
        return this.radius * Math.PI * 2
      },
      fileStyl () {
        return {
          strokeDashoffset: this.offset,
          '--initialStroke': this.circumference,
          '--transitionDuration': `${this.transitionDuration}ms`,
          'stroke-width': this.strokeWidth,
          stroke: this.strokeColor,
        }
      },
      circleSize () {
        return (this.radius + this.strokeWidth) * 2
      },
      centralP () {
        return this.circleSize / 2
      },
    },
    watch: {
      value: {
        handler: function (v) {
          const n = Number(v)
          if (Number.isNaN(n) || n === 0) {
            return
          }
          this.clearHandlers()
          this.countNumber(v)
        },
        immediate: true,
      },
    },
    beforeDestroy () {
      this.clearHandlers()
    },
    methods: {
      increaseNumber (number, className) {
        if (number === 0) {
          return
        }
        const innerNum = parseInt(
          this.findClosestNumber(this.transitionDuration / 10, number),
        )
        const interval = this.transitionDuration / innerNum
        let counter = 0
        const handlerName = `${className}Interval`
        this[handlerName] = setInterval(() => {
          const bitDiff = number.toString().length - innerNum.toString().length
          if (bitDiff === 0) {
            this[className] = counter
          } else {
            this[className] = counter * 10 * bitDiff
          }
          if (counter === innerNum) {
            // back to origin precision
            this[className] = number
            window.clearInterval(this[handlerName])
          }
          counter++
        }, interval)
      },
      findClosestNumber (bound, value) {
        if (value <= bound) {
          return value
        }
        return this.findClosestNumber(bound, value / 10)
      },
      countNumber (v) {
        this.offset = ''
        this.initTimeoutHandler = setTimeout(() => {
          this.offset = (this.circumference * (100 - v)) / 100
        }, 100)
        if (this.$slots.default) return
        let [int] = v.toString().split('.');
        // fallback for NaN
        [int] = [Number(int)]
        this.increaseNumber(int, 'int')
      },
      clearHandlers () {
        if (this.initTimeoutHandler) {
          clearTimeout(this.initTimeoutHandler)
        }
        if (this.intInterval) {
          clearInterval(this.intInterval)
        }
      },
    },
  }
</script>
<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/widgets/components/circular-progress/_circular-progress.scss";

</style>
