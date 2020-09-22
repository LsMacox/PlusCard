<template>
  <div style="height: 100%;">
    <list-progress-frame
      :data="listProgressData"
      class="w-operator"
    >
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
          class="w-operator__header-icon wc-neutral"
          icon="chevron-right"
          height="17"
          @click="toggleSidePanel"
        />
      </template>
    </list-progress-frame>

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
  import ListProgressFrame from '@/views/widgets/frames/ListProgressFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import SidePanel from '@/components/base/SidePanel.vue'

  export default {
    components: { SidePanel, ListProgressFrame },
    mixins: [WidgetFunctions],
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
        const o = this.widgetData.slice(0, 3)
        if (o.length) return o
        return this.operatorsStore.map(item => {
          return { operator: item.label }
        })
      },
      operations () {
        return this.$_.map(this.widgetData, 'operations_count')
      },
      operatorsStore () {
        return this.$store.getters['widget/operators/operators'].slice(0, 3)
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
      listProgressData () {
        const data = []

        this.operators.forEach(operator => {
          data.push({ left: operator.operator, right: `${this.getShare(operator)}%`, progress: this.getShare(operator) })
        })

        return data
      },
    },
    methods: {
      toggleSidePanel () {
        this.sidePanelActive = !this.sidePanelActive
      },
      getShare (operator) {
        const unit = operator.operations_per_user
        const total = operator.operations_count
        if (total) return Math.round(unit / total * 100)
        return 0
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
