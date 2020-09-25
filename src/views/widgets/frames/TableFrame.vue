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
      <table :class="generateClassesByPrefix(widgetClasses, '__table')">
        <thead :class="generateClassesByPrefix(widgetClasses, '__table-head')">
          <tr>
            <th
              v-for="(item, i) in subTitles"
              :key="i"
              :class="i == 0 ? 'text-left': 'text-right'"
              class="body-s-medium"
            >
              <p>{{ item }}</p>
            </th>
          </tr>
        </thead>
        <tbody :class="generateClassesByPrefix(widgetClasses, '__table-body')">
          <template
            v-for="i in data.length * 2 -1"
          >
            <!-- First tr -->
            <template>
              <tr
                v-if="i-1 == 0"
                :key="i + '-tr'"
              >
                <td
                  v-for="(item, a) in data[i-1]"
                  :key="a"
                  :class="a == 0 ? 'text-left': 'text-right'"
                >
                  <p
                    class="body-s-medium"
                    :style="typeof item == 'object' ? `background-color: ${item.background}; color: ${item.color}` : ''"
                  >
                    {{ typeof item == 'object' ? item.text : item }}
                  </p>
                </td>
              </tr>
            </template>
            <!-- More tr -->
            <template>
              <!-- tr -->
              <tr
                v-if="i % 2 == 0 "
                :key="i + '-tr-additional'"
              >
                <template
                  v-for="(item, b) in data[i/2]"
                >
                  <td
                    :key="b"
                    :class="b == 0 ? 'text-left': 'text-right'"
                  >
                    <p
                      class="body-s-medium"
                      :style="typeof item == 'object' ? `background-color: ${item.background}; color: ${item.color}` : ''"
                    >
                      {{ typeof item == 'object' ? item.text : item }}
                    </p>
                  </td>
                </template>
              </tr>

              <!-- Horizontal Line -->
              <tr
                v-if="i % 2 == 1 && i !== data.length * 2 -1"
                :key="i + '-hr'"
                :class="generateClassesByPrefix(widgetClasses, '__table-hr')"
                :bgcolor="theme['neutral-250']"
              >
                <td
                  v-for="(item, c) in data[0].length"
                  :key="c"
                />
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </template>
  </widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'

  export default {
    name: 'TableFrame',
    components: { WidgetTemplate },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        default: 'title',
      },
      subTitles: {
        type: Array,
        default () {
          return ['', '', '', '']
        },
      },
      data: {
        type: Array,
        default () {
          return [
            ['', '', '', ''],
          ]
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-table' : 'f-table'
      },
    },
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/frames/_table-frame.scss";

</style>
