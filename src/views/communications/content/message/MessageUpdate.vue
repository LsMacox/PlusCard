<template>
  <v-dialog
    v-model="dialog"
    class="dialog-message-update"
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

  export default {
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
