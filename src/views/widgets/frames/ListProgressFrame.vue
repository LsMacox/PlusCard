<template>
  <widget-template :class-name="widgetClasses">
    <template v-slot:header-left>
      <p
        v-if="title.length"
        class="body-m-semibold mb-0"
      >
        {{ title }}
      </p>
      <slot
        v-else
        name="header-left"
      />
    </template>

    <template v-slot:header-right>
      <slot
        name="header-right"
      >
        <iconify-icon
          class="icon-question"
          icon="question-circle-outlined"
          height="16"
        />
      </slot>
    </template>

    <template v-slot:body>
      <ul
        :class="generateClassesByPrefix(widgetClasses, '__list')"
      >
        <li
          v-for="(item, i) in data"
          :key="i"
          :class="generateClassesByPrefix(widgetClasses, '__item')"
        >
          <div :class="generateClassesByPrefix(widgetClasses, '__item-top')">
            <p
              :class="generateClassesByPrefix(widgetClasses, '__name')"
              class="body-s-medium"
            >
              {{ item.left }}
            </p>
            <span
              :style="item.right.color != undefined ? `color: ${theme[item.right.color]}` : ''"
              :class="generateClassesByPrefix(widgetClasses, '__percent')"
              class="body-s-semibold"
            >{{ item.right.value != undefined ? item.right.value : item.right }}</span>
          </div>
          <div
            :class="generateClassesByPrefix(widgetClasses, '__item-bottom')"
          >
            <v-progress-linear
              :value="item.progress.value !== undefined ? item.progress.value : item.progress"
              style="height: 4px"
              :color="item.progress.color ? item.progress.color : 'primary'"
              rounded="rounded"
              :class="generateClassesByPrefix(widgetClasses, '__progress')"
            />
          </div>
        </li>
      </ul>
    </template>
  </widget-template>
</template>

<script>
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { WidgetTemplate },
    mixins: [WidgetFunctions],
    props: {
      data: {
        type: Array,
        default () {
          return [
            { left: '', right: '', progress: 0 },
            { left: '', right: '', progress: 0 },
            { left: '', right: '', progress: 0 },
          ]
        },
      },
      title: {
        type: String,
        default: '',
      },
    },
    data () {
      return {}
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-list-progress' : 'f-list-progress'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_list-progress.scss";

</style>
