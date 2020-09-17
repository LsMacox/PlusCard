<template>
  <widget-template :style-name="widgetClasses">
    <template v-slot:header-left>
      <p class="body-m-semibold">
        {{ dataTitle }}
      </p>
    </template>

    <template v-slot:header-right>
      <iconify-icon
        class="question__icon"
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
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ dataSubTitleFirst }}
              </p>
            </div>
            <div
              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"
            >
              <p class="statistics__number title-m-bold">
                {{ dataCountFirst }}
              </p>
              <span
                :class="dataPercentageDifferenceFirst >= 0 ? 'wc-success' : 'wc-error'"
                class="statistics__percent body-m-semibold"
              >{{ dataPercentageDifferenceFirst > 0 ? `+${dataPercentageDifferenceFirst}%` : `${dataPercentageDifferenceFirst}%` }}</span>
            </div>
          </div>
          <div :class="generateClassesByPrefix(widgetClasses, '__box-diagram')">
            <diagram-line
              :height="diagramHeight"
              :diagram-labels="diagramLabelsFirst"
              :diagram-data="diagramDataFirst"
              :tooltips="diagramOptions.tooltips"
              :point-radius="diagramOptions.pointRadius"
              :point-border-width="diagramOptions.pointBorderWidth"
            />
          </div>
        </div>
        <div
          :class="generateClassesByPrefix(widgetClasses, '__box-container')"
          class="d-flex"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">
            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">
              <p class="body-s-semibold">
                {{ dataSubTitleSecond }}
              </p>
            </div>
            <div :class="generateClassesByPrefix(widgetClasses, '__info-statistics')">
              <p class="statistics__number title-m-bold">
                {{ dataCountSecond }}
              </p>
              <span
                :class="dataPercentageDifferenceSecond >= 0 ? 'wc-success' : 'wc-error'"
                class="statistics__percent body-m-semibold"
              >{{ dataPercentageDifferenceSecond > 0 ? `+${dataPercentageDifferenceSecond}%` : `${dataPercentageDifferenceSecond}%` }}</span>
            </div>
          </div>
          <div :class="generateClassesByPrefix(widgetClasses, '__box-diagram')">
            <diagram-line
              :height="diagramHeight"
              :diagram-labels="diagramLabelsSecond"
              :diagram-data="diagramDataSecond"
              :tooltips="diagramOptions.tooltips"
              :point-radius="diagramOptions.pointRadius"
              :point-border-width="diagramOptions.pointBorderWidth"
            />
          </div>
        </div>
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import DiagramLine from '@/views/widgets/components/DiagramLine'

  export default {
    components: { DiagramLine, WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      diagramHeight: {
        type: Number,
        default: 90,
      },
      diagramDataFirst: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramLabelsFirst: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramDataSecond: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      diagramLabelsSecond: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      dataTitle: {
        type: String,
        default: '',
      },
      dataSubTitleFirst: {
        type: String,
        default: '',
      },
      dataSubTitleSecond: {
        type: String,
        default: '',
      },
      dataCountFirst: {
        type: Number,
        default: 0,
      },
      dataCountSecond: {
        type: Number,
        default: 0,
      },
      dataPercentageDifferenceFirst: {
        type: Number,
        default: 0,
      },
      dataPercentageDifferenceSecond: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        diagramOptions: {
          pointRadius: 4,
          pointBorderWidth: 2.5,
          tooltips: {
            display: false,
          },
        },
      }
    },
    computed: {
      parentClass () {
        return this.$options._parentVnode.data.staticClass ?? this.$options._parentVnode.data.class
      },
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' w-double-diagram' : 'w-double-diagram'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_double-diagram.scss";

</style>
