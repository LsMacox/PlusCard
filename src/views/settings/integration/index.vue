<template>
  <v-skeleton-loader
    :loading="getIntegrationsAction"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="getCreateConfiguringIntegrations.length>0"
      fluid
      class="program-settings"
    >
      <setting-info-table />
    </v-container>
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Здесь пока ничего нет :’("
      action-icon="mdi-plus-circle-outline"
      action-text="Новая интеграция"
      action
      @action="newIntegration"
    >
      <template v-slot:image>
        <v-img
          src="@/assets/png/settings-dummy.png"
          width="193.96px"
          height="174px"
        />
      </template>
      <template v-slot:description>
        <span>Вы не добавили еще ни одной интеграции с сторонними сервисмами и приложениями</span>
      </template>
    </base-empty-block-page>
    <integration-form v-if="checkOpenNavigationRight" />
  </v-skeleton-loader>
</template>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import IntegrationForm from './navigationDrawers/IntegrationForm'
  import settingInfoTable from './settingInfoTable'
  export default {
    name: 'Setting',
    components: {
      IntegrationForm,
      settingInfoTable,
    },
    data () {
      return {
        getIntegrationsAction: false,
      }
    },
    computed: {
      ...mapGetters({
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
        checkOpenNavigationRight: 'configuringIntegrations/configuring_integrations/getOpenNavigationConfiguring',

        programId: 'programId',
      }),
    },
    watch: {
      programId (v) {
        if (v) this.init()
      },
    },
    created () {
      this.init()
    },
    methods: {
      ...mapMutations({
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
      }),
      ...mapActions({
        GetClients: 'configuringIntegrations/configuring_integrations/GetClients',
        GetScopes: 'configuringIntegrations/configuring_integrations/GetScopes',
        loadBonusUnits: 'company/bonus_units/loadBonusUnits',
        GetBonusResList: 'company/bonus_resources/GetList',
      }),
      newIntegration () {
        this.openNavigationRight(true)
      },
      async init () {
        try {
          this.getIntegrationsAction = true
          await this.GetClients(this.programId)
          // await this.GetScopes()
          // await this.loadBonusUnits(this.programId)
        } catch (error) {
          console.error(error)
        } finally {
          this.getIntegrationsAction = false
        }
      },
    },

  }
</script>

<style scoped>
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    margin: 0 auto 60px;
    height: 70vh;
  }
  .text-info-no-data {
    text-align: center;
    margin: 34px 0;
  }
</style>
