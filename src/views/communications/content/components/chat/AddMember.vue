<template>
  <v-dialog
    v-model="dialog"
    class="dialog-chat-add-member"
    custom-class="app--modal"
  >
    <v-skeleton-loader
      :loading="loading"
      type="image"
    >
      <div class="modal">
        <div class="header">
          Список клиентов
        </div>

        <div class="content">
          <!-- все получатели -->
          <div style="display: flex;">
            <div
              class="check-all"
              @click="setRecipientAll()"
            >
              <div
                v-if="checkAll"
                class="check-all-back"
              >
                <v-icon color="white">
                  check
                </v-icon>
              </div>
            </div>
            <div class="name-all">
              Участники ваших чатов
            </div>
          </div>

          <!-- список получателей -->
          <div
            v-for="(item, i) in clients"
            :key="i"
            class="res-row"
          >
            <div class="line-h">
              <div class="line-v" />
            </div>
            <div
              class="check"
              @click="setRecipient(item)"
            >
              <div
                v-show="checkAll || isRecipient(item)"
                class="check-all-back"
              >
                <v-icon color="white">
                  check
                </v-icon>
              </div>
            </div>
            <div
              class="avatar"
              :style="'background: url(' + item.avatar + ');'"
            />
            <div class="name">
              {{ item.name }}
            </div>
          </div>
        </div>

        <div class="action">
          <v-btn @click="close()">
            Отмена
          </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            :loading="memberAddLoading"
            :disabled="!members.length"
            @click="add()"
          >
            Добавить
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
    },
    data () {
      return {
        loading: false,
        memberAddLoading: false,
        checkAll: false,
        members: [],
        membersOld: [],
      }
    },
    computed: {

      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      programId () {
        return this.$store.getters['brand/program/programId']
      },
      editedConversation () {
        return this.$store.getters['chat/conversation/editedConversation']
      },
      clients () {
        const clients = this.$store.getters['chat/member/clients']
        const members = Object.assign([], this.membersOld)

        const arr = []
        let check = false
        clients.forEach(item => {
          check = false
          members.forEach(member => {
            if (member.active && item.id === member.id) check = true
          })
          if (!check) arr.push(item)
        })

        return arr
      },
    },
    watch: {
      members (val) {
        if (val && val.length === this.clients.length) this.checkAll = true
        else this.checkAll = false
      },
    },
    async created () {
      this.membersOld = Object.assign([], this.editedConversation.members)
      this.loading = true
      try {
        if (this.programId) await this.$store.dispatch('chat/member/list', this.programId)
      } finally {
        this.loading = false
      }
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ПОЛУЧАТЕЛИ
       */

      setRecipientAll () {
        if (this.members.length === this.clients.length) {
          this.members = []
        } else {
          this.members = Object.assign([], this.clients)
        }
      },
      setRecipient (item) {
        let check = false
        let index = null
        this.members.forEach((recipient, i) => {
          if (recipient.id === item.id) {
            check = true
            index = i
          }
        })
        if (check) this.members.splice(index, 1)
        else this.members.push(item)
      },
      isRecipient (item) {
        const check = this.members.filter(recipient => recipient.id === item.id)
        if (check.length) return true
        return false
      },
      add () {
        const conversation = {
          conversation_id: this.editedConversation.id,
          members: this.members.map(item => item.id),
        }
        /// /console.log(conversation)
        this.memberAddLoading = true
        this.$store.dispatch('chat/member/add', conversation).then(() => {
          this.close()
        }).finally(() => {
          this.memberAddLoading = false
        })
      },
    },
  }
</script>
