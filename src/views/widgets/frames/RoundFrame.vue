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
      />
    </template>

    <template v-slot:body>
      <circular-progress
        :class="generateClassesByPrefix(widgetClasses, '__circular-progress')"
        :stroke-width="12"
        :stroke-background="theme['primary-100']"
        :stroke-color="theme['primary']"
        :radius="52"
        :transition-duration="400"
        :value="share"
      >
        <div :class="generateClassesByPrefix(widgetClasses, '__circular-progress__data')">
          <p class="title-m-bold">
            {{ share }}%
          </p>
          <p class="wc-success">
            {{ getPercentToDisplay(percentageDifference) }}
          </p>
        </div>
      </circular-progress>
    </template>
  </widget-template>
</template>

<script>
  import CircularProgress from '@/views/widgets/components/CircularProgress'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'

  export default {
    name: 'RoundFrame',
    components: { WidgetTemplate, CircularProgress },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        default: '',
      },
      allCount: {
        type: Number,
        default: 0,
      },
      currentCount: {
        type: Number,
        default: 0,
      },
      percentageDifference: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {}
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-round' : 'f-round'
      },
      share () {
        if (this.currentCount && this.allCount) {
          return Math.round((this.currentCount / this.allCount) * 100)
        }
        return 0
      },
      circlePercentageDifference () {
        return this.relativeChange(this.allCount, this.currentCount)
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_round-frame.scss";

</style>
