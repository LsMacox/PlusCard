<template>
  <div
    :class="generateClassesByPrefix(className)"
    class="widget-box"
  >
    <div
      v-if="$slots['header-left'] !== undefined || $slots['header-right'] !== undefined"
      :class="generateClassesByPrefix(className, '__header')"
      class="widget-box__header"
    >
      <div
        :class="generateClassesByPrefix(className, '__header-left')"
        class="widget-box__header-left"
      >
        <slot name="header-left" />
      </div>
      <div
        :class="generateClassesByPrefix(className, '__header-right')"
        class="widget-box__header-right"
      >
        <slot name="header-right" />
      </div>
    </div>
    <div
      ref="widget-box-body"
      :class="generateClassesByPrefix(className, '__body')"
      class="widget-box__body"
    >
      <slot name="body" />
    </div>
  </div>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    name: 'WidgetTemplate',
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      className: {
        type: String,
        default: '',
      },
    },
    computed: {},
    mounted () {},
    methods: {},
  }
</script>
<style lang="scss">
  @import "@/styles/vuetify-preset-plus/light_theme/widgets/_standart.scss";
</style>
