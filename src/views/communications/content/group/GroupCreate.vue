<template>
  <v-dialog
    v-model="internalDialog"
    class="dialog-group-create"
    max-width="500px"
  >
    <v-card>
      <v-toolbar color="info">
        <v-toolbar-title>Новая группа получателей</v-toolbar-title>
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
        <v-form v-model="formValid">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="form.name"
                  :rules="nameRules"
                  placeholder="Введите название группы"
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
                <div style="display: flex">
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
                    Все участники чата
                  </div>
                </div>

                <!-- список получателей -->
                <div
                  v-for="(item, i) in members"
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
          @click="close()"
        >
          Отмена
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="groupCreateAction"
          :disabled="!(recipients.length && formValid)"
          @click="create"
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
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        form: {
          name: null,
        },
        checkAll: false,
        recipients: [],
        nameRules: [
          (v) => !!v || 'Введите название группы',
          (v) => this.isUniqueName(v) || 'Групп с таким названием уже существует',
        ],
        groupCreateAction: false,
        formValid: false,
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
      groups () {
        return this.$store.getters['chat/group/groups']
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        let members = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        if (this.conversation && this.conversation.members) {
          members = this.conversation.members.filter((item) => {
            if (item.id !== chatUser.id && item.active) return item
          })
        }
        return members
      },
    },
    watch: {
      recipients (val) {
        if (val && val.length === this.members.length) this.checkAll = true
        else this.checkAll = false
      },
    },
    methods: {
      isUniqueName (name) {
        return this.groups.filter((item) => item.name === name).length === 0
      },
      close () {
        this.recipients = []
        this.internalDialog = false
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ПОЛУЧАТЕЛИ
       */

      setRecipientAll () {
        if (this.recipients.length === this.members.length) {
          this.recipients = []
        } else {
          this.recipients = Object.assign([], this.members)
        }
      },
      setRecipient (item) {
        let check = false
        let index = null
        this.recipients.forEach((recipient, i) => {
          if (recipient.id === item.id) {
            check = true
            index = i
          }
        })
        if (check) this.recipients.splice(index, 1)
        else this.recipients.push(item)
      },
      isRecipient (item) {
        const check = this.recipients.filter(
          (recipient) => recipient.id === item.id,
        )
        if (check.length) return true
        return false
      },

      create () {
        const group = {
          name: this.form.name,
          conversation_id: this.conversationId,
          parent_group_id: null,
          members: this.recipients.map((item) => item.id),
        }
        /// /console.log(group)
        this.groupCreateAction = true
        this.$store
          .dispatch('chat/group/create', group)
          .then(() => {
            this.close()
          })
          .finally(() => {
            this.groupCreateAction = false
          })
      },
    },
  }
</script>
