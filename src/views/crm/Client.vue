<template>
  <div class="crm b-segment">
    <div
      class="crm__header b-segment__header"
    >
      <p class="crm__header-title title-m-bold neutral-900--text">
        Клиенты Metro Cash & Carry
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
    <side-panel-new-client
      v-model="sidePanelNewClientStatus"
    />
    <side-panel-edit-client
      v-model="sidePanelEditClient.status"
      :client-data="sidePanelEditClient.data"
    />
  </div>
</template>

<script>
  import SidePanelNewClient from './components/SidePanel/SidePanelNewClient'
  import SidePanelEditClient from './components/SidePanel/SidePanelEditClient'
  import Convertor from '@/mixins/convertor'

  export default {
    components: {
      SidePanelNewClient,
      SidePanelEditClient,
    },
    mixins: [Convertor],
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
    computed: {},
    watch: {},
    created () {
      this.clientData = this.$store.getters['crm/client/clients']
    },
    mounted () {},
    methods: {

    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

</style>
