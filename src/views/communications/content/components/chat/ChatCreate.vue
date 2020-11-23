<template>
  <v-dialog
    v-model="dialogLocal"
    class="dialog-chat-create"
    width="500px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Новый чат</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="dialogLocal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- <v-card-title>
        <span class="headline">Новый чат</span>
      </v-card-title> -->
      <v-divider />
      <v-card-text>
        <v-form v-model="formValid">
          <v-container>
            <v-row v-if="members.length > 1">
              <v-col>
                <v-text-field
                  v-model="form.name"
                  :rules="nameRules"
                  placeholder="Введите название чата"
                  :disabled="members.length < 2"
                  counter
                  outlined
                  clearable
                  minlength="1"
                  maxlength="100"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
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
                        fa-check
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
                        fa-check
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
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          text
          @click="dialogLocal = false"
        >
          Отмена
        </v-btn>
        <v-spacer />

        <v-btn
          color="primary"
          :loading="conversationCreateRequest"
          :disabled="!(members.length && formValid)"
          @click="createChatClick"
        >
          Создать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialog: Boolean,
    },
    constants: {},
    data () {
      return {
        form: {
          name: null,
        },
        formValid: false,
        loading: false,
        checkAll: false,
        members: [],
        conversationCreateRequest: false,
        nameRules: [
          v => (this.members.length === 0 || !!v) || 'Название чата обязательно',
          v => (v && v.length < 100) || 'Название чата не должен быть более 100 символов',
        ],
      }
    },
    computed: {

      dialogLocal: {
        get () { return this.dialog },
        set (v) {
          this.$emit('update:dialog', v)
        },
      },
      programId () {
        return this.$store.getters.programId
      },
      clients () {
        return this.$store.getters['chat/member/clients']
      },
    },
    watch: {
      members (val) {
        if (val && val.length === this.clients.length) this.checkAll = true
        else this.checkAll = false
      },
    },
    async created () {
    },

    methods: {
      close () {
        this.dialogLocal = false
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
      createChatClick () {
        const conversation = {
          name: this.form.name,
          program_id: this.programId,
          members: this.members.map(item => item.id),
        }
        /// /console.log(conversation)
        this.conversationCreateRequest = true
        this.$store.dispatch('chat/conversation/create', conversation).then(() => {
          this.close()
        }).finally(() => {
          this.conversationCreateRequest = false
        })
      },
    },
  }
</script>
