<template>
  <v-skeleton-loader
    :loading="getIntegrationsAction"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="getCreateConfiguringIntegrations.length > 0 || getCreateConfiguringWebhooks.length > 0"
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
      <template v-slot:actions>
        <v-row
            justify="center"
        >
          <v-col>
            <v-btn
                color="primary"
                @click="newIntegration"
            >
              <iconify-icon
                  icon="plus-circle-outlined"
                  height="21"
                  style="margin-right: 10px"
              />
              Новая интеграция
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
                color="primary"
                @click="newWebhook"
            >
              <iconify-icon
                  icon="plus-circle-outlined"
                  height="21"
                  style="margin-right: 10px"
              />
              Новый вебхук
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </base-empty-block-page>
    <integration-form v-if="checkOpenNavigationRight" />
    <webhook-form v-if="checkWebhookForm" />
  </v-skeleton-loader>
</template>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import IntegrationForm from './navigationDrawers/IntegrationForm'
  import WebhookForm from './navigationDrawers/WebhookForm'
  import settingInfoTable from './settingInfoTable'
  export default {
    name: 'Setting',
    components: {
      IntegrationForm,
      settingInfoTable,
      WebhookForm,
    },
    data () {
      return {
        getIntegrationsAction: false,
        getWebhooksAction: false,
      }
    },
    computed: {
      ...mapGetters({
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
        checkOpenNavigationRight: 'configuringIntegrations/configuring_integrations/getOpenNavigationConfiguring',

        getCreateConfiguringWebhooks: 'configuringIntegrations/configuring_integrations/getCreateConfiguringWebhooks',
        checkWebhookForm: 'configuringIntegrations/configuring_integrations/getOpenWebhookConfiguring',
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
        setUpdateIntegration: 'configuringIntegrations/configuring_integrations/setUpdateIntegration',

        openWebhookForm: 'configuringIntegrations/configuring_integrations/openWebhookConfiguring',
        setUpdateWebhook: 'configuringIntegrations/configuring_integrations/setUpdateWebhook',
      }),
      ...mapActions({
        GetClients: 'configuringIntegrations/configuring_integrations/GetClients',
        GetScopes: 'configuringIntegrations/configuring_integrations/GetScopes',
        loadBonusUnits: 'company/bonus_units/loadBonusUnits',
        GetBonusResList: 'company/bonus_resources/GetList',

        GetWebhooks: 'configuringIntegrations/configuring_integrations/GetWebhooks',
      }),
      newIntegration () {
        this.setUpdateIntegration(null)
        this.openNavigationRight(true)
      },
      newWebhook () {
        this.setUpdateWebhook(null)
        this.openWebhookForm(true)
      },
      async init () {
        try {
          this.getIntegrationsAction = true
          await this.GetClients(this.programId)
          await this.GetWebhooks(this.programId)
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
