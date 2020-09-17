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
      <v-progress-circular
        :class="generateClassesByPrefix(widgetClasses, '__progress-circular')"
        :rotate="-90"
        :size="106"
        :width="12"
        :value="percentageDifference"
        color="primary"
      >
        {{ percentageDifference }}
      </v-progress-circular>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'

  export default {
    components: { WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
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
      parentClass () {
        return this.$options._parentVnode.data.staticClass ?? this.$options._parentVnode.data.class
      },
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' w-circle' : 'w-circle'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_circle.scss";

</style>
