<template>
  <v-dialog
    v-model="internalDialog"
    class="dialog-message-delete"
    max-width="420"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Удалить сообщение?</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-checkbox
                v-if="showDeleteAll"
                v-model="deleteForAll"
                label="Удалить сообщение у всех"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          text
          @click="close()"
        >
          Отмена
        </v-btn>
        <v-spacer />
        <v-btn

          color="success"
          :loading="messageDeleteLoading"
          @click="remove()"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <v-dialog
    v-model="dialog"
    max-width="350"
    hide-overlay
    persistent
    @click:outside="close()"
  >
    <v-card class="modal-card">
      <div class="modal-header">
        Удалить сообщение?
      </div>

      <div class="modal-content">
        <app-checkbox
          v-if="showDeleteAll"
          label="Удалить сообщение у всех"
          :value.sync="deleteForAll"
          hint=""
        />
      </div>

      <div class="modal-action">
        <div>
          <div
            class="close"
            @click="close()"
          >
            Отмена
          </div>
        </div>

        <v-spacer />

        <v-btn
          class="box-button"
          icon="clear"
          color="success"
          :loading="messageDeleteLoading"
          @click="remove()"
        >
          Удалить
        </v-btn>
      </div>
    </v-card>
  </v-dialog> -->
</template>

<script>
  export default {
    props: {
      dialog: Boolean,
      item: {
        type: Object,
        default: null,
      },
      showDeleteAll: Boolean,
    },
    data () {
      return {
        deleteForAll: false,
        messageDeleteLoading: false,
      }
    },
    computed: {
      internalDialog: {
        get () {
          return this.dialog
        },
        set (val) {
          if (val === this.dialog) return
          this.$emit('update:dialog', val)
        },
      },
    },
    created () {

    },
    methods: {
      close () {
        this.internalDialog = false
      },
      async remove () {
        const message = {
          conversation_id: this.item.conversation_id,
          message_id: this.item.id,
        }
        this.messageDeleteLoading = true
        if (this.deleteForAll) {
          this.$store.dispatch('chat/message/deleteAll', message).then(() => {
            this.internalDialog = false
          }).finally(() => {
            this.messageDeleteLoading = false
          })
        } else {
          this.$store.dispatch('chat/message/delete', message).then(() => {
            this.internalDialog = false
          }).finally(() => {
            this.messageDeleteLoading = false
          })
        }
      },
    },
  }
</script>
