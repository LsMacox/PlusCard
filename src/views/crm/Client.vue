<template>
  <div class="crm b-segment">
    <div class="crm__header b-segment__header">
      <p class="crm__header-title title-m-bold neutral-900--text">
        {{ program.name }}
      </p>
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="sidePanelEditClient.status = true"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          Редактирование клиента
        </p>
      </v-btn>
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
    <side-panel-edit-client
      v-model="sidePanelEditClient.status"
      :client-data="sidePanelEditClient.data"
    />
  </div>
</template>

<script>
  import ClientTable from '@/views/crm/client/ClientTable'
  import SidePanelNewClient from './components/SidePanel/SidePanelNewClient'
  import SidePanelEditClient from './components/SidePanel/SidePanelEditClient'

  export default {
    components: {
      ClientTable,
      SidePanelNewClient,
      SidePanelEditClient,
    },
    data () {
      return {
        clientData: null,
        sidePanelNewClientStatus: false,
        sidePanelEditClient: {
          status: false,
          data: null,
        },
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>
