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
            :value="percentageDifferences[0]"
            color="warning"
          />
          <v-progress-linear
            :rounded="true"
            :value="percentageDifferences[0]"
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

  export default {
    name: 'DoubleDiagramFrame',
    components: { WidgetTemplate },
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
    },
    data () {
      return {}
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-vertical-progress' : 'f-vertical-progress'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_vertical-progress-frame.scss";

</style>
