<template v-if="data && data.length > 0">
  <widget-template :class-name="widgetClasses">
    {{data}}
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
        style="cursor: pointer;"
        @click="dialogHelp = true"
      />
      <dialog-help
        :dialog.sync="dialogHelp"
        :header="title"
        :text="textHelp"
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
        <tbody
          v-if="data && data.length > 0"
          :class="generateClassesByPrefix(widgetClasses, '__table-body')"
        >
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
                  <v-tooltip
                    v-if="a == 0"
                    top
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <p
                        v-bind="attrs"
                        class="body-s-medium"
                        :style="typeof item == 'object' ? `background-color: ${hexToRgbA(item.color, 0.15)}; color: ${item.color}` : ''"
                        v-on="on"
                      >
                        {{ typeof item == 'object' ? item.text : item }}
                      </p>
                    </template>
                    <span>{{ typeof item == 'object' ? item.text : item }}</span>
                  </v-tooltip>
                  <p
                    v-else
                    class="body-s-medium"
                    :style="typeof item == 'object' ? `background-color: ${hexToRgbA(item.color, 0.15)}; color: ${item.color}` : ''"
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
                    <v-tooltip
                      v-if="b == 0"
                      top
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <p
                          v-bind="attrs"
                          class="body-s-medium"
                          :style="typeof item == 'object' ? `background-color: ${hexToRgbA(item.color, 0.15)}; color: ${item.color}` : ''"
                          v-on="on"
                        >
                          {{ typeof item == 'object' ? item.text : item }}
                        </p>
                      </template>
                      <span>{{ typeof item == 'object' ? item.text : item }}</span>
                    </v-tooltip>
                    <p
                      v-else
                      class="body-s-medium"
                      :style="typeof item == 'object' ? `background-color: ${hexToRgbA(item.color, 0.15)}; color: ${item.color}` : ''"
                    >
                      {{ typeof item == 'object' ? item.text : item }}
                    </p>
                  </td>
                </template>
              </tr>

              <!-- Horizontal Line -->
              <tr
                v-if="data && i % 2 == 1 && i !== data.length * 2 -1"
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
  import Convertor from '@/mixins/convertor'
  import DialogHelp from '@/views/widgets/frames/DialogHelp'

  export default {
    name: 'TableFrame',
    components: {
      WidgetTemplate,
      DialogHelp,
    },
    mixins: [WidgetFunctions, Convertor],
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
      textHelp: {
        type: String,
        default: null,
      },
    },
    data () {
      return {
        dialogHelp: false,
      }
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
