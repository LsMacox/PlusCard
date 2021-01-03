<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="500px"
    permanent
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <div class="navigation-drawers-setting-wrap">
        <div>
          <v-btn
            color="secondary"
            :text="true"
            :ripple="false"
            class="btn-with-img"
            @click="closeWebhookForm"
          >
            <v-icon class="icon-size-setting">
              mdi-arrow-left
            </v-icon>
            Назад
          </v-btn>
        </div>
        <div class="title-mg-title">
          <h2 class="title-h2 font-weight-bold">
            {{ id ? 'Редактирование вебхука' : 'Новый вебхук' }}
          </h2>
        </div>
        <div class="mbb-20">
          <h3 class="title-h3 font-weight-600 mgb-6">
            Название
          </h3>
          <p class="desc-15 color-text-grey">
            Введите название вебхука, которое отображаетее суть, чтобы в будущем вы не запутались.
          </p>
        </div>
        <div>
          <base-text-field
            v-model="webhookName"
            :validate-on-blur="false"
            :validation-placement="'bottom'"
            :rules="nameRules"
            placeholder="Введите название вебхука"
            outlined
            dense
          />
        </div>

        <div class="mbb-20">
          <h3 class="title-h3 font-weight-600 mgb-6">
            URL обработчика
          </h3>
          <p class="desc-15 color-text-grey">
            Введите URL входящего вебхука, созданного в Bitrix24.
          </p>
        </div>
        <div class="mbb-20">
          <base-text-field
              v-model="webhookURL"
              :validate-on-blur="false"
              :validation-placement="'bottom'"
              :rules="nameRules"
              placeholder="URL обработчика"
              outlined
              dense
          />
        </div>

