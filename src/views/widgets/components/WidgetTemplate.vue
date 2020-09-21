<template>
  <div
    :class="generateClassesByPrefix(styleName)"
    class="widget-box"
  >
    <div
      :class="generateClassesByPrefix(styleName, '__header')"
      class="widget-box__header"
    >
      <div
        :class="generateClassesByPrefix(styleName, '__header-left')"
        class="widget-box__header-left"
      >
        <slot name="header-left" />
      </div>
      <div
        :class="generateClassesByPrefix(styleName, '__header-right')"
        class="widget-box__header-right"
      >
        <slot name="header-right" />
      </div>
    </div>
    <div
      ref="widget-box-body"
      :class="generateClassesByPrefix(styleName, '__body')"
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
      styleName: {
        type: String,
        default: 'w-default',
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
