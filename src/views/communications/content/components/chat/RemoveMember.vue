<template>
  <v-dialog
    v-model="dialog"
    class="dialog-chat-remove-member"
    custom-class="app--modal"
  >
    <v-skeleton-loader
      :loading="loading"
      type="image"
    >
      <div
        class="modal"
      >
        <div class="header">
          Удалить участника?
        </div>

        <div class="content">
          <div>Участник: {{ item.name }}</div>
        </div>

        <div class="action">
          <v-btn
            @click="close()"
          >
            Отмена
          </v-btn>

          <v-spacer />

          <v-btn
            color="error"
            :loading="memberRemoveLoading"
            @click="remove()"
          >
            Удалить
          </v-btn>
        </div>
      </div>
    </v-skeleton-loader>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialog: Boolean,
      conversationId: {
        type: Number,
        required: true,
      },
      item: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        loading: false,
        memberRemoveLoading: false,

      }
    },
    computed: {
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      remove () {
        const conversation = {
          conversation_id: this.conversationId,
          members: [this.item.id],
        }
        /// /console.log(conversation)
        this.memberRemoveLoading = true
        this.$store.dispatch('chat/member/remove', conversation).then(() => {
          this.close()
        }).finally(() => {
          this.memberRemoveLoading = false
        })
      },
    },
  }
</script>
