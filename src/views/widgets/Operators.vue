<template>
  <div>
    <widget-template style-name="w-operator">
      <template v-slot:header-left>
        <p
          class="body-m-semibold mb-0"
          @click="toggleSidePanel"
        >
          Операторы
        </p>
      </template>

      <template v-slot:header-right>
        <iconify-icon
          class="w-operator__header-icon"
          icon="chevron-right"
          height="17"
          @click="toggleSidePanel"
        />
      </template>

      <template v-slot:body>
        <ul
          class="w-operator__list"
        >
          <li
            v-for="operator in someOperators"
            :key="operator.id"
            class="w-operator__item"
          >
            <div class="w-operator__item-top">
              <p class="w-operator__name body-s-medium">
                {{ operator.label }}
              </p>
              <span class="w-operator__percent body-s-semibold">10%</span>
            </div>
            <div class="w-operator__item-bottom">
              <v-progress-linear
                :value="25"
                style="height: 4px"
                color="primary"
                rounded="rounded"
                class="w-operator__progress"
              />
            </div>
          </li>
        </ul>
      </template>
    </widget-template>
    <side-panel
      v-model="sidePanelActive"
      :width="483"
      class="panel-operator"
    >
      <div class="panel-operator__header">
        <h1 class="panel-operator__title title-m-bold">
          Операторы
        </h1>
        <p class="panel-operator__sub-title body-m-regular">
          96 операций за сегодня
        </p>
      </div>
      <div class="panel-operator__body">
        <ul
          class="panel-operator__list"
        >
          <li
            v-for="operator in operators"
            :key="operator.id"
            class="panel-operator__item"
          >
            <div class="panel-operator__item-top">
              <p class="panel-operator__name body-m-medium">
                {{ operator.label }}
              </p>
              <span class="panel-operator__percent body-m-semibold">44 операций / 10%</span>
            </div>
            <div class="panel-operator__item-bottom">
              <v-progress-linear
                :value="25"
                style="height: 4px"
                color="primary"
                rounded="rounded"
                class="panel-operator__progress"
              />
            </div>
          </li>
        </ul>
      </div>
    </side-panel>
  </div>
</template>

<script>
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'
  import SidePanel from '@/components/base/SidePanel.vue'

  export default {
    components: { SidePanel, WidgetTemplate },
    props: {
      widgetData: {
        type: Array,
        default () {
          return []
        },
      },
      operators: {
        type: Array,
        default () {
          return []
        },
      },
    },
    data () {
      return {
        sidePanelActive: false,
      }
    },
    computed: {
      someOperators () {
        return this.$_.take(this.operators, 3)
      },
    },
    mounted () {},
    methods: {
      toggleSidePanel () {
        this.sidePanelActive = !this.sidePanelActive
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_operators.scss";

</style>
