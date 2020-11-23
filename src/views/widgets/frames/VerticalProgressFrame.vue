<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        {{ title }}
      </p>
    </template>

    <template v-slot:header-right>
      <iconify-icon
        class="icon-question"
        icon="question-circle-outlined"
        height="16"
        style="cursor: pointer;"
        @click="dialogHelp = true"
      />
      <dialog-help
        :dialog.sync="dialogHelp"
        :header="title"
        :text="textHelp"
      />
    </template>

    <template v-slot:body>
      <div
        :class="generateClassesByPrefix(widgetClasses, '__box')"
        class="d-flex flex-column"
      >
        <div
          v-for="(percent, i) in percentageDifferences"
          :key="i"
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ subTitles[i] }}
              </p>
            </div>
            <div
              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"
            >
              <span
                class="statistics__percent title-m-bold"
              >{{ percent }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="generateClassesByPrefix(widgetClasses, '__diagram')"
      >
        <div :class="generateClassesByPrefix(widgetClasses, '__diagram-progress')">
          <v-progress-linear
            :rounded="true"
            :value="percentageDifferences[0]"
            color="primary"
          />
          <v-progress-linear
            :rounded="true"
            :value="percentageDifferences[1]"
            color="warning"
          />
          <v-progress-linear
            :rounded="true"
            :value="percentageDifferences[2]"
            color="chart-500"
          />
        </div>
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import DialogHelp from '@/views/widgets/frames/DialogHelp'

  export default {
    name: 'DoubleDiagramFrame',
    components: {
      WidgetTemplate,
      DialogHelp,
    },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        default: '',
      },
      subTitles: {
        type: Array,
        default () {
          return ['title', 'title', 'title']
        },
      },
      percentageDifferences: {
        type: Array,
        default () {
          return [30, 40, 60]
        },
      },
      textHelp: {
        type: String,
        default: null,
      },
    },
    data () {
      return {
        dialogHelp: false,
        transitionDuration: 100,
        percent1: 0,
        percent2: 0,
        percent3: 0,
      }
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-vertical-progress' : 'f-vertical-progress'
      },
    },
    watch: {
      percentageDifferences: {
        handler: function (v) {
          this.clearHandlers()
          for (let i = 0; i < v.length; i++) {
            const n = Number(v[i])
            if (Number.isNaN(n) || n === 0) {
              return
            }
            this.countNumber(v[i], i + 1)
          }
        },
        immediate: true,
      },
    },
    mounted () {},
    methods: {
      countNumber (number, ind) {
        let counter = 0
        const innerNum = parseInt(
          this.findClosestNumber(this.transitionDuration / 10, number),
        )
        const interval = this.transitionDuration / innerNum
        const handlerName = `percent${ind}Interval`

        this[handlerName] = setInterval(() => {
          if (counter === innerNum) {
            // back to origin precision
            this[`percent${ind - 1}`] = number
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
      clearHandlers () {
        if (this.percent1Interval) {
          clearTimeout(this.percent1Interval)
        }
        if (this.percent2Interval) {
          clearInterval(this.percent2Interval)
        }
        if (this.percent3Interval) {
          clearInterval(this.percent3Interval)
        }
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_vertical-progress-frame.scss";

</style>
