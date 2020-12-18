<template>
  <div class="attachment-account">
    <div class="account">
      <div
        class="account-card"
        :style="'background-color:' + content.program.bgcolor1 + ';'
          + 'border: 1px solid ' + content.program.bgcolor2 + ';'
          + 'color:' + content.program.color + ';'"
        @click.stop="getAccount()"
      >
        <div class="account-card-header">
          <div class="account-card-title">
            <div>{{ content.program.name }}</div>
          </div>
          <div
            :style="'background-image: url(' + content.program.logo_short + ');'"
            class="account-card-logo"
          />
        </div>
      </div>

      <v-dialog
        v-if="show"
        v-model="show"
        width="450px"
        hide-overlay
        @click:outside="close()"
      >
        <div
          class="account-modal"
          :style="'background-color:' + account.program.bgcolor1 + ';'
            + 'border: 1px solid ' + account.program.bgcolor2 + ';'
            + 'color:' + account.program.color + ';'"
        >
          <div
            class="account-modal-header"
            :style="'background-color:' + account.program.bgcolor2 + ';'"
          >
            <div
              v-if="account.program.use_logo"
              :style="'background-image: url(' + account.program.logo_short + ');'"
              class="account-modal-logo"
            />
            <div class="account-modal-title">
              <div
                v-if="account.program.use_name"
                class="account-modal-title-h1"
              >
                {{ account.program.name }}
              </div>
              <div v-if="account.program.use_slogan">
                {{ account.program.slogan }}
              </div>
            </div>
          </div>

          <div class="account-modal-detail">
            <div>ID: {{ account.id }}</div>
            <div v-if="account.program.use_num">
              Номер: {{ account.number }}
            </div>
            <div v-if="account.program.use_barcode">
              Штрих-код: {{ account.barcode }}
            </div>
            <div v-if="account.program.use_pincode">
              Пин-код: {{ account.pincode }}
            </div>
          </div>

          <div class="account-modal-user">
            <div
              :style="'background-image: url(' + account.user.avatar + ');'"
              class="account-modal-avatar"
            />
            <div class="account-modal-user-title">
              <div class="account-modal-user-text">
                Владелец
              </div>
              <div class="account-modal-user-name">
                {{ account.user.name }}
              </div>
            </div>
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        type: [Number, String],
        required: true,
      },
      content: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        show: false,
      }
    },
    computed: {
      account () {
        return this.$store.getters['chat/attachment/account']
      },
    },
    methods: {
      close () {
        this.show = false
      },
      async getAccount () {
        // токен чат-пользователя для операций с чатами

        const account = {
          id: this.content.id,
          conversation_id: this.conversationId,
        }
        /// ///console.log(account)
        this.$store.dispatch('chat/attachment/account', account).then(() => {
          this.show = true
        })
      },
    },
  }
</script>
