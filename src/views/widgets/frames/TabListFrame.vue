<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:body>
      <div :class="generateClassesByPrefix(widgetClasses, '__tabs-head')">
        <div
          v-for="(tab, a) in tabs"
          :id="`tab-${a+1}`"
          :key="tab"
          :class="generateClassesByPrefix(widgetClasses, '__tabs-tab') + getClassActiveFirstEl(a+1)"
        >
          <p
            class="body-m-medium"
            @click="changeTab(a+1, $event)"
          >
            {{ tab }}
          </p>
        </div>
      </div>
      <div :class="generateClassesByPrefix(widgetClasses, '__tabs-body')">
        <slot
          :name="`tab-${tabId}`"
        />
      </div>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'

  export default {
    name: 'TabListFrame',
    components: { WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      tabs: {
        type: Array,
        default () {
          return ['', '']
        },
      },
    },
    data () {
      return {
        tabId: 1,
      }
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-tab-list' : 'f-tab-list'
      },
      classActiveFirstEl (a) {
        return a === 1 ? ' active' : ''
      },
    },
    created () {
      this.changeTab(1)
    },
    mounted () {},
    methods: {
      changeTab (tabId, event) {
        if (event !== undefined) this.removeClassActive(event)
        if (event !== undefined) event.target.parentNode.classList.add('active')
        this.tabId = tabId
      },
      removeClassActive (e) {
        const tabs = e.target.parentNode.parentNode.querySelectorAll('div')
        tabs.forEach((tab) => {
          tab.classList.remove('active')
        })
      },
      getClassActiveFirstEl (a) {
        return a === 1 ? ' active' : ''
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_tab-list-frame.scss";

</style>
