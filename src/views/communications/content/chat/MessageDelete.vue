<template>
  <v-dialog
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
          :color="colors.buttons.success"
          :loading="loadingRequest"
          @click="remove()"
        >
          Удалить
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    components: {

    },
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
      }
    },
    computed: {
      loadingApp () {
        return this.$store.getters['template/shared/loadingApp']
      },
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      colors () {
        return this.$store.getters['template/colors/colors']
      },
    },
    created () {

    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      async remove () {
        const message = {
          conversation_id: this.item.conversation_id,
          message_id: this.item.id,
        }
        // console.log(message)
        if (!this.deleteForAll) {
          this.$store.dispatch('chat/message/delete', message).then(() => {
            this.$emit('update:dialog', false)
          })
        }
        if (this.deleteForAll) {
          this.$store.dispatch('chat/message/deleteAll', message).then(() => {
            this.$emit('update:dialog', false)
          })
        }
      },
    },
  }
</script>

<style scoped>
    .modal-header {
        margin-bottom: 20px;
        font-size: 24px;
        color: #687983;
        text-align: center;
    }

    .modal-content {
        margin: 50px 11px 45px 11px;
    }

    .modal-action {
        display: flex;
    }

    .close {
        margin: 11px 0 0 11px;
        font-size: 13px;
        line-height: 16px;
        color: rgba(51, 51, 51, .6);
        border-bottom: 1px dotted rgba(51, 51, 51, .6);
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
