<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Обработчик активности"
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Действие обработчика"
            description="Выберите, какое действие будет выполнять обработчик"
          >
            <v-select
              v-model="model.action_type"
              class=""
              :items="actionTypeList"
              item-text="text"
              item-value="id"
              item-disabled="disabled"
              placeholder="Выберите действие"
              outlined
              :rules="[
                v => !!v || 'Выберите действие',
              ]"
              @change="onChangeAction"
            />
          </BaseDialogFieldBlock>
        </v-col>
      </v-row>
      <handler-segment-action
        v-if="[ACTION_ENUM.SEGMENT_IN.id, ACTION_ENUM.SEGMENT_OUT.id].includes(model.action_type)"
        v-model="model"
      />
      <handler-notification-action
        v-else-if="model.action_type === ACTION_ENUM.NOTIFICATION.id"
        v-model="model"
      />
      <handler-bonus-action
        v-else-if="[ACTION_ENUM.BONUS_DEBIT.id, ACTION_ENUM.BONUS_CREDIT.id].includes(model.action_type)"
        v-model="model"
      />

      <v-row
        justify="space-between"
        align="center"
      >
        <v-col>
          <v-btn
            :disabled="!valid"
            color="primary"
            :loading="saveHandlerAction"
            @click="saveHandlerClick()"
          >
            <v-icon left>
              $iconify_ion-checkmark-circle-outline
            </v-icon>Сохранить
          </v-btn>
        </v-col>
        <v-col v-if="model.id && !model.deleted_at">
          <v-btn
            text
            color="error"
            :loading="deleteAction"
            @click="deleteClick"
          >
            <v-icon left>
              $iconify_feather-trash
            </v-icon>
            <span>Удалить</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </BaseDrawerDialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import dialogable from '@/mixins/dialogable.js'
  import ProgramEventBroadcasterHandler from '@/models/program/broadcasterHandler'

  export default {
    components: {
      HandlerSegmentAction: () => import('./HandlerSegmentAction'),
      HandlerNotificationAction: () => import('./HandlerNotificationAction'),
      HandlerBonusAction: () => import('./HandlerBonusAction'),
    },
    mixins: [dialogable],
    props: {
      model: {
        type: Object,
        required: true,
      },
    },
    constants: {
      actionTypeList: ProgramEventBroadcasterHandler.ACTION_ENUM.toList(),
      ACTION_ENUM: ProgramEventBroadcasterHandler.ACTION_ENUM,
    },
    data () {
      return {
        valid: false,
        saveHandlerAction: false,
        deleteAction: false,
        getSegmenPickListAction: false,
        getNotifyPickListAction: false,

      }
    },
    computed: {
      ...mapGetters('crm/segment', ['pickSegments']),
      ...mapGetters('company/notifications', ['notificationPickList']),
    },
    mounted () {
      // this.loadPickSegments()
      // this.loadPickNotify()
    },
    methods: {
      ...mapActions({
        getSegmentPickList: 'crm/segment/getPickList',
        getNotifyPickList: 'company/notifications/getPickList',
        CreateBroadcasterHandler: 'company/event_broadcasters/CreateBroadcasterHandler',
        UpdateBroadcasterHandler: 'company/event_broadcasters/UpdateBroadcasterHandler',
        DeleteBroadcasterHandler: 'company/event_broadcasters/DeleteBroadcasterHandler',
      }),

      onChangeAction () {
        this.model.action_json = {}
      },

      async loadPickSegments () {
        try {
          this.getSegmenPickListAction = true
          await this.getSegmentPickList(this.model.program_id)
        } catch (e) {
          console.error(e)
        } finally {
          this.getSegmenPickListAction = false
        }
      },
      async loadPickNotify () {
        try {
          this.getNotifyPickListAction = true
          await this.getNotifyPickList(this.model.program_id)
        } catch (e) {
          console.error(e)
        } finally {
          this.getNotifyPickListAction = false
        }
      },
      async deleteClick () {
        try {
          this.deleteAction = true
          if (this.model.broadcaster_id && this.model.id) {
            await this.DeleteBroadcasterHandler(this.model.id)
          } else {

          }
          this.close()
          this.$emit('delete', this.model)
        } catch (e) {

        } finally {
          this.deleteAction = false
        }
      },
      async saveHandlerClick () {
        if (!this.$refs.form.validate()) return

        try {
          this.saveHandlerAction = true
          let savedModel = this.model
          if (this.model.broadcaster_id) {
            if (this.model.isNew) {
              savedModel = await this.CreateBroadcasterHandler(Object.assign({ name: this.$uuid() }, this.model))
            } else {
              savedModel = await this.UpdateBroadcasterHandler(Object.assign({ handler_id: this.model.id }, this.model))
            }
          }
          this.close()
          this.$emit('save', savedModel)
        } catch (error) {
          console.error(error)
        } finally {
          this.saveHandlerAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
.dialog-header{
  padding: 34px;
}
.dialog-body {
  padding: 34px;
  padding-right: 34px;
}
.cert-payment-select {
  margin-top: 14px;;
  margin-bottom: 14px;
}
</style>
