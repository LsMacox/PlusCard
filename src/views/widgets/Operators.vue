<template>
  <div style="height: 100%;">
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
            v-for="operator in operators"
            :key="operator.id"
            class="w-operator__item"
          >
            <div class="w-operator__item-top">
              <p class="w-operator__name body-s-medium">
                {{ operator.operator }}
              </p>
              <span class="w-operator__percent body-s-semibold">{{ `${getShare(operator)}%` }}</span>
            </div>
            <div class="w-operator__item-bottom">
              <v-progress-linear
                :value="getShare(operator)"
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
          {{ `${operations[0] ? operations[0] : 0} ${declOfNum(operations[0], titles)} ${getMyPeriod()}` }}
        </p>
      </div>
      <div class="panel-operator__body">
        <ul
          class="panel-operator__list"
        >
          <li
            v-for="operator in widgetData"
            :key="operator.id"
            class="panel-operator__item"
          >
            <div class="panel-operator__item-top">
              <p class="panel-operator__name body-m-medium">
                {{ operator.operator }}
              </p>
              <span class="panel-operator__percent body-m-semibold">
                {{ `${operator.operations_per_user} ${declOfNum(operator.operations_per_user, titles)} / ${getShare(operator)}%` }}
              </span>
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
    },
    data () {
      return {
        sidePanelActive: false,
        titles: ['операция', 'операции', 'операций'],
      }
    },
    computed: {
      operators () {
        return this.widgetData.slice(0, 3)
      },
      operations () {
        return this.$_.map(this.widgetData, 'operations_count')
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
    },
    mounted () {},
    methods: {
      toggleSidePanel () {
        this.sidePanelActive = !this.sidePanelActive
      },
      getShare (operator) {
        return Math.round(operator.operations_per_user / operator.operations_count * 100)
      },
      declOfNum (number, titles) {
        number = Number(number)
        const cases = [2, 0, 1, 1, 1, 2]
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      getMyPeriod () {
        if (this.period && this.period.id === 8) {
          return `за ${this.$moment(this.period.start).format('DD.MM.YYYY')} -
            ${this.$moment(this.period.end).format('DD.MM.YYYY')}`
        } else {
          return this.period.name
        }
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/widgets/_operators.scss";
</style>
