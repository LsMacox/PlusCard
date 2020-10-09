<template>
  <side-panel
    v-model="state"
    :width="483"
    class="panel-crm panel-crm_edit_client"
  >
    <div class="panel-crm__header panel-crm_edit_client__header">
      <div class="panel-crm_edit_client__tabs">
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          :class="{active: !mode}"
          color="primary-100"
          @click="mode = false"
        >
          Обычный
        </v-btn>
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          :class="{active: mode}"
          color="primary-100"
          @click="mode = true"
        >
          Расширенный
        </v-btn>
      </div>
    </div>
    <div class="panel-crm__body panel-crm_edit_client__body">
      <mode-usual
        v-if="!mode"
        :client-data="tableData"
      />
    </div>
  </side-panel>
</template>

<script>
  import Convertor from '@/mixins/convertor.js'
  import SidePanel from '@/components/base/SidePanel'
  import ModeUsual from './components/EditClientModeUsual'

  export default {
    components: {
      SidePanel,
      ModeUsual,
    },
    mixins: [Convertor],
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      active: {
        type: Boolean,
      },
      tableData: {
        type: Object,
        default: () => {
          return {
            id: '103112',
            gender: true,
            birthday: '10.03.1990',
            city: 'Новокузнецк',
            name: 'Константин',
            lastname: 'Константинопольский',
            last_activity: '02.08.2020 04:32',
            phone: '79832525202',
            email: 'rs.bikeev@yandex.ru',
            barcode: '1640000000145437',
            card: '432156',
            avatar: require('@/assets/png/custom/beardedman.png'),
          }
        },
      },
    },
    data () {
      return {
        mode: false, // false = usual, true = extended
        state: this.active,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    watch: {
      active () {
        this.state = this.active
      },
      state () {
        this.$emit('changeState', this.state)
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      async fetchData () {
        try {
          this.$store.commit('crm/clientCard/SET_LOADING', true)
          await this.$store.dispatch('company/bonus_resources/GetList', this.program.id)
          await this.$store.dispatch('crm/clientCard/getAccountBalances', this.tableData)
        } finally {
          this.$store.commit('crm/clientCard/SET_LOADING', false)
        }
      },
    },
  }
</script>
