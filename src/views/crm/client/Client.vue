<template>
  <div class="crm b-segment">
    <div class="crm__header b-segment__header">
      <p class="crm__header-title title-m-bold neutral-900--text">
        {{ program.name }}
      </p>
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="sidePanelNewClientStatus = true"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          Новый клиент
        </p>
      </v-btn>
    </div>
    <div style="margin-top: 34px;">
      <div class="body-l-semibold neutral-900--text">
        Работа с клиентами
      </div>
      <div class="body-m-regular neutral-700--text">
        Для списания или начисления бонусов найдите клиента используя поле ниже. Вводите любые данные клиента: ФИО, номер карты, штрих-код, электронная почта, номер телефона.
      </div>
    </div>
    <client-table />
    <side-panel-new-client
      v-if="sidePanelNewClientStatus"
      v-model="sidePanelNewClientStatus"
    />
  </div>
</template>

<script>
  import ClientTable from './Table'
  import SidePanelNewClient from './components/SidePanelNewClient'

  export default {
    components: {
      ClientTable,
      SidePanelNewClient,
    },
    data () {
      return {
        sidePanelNewClientStatus: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    watch: {},
    created () {},
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss">
  @import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>
