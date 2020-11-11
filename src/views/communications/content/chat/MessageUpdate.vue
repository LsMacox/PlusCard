<template>
  <v-dialog
    v-model="dialog"
    max-width="60%"
    persistent
  >
    <v-card class="pa-3">
      <v-container>
        <v-row justify="center">
          <v-col
            class="modal-header"
            cols="auto"
          >
            Редактирование сообщения
          </v-col>
        </v-row>
        <v-row>
          <v-col>Текст сообщения *</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="messageText"
              class="_input-field"
              max-length="10000"
              hint="* поле не должно быть пустым"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col>
            <v-btn
              class="_close"
              text
              @click="close()"
            >
              Отмена
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              class="_box-button"
              :disabled="!validate"
              color="success"
              :loading="messageUpdateRequest"
              @click="update(validate)"
            >
              <v-icon left>
                fa-edit
              </v-icon>
              Сохранить
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
// import AppTextarea from '../../../../template/form/Textarea'

  export default {
    components: {
    // AppTextarea
    },
    props: {
      dialog: Boolean,
      item: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        messageText: '',
        messageTextOld: '',
        messageUpdateRequest: false,
      }
    },
    computed: {
      validate () {
        if (this.messageText !== this.messageTextOld && this.messageText) { return true }
        return false
      },
    },
    created () {
      if (this.item.message) {
        this.messageText = this.item.message
        this.messageTextOld = this.item.message
      } else if (this.item.attachments && this.item.attachments.length) {
        const msgAttach = this.item.attachments.filter(
          (item) => item.type === 'message/text',
        )
        if (msgAttach.length) {
          this.messageText = msgAttach[0].content
          this.messageTextOld = msgAttach[0].content
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      async update (validate) {
        if (validate) {
          // токен чат-пользователя для операций с чатами

          const message = {
            conversation_id: this.item.conversation_id,
            message_id: this.item.id,
            message: this.messageText,
          }
          // console.log(message)
          this.messageUpdateRequest = true
          this.$store
            .dispatch('chat/message/update', message)
            .then(() => {
              this.$emit('update:dialog', false)
            })
            .finally(() => {
              this.messageUpdateRequest = false
            })
        }
      },
    },
  }
</script>

<style scoped>
.modal-header {
  margin-bottom: 0;
  font-size: 24px;
  color: #687983;
  text-align: center;
}

.modal-content {
  margin: 30px 0 20px 0;
}

.modal-action {
  display: flex;
}

.close {
  margin: 11px 0 0 11px;
  font-size: 13px;
  line-height: 16px;
  color: rgba(51, 51, 51, 0.6);
  border-bottom: 1px dotted rgba(51, 51, 51, 0.6);
  cursor: pointer;
}

/* MEDIA */
/* EXTRA SMALL */
@media (max-width: 600px) {
}

/* SMALL */
@media (min-width: 600px) and (max-width: 959.8px) {
}

/* MEDIUM */
@media (min-width: 960px) and (max-width: 1263.8px) {
}

/* LARGE */
@media (min-width: 1264px) and (max-width: 1903.8px) {
}

/* X LARGE */
@media (min-width: 1904px) {
}
</style>
