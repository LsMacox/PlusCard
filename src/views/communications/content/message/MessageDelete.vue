<template>
  <v-dialog
    v-model="internalIsDelete"
    class="dialog-message-delete"
    max-width="420"
  >
    <div class="dialog-message-delete--content">
      <v-btn
        text
        class="btn content__btn-close"
        @click="close()"
      >
        <iconify-icon
          class="icon"
          icon="jam-close"
          width="21"
        />
      </v-btn>
      <div class="content__title">
        <p class="title-m-bold neutral-900--text">
          Удалить выбранное сообщение?
        </p>
      </div>
      <div
        v-if="showDeleteAll"
        class="content__delete-all-checkbox"
      >
        <div class="controls-input">
          <iconify-icon
            class="icon-check"
            icon="eva-checkmark-outline"
            width="14"
          />
          <input
            id="message-delete-checkbox"
            v-model="deleteForAll"
            type="checkbox"
            class="checkbox"
          >
          <label for="message-delete-checkbox">Удалить сообщение у всех</label>
        </div>
      </div>
      <div class="content__controls">
        <v-btn
          class="btn btn-cancel"
          color="primary-100"
          @click="close()"
        >
          <iconify-icon
            class="icon"
            icon="ion-checkmark-circle-outline"
            width="21"
          />
          <p class="body-m-semibold primary--text">
            Нет, оставить
          </p>
        </v-btn>
        <v-btn
          class="btn btn-success"
          color="primary"
          :loading="messageDeleteLoading"
          @click="remove()"
        >
          <iconify-icon
            class="icon"
            icon="feather-trash"
            width="21"
          />
          <p class="body-m-medium neutral-100--text">
            Да, удалить
          </p>
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      isDelete: Boolean,
      msgItem: {
        type: Object,
        default: null,
      },
      showDeleteAll: Boolean,
    },
    data () {
      return {
        internalIsDelete: this.isDelete,
        deleteForAll: false,
        messageDeleteLoading: false,
      }
    },
    watch: {
      isDelete (v) {
        this.internalIsDelete = v
      },
      internalIsDelete (v) {
        this.$emit('update:isDelete', v)
      },
    },
    methods: {
      close () {
        this.internalIsDelete = false
      },
      async remove () {
        const message = {
          conversation_id: this.msgItem.conversation_id,
          message_id: this.msgItem.id,
        }
        this.messageDeleteLoading = true
        if (this.deleteForAll && this.showDeleteAll) {
          this.$store.dispatch('chat/message/deleteAll', message).then(() => {
            this.internalIsDelete = false
          }).finally(() => {
            this.messageDeleteLoading = false
          })
        } else {
          this.$store.dispatch('chat/message/delete', message).then(() => {
            this.internalIsDelete = false
          }).finally(() => {
            this.messageDeleteLoading = false
          })
        }
      },
    },
  }
</script>