<!--        <div class="mbb-20">-->
<!--          <v-select-->
<!--            outlined-->
<!--            label="Тип вебхука"-->
<!--            :items="webhookType"-->
<!--            item-text="label"-->
<!--            item-value="value"-->
<!--          />-->
<!--        </div>-->

        <div class="mbb-20">
          <v-select
              outlined
              label="Выбрите событие"
              :items="webhookEvent"
              v-model="selectedEvent"
              item-text="label"
              item-value="value"
          />
        </div>

        <div
          v-if="!!id"
          class="save-change btt-48"
        >
          <v-btn
            v-show="valid"
            :loading="confirmAction"
            color="primary"
            max-width="148"
            width="100%"
            @click="updateWebhookClick"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Сохранить
          </v-btn>
          <v-btn
            text
            class="trash-btn"
            :loading="deleteAction"
            @click="deleteWebhook"
          >
            <img src="@/icons/svg/trash.svg">
            Удалить вебхук
          </v-btn>
        </div>
        <div
          v-else
          class="btt-48"
        >
          <v-btn
            v-show="valid"
            :loading="confirmAction"
            color="primary"
            max-width="230"
            width="100%"
            @click="createWebhookClick"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Добавить вебхук
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import copyClipboard from '@/mixins/copyClipboard.js'

  export default {
    name: 'WebhookSettings',
    mixins: [copyClipboard],
    data () {
      return {
        valid: false,
        drawer: false,
        id: null,
        program_id: null,
        webhookName: '',
        webhookURL: '',
        webhookEvent: [
          {
            label: 'Создать лид',
            value: 'crm_lead_add',
          },
          {
            label: 'Создать контакт',
            value: 'crm_contact_add',
          },
          {
            label: 'Создать сделку',
            value: 'crm_deal_add',
          },
          {
            label: 'Найти контакт',
            value: 'crm_contact_list',
          },
          {
            label: 'Найти лид',
            value: 'crm_lead_list',
          },
        ],
        webhookType: [
          {
            label: 'Исходящий',
            value: 'OUTGOING',
          },
          {
            label: 'Входящий',
            value: 'INCOMING',
          },
        ],
        selectedEvent: [],
        selectedType: 'OUTGOING',
        confirmAction: false,
        deleteAction: false,
        nameRules: [
          v => !!v || 'Введите название вебхука',
          v => v.length <= 255 || 'Название не должно превышать 255 символов',
        ],
      }
    },
    computed: {
      ...mapGetters({
        checkOpenWebhookForm: 'configuringIntegrations/configuring_integrations/getOpenWebhookConfiguring',
        getCurrentWebhookUpdate: 'configuringIntegrations/configuring_integrations/getCurrentWebhookUpdate',
        programId: 'programId',
      }),
      webhookData () {
        return {
          id: this.id,
          webhook_name: this.webhookName,
          webhook_url: this.webhookURL,
          webhook_type: this.selectedType,
          webhook_event: {
            event: this.selectedEvent,
          },
          webhook_active: true,
          program_id: this.program_id || this.programId,
        }
      },

    },
    watch: {
      checkOpenWebhookForm (val) {
        console.log('update:checkOpenWebhookForm', val)
        this.drawer = val
      },
      drawer (val) {
        console.log('update:drawer', val)
        if (!val) {
          this.closeWebhookForm()
        }
      },

    },
    created () {
      this.init()
    },
    methods: {
      ...mapMutations({
        openWebhookForm: 'configuringIntegrations/configuring_integrations/openWebhookConfiguring',
        setUpdateWebhook: 'configuringIntegrations/configuring_integrations/setUpdateWebhook',
        updateCurrentWebhook: 'configuringIntegrations/configuring_integrations/updateCurrentWebhook',
      }),
      ...mapActions({
        CreateWebhook: 'configuringIntegrations/configuring_integrations/CreateWebhook',
        UpdateWebhook: 'configuringIntegrations/configuring_integrations/UpdateWebhook',
        RemoveWebhook: 'configuringIntegrations/configuring_integrations/RemoveWebhook',
      }),

      LoadData () {
        console.log('INIT DATA')
        console.log(this.getCurrentWebhookUpdate)
        if (this.getCurrentWebhookUpdate) {
          this.id = this.getCurrentWebhookUpdate.id
          this.program_id = this.getCurrentWebhookUpdate.program_id
          this.webhookName = this.getCurrentWebhookUpdate.name
          this.webhookURL = this.getCurrentWebhookUpdate.url
          // this.selectedEvent = this.webhookEvent.find(item => item.value === this.getCurrentWebhookUpdate.options.event)
          this.selectedEvent = this.getCurrentWebhookUpdate.options.event
        }
      },
      async init () {
        this.LoadData()
      },
      closeWebhookForm () {
        console.log('close...')
        this.openWebhookForm(false)
      },
      async deleteWebhook () {
        if (!this.id) return
        try {
          this.deleteAction = true
          await this.RemoveWebhook({
            programId: this.programId,
            webhookId: this.id,
          })
          this.closeWebhookForm()
        } catch (error) {
          console.error(error)
        } finally {
          this.deleteAction = false
        }
      },
      async createWebhookClick () {
        try {
          this.confirmAction = true
          await this.CreateWebhook(this.webhookData)
          this.closeWebhookForm()
        } catch (error) {
          console.error(error)
        } finally {
          this.confirmAction = false
        }
      },
      async updateWebhookClick () {
        if (!this.id || !this.valid) return
        console.log('webhooks_data')
        console.log(this.webhookData)
        console.log('webhooks_data')
        try {
          this.confirmAction = true
          await this.UpdateWebhook(this.webhookData)
          this.closeWebhookForm()
        } catch (error) {
          console.error(error)
        } finally {
          this.confirmAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>

  .navigation-drawers-setting-wrap {
    padding: 34px;
  }
  .icon-size-setting {
    font-size: 16px;
    margin-right: 6px;
  }
  .title-mg-title {
    margin: 50px 0 34px;
  }
  .mgb-6 {
    margin-bottom: 6px;
  }
  .mbb-20 {
    margin-top: 34px;
    margin-bottom: 20px;
  }
  .mbb-12 {
    margin-bottom: 12px;
  }
  .btt-48 {
    margin-top: 48px;
  }
  .tag-simple {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F7F7FC;
    border-radius: 6px;
    min-width: 172px;
    margin-bottom: 8px;
    color: #9191A1;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  .tag-wrap-select {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 34px;
  }
  .mb-select {
    margin-bottom: 12px;
  }
  .mbt-20 {
    margin-top: 20px;
  }
  .save-change {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .trash-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #EA4C2A;
    max-width: 162px;
    width: 100%;
    outline: none;
  }
  .copy-input {
    height: 45px;
    width: 415px;
    color: #B5B5C4;
    background: #F2F2F7;
  }
  .active-tag {
    background: #EBF1FF;
    color: #4776E6;
  }
  .wrap-copy-input {
    margin: 20px 0 34px;
    position: relative;
  }
  .copy-img {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
</style>
