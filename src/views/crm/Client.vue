<template>
  <div class="crm b-segment">
    <div
      v-if="Boolean(segmentsData.length)"
      class="crm__header b-segment__header"
    >
      <p class="crm__header-title title-m-bold neutral-900--text">
        Клиенты Metro Cash & Carry
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
    <empty-client
      v-if="!segmentsData.length"
    />
    <side-panel-new-client
      v-model="sidePanelNewClientStatus"
    />
  </div>
</template>

<script>
  import EmptyClient from './components/EmptyClient'
  import SidePanelNewClient from './components/SidePanel/SidePanelNewClient'
  import Convertor from '@/mixins/convertor'

  export default {
    components: {
      EmptyClient,
      SidePanelNewClient,
    },
    mixins: [Convertor],
    data () {
      return {
        segmentsData: null,
        sidePanelNewClientStatus: false,
        sidePanelEditClientStatus: false,
      }
    },
    computed: {},
    watch: {},
    created () {
      this.segmentsData = this.$store.getters['crm/segment/segments']
    },
    mounted () {},
    methods: {

    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

</style>
