<template>
  <v-row>
    <v-col>
      <BaseDialogFieldBlock
        title="Активная рассылка"
        description=""
      >
        <v-select
          v-model="model.action_json.notification_id"
          class=""
          :items="notificationPickList"
          item-text="name"
          item-value="id"
          placeholder="Выберите рассылку"
          outlined
          :rules="[
            v => !!v || 'Выберите рассылку',
          ]"
          :loading="getNotifyPickListAction || loading"
        />
      </BaseDialogFieldBlock>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: { },
    model: {
      prop: 'model',
      event: 'update',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    constants: {
 
    },
    data () {
      return {
        getNotifyPickListAction: false,
      }
    },
    computed: {
      ...mapGetters('company/notifications', ['notificationPickList']),
    },
    mounted () {
      this.loadPickNotify()
    },
    methods: {

      ...mapActions({
        getNotifyPickList: 'company/notifications/getPickList',
      }),

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
