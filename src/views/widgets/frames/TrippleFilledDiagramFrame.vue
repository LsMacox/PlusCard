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
      <div
        :class="generateClassesByPrefix(widgetClasses, '__box')"
        class="d-flex flex-column"
      >
        <div
          v-for="i in 3"
          :key="i"
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ subTitles[i-1] }}
              </p>
            </div>
            <div
              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"
            >
              <p class="statistics__number title-m-bold">
                {{ formatNumberString(counts[i-1]) }} ₽
              </p>
              <p class="statistics__percent-all title-m-bold">
                {{ prepareDecimalNumberToDisplay(allPercentageDifferences[i-1]) }}%
              </p>
              <span
                :class="percentageDifferences[i-1] >= 0 ? 'wc-success' : 'wc-error'"
                class="statistics__percent body-m-semibold"
              >{{ percentageDifferences[i-1] > 0 ? `+${prepareDecimalNumberToDisplay(percentageDifferences[i-1])}%` : `${prepareDecimalNumberToDisplay(percentageDifferences[i-1])}%` }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="diagramData.length"
        :class="generateClassesByPrefix(widgetClasses, '__diagram')"
      >
        <multi-filled-graph
          :labels="diagramLabels"
          :data="diagramData"
          :height="diagramHeight"
        />
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import MultiFilledGraph from '@/views/widgets/components/graphs/MultiFilledGraph'
  import FormatNumber from '@/mixins/formatNumber'

  export default {
    name: 'TrippleFilledDiagramFrame',
    components: { MultiFilledGraph, WidgetTemplate },
    mixins: [WidgetFunctions, FormatNumber],
    inheritAttrs: false,
    props: {
      diagramData: {
        type: Array,
        default () {
          return [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        },
      },
      diagramLabels: {
        type: Array,
        default () {
          return ['0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0']
        },
      },
      diagramHeight: {
        type: Number,
        default: 90,
      },
      title: {
        type: String,
        default: 'titile',
      },
      subTitles: {
        type: Array,
        default () {
          return ['title', 'title', 'title']
        },
      },
      counts: {
        type: Array,
        default () {
          return [0, 0, 0]
        },
      },
      allPercentageDifferences: {
        type: Array,
        default () {
          return [0, 0, 0]
        },
      },
      percentageDifferences: {
        type: Array,
        default () {
          return [0, 0, 0]
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-tripple-filled' : 'f-tripple-filled'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_tripple-filled-frame.scss";
</style>
