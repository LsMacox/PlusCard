<template>
  <v-dialog
    v-model="internalDialog"
    max-width="500px"
  >
    <v-card>
      <v-toolbar color="info">
        <v-toolbar-title>Редактирование группы</v-toolbar-title>
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
                    Все участники чата
                  </div>
                </div>

                <!-- список получателей -->
                <div
                  v-for="(member, i) in members"
                  :key="i"
                  class="res-row"
                >
                  <div class="line-h">
                    <div class="line-v" />
                  </div>
                  <div
                    class="check"
                    @click="setRecipient(member)"
                  >
                    <div
                      v-show="checkAll || isRecipient(member)"
                      class="check-all-back"
                    >
                      <v-icon color="white">
                        fa-check
                      </v-icon>
                    </div>
                  </div>
                  <div
                    class="avatar"
                    :style="'background: url(' + member.avatar + ');'"
                  />
                  <div class="name">
                    {{ member.name }}
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
          :loading="groupUpdateAction"
          :disabled="!(recipients.length && formValid)"
          @click="update()"
        >
          Обновить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      dialog: {
        type: Boolean,
        default: false,
      },
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
        groupUpdateAction: false,
        formValid: false,
        nameRules: [
          v => !!v || 'Введите название группы',
          v => this.isUniqueName(v) || 'Групп с таким названием уже существует',
        ],
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
        const conversation = this.$store.getters['chat/conversation/conversations'].filter(item => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        let members = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        if (this.conversation && this.conversation.members) {
          members = this.conversation.members.filter(item => {
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
    created () {
      this.form.name = this.item.name
      this.recipients = Object.assign([], this.item.members)
    },
    methods: {
      isUniqueName (name) {
        return this.groups.filter(item => item.name === name).length === 0
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
        const check = this.recipients.filter(recipient => recipient.id === item.id)
        if (check.length) return true
        return false
      },
      
      update () {
        const group = {
          id: this.item.id,
          name: this.form.name,
          parent_group_id: null,
          members: this.recipients.map(item => item.id),
        }
        /// /console.log(group)
        this.groupUpdateAction = true
        this.$store.dispatch('chat/group/update', group).then(() => {
          this.close()
        }).finally(() => {
          this.groupUpdateAction = false
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/components/_modal.scss";

.modal {
    min-width: 400px;
}

.content {
    margin: 0 0 20px 0;
    padding: 0 !important;
    max-height: 60vh;
    overflow-y: auto;
}

/* RECIPIENTS */

.res-row {
    display: flex;
    margin: 5px 0;
}

.check-all {
    margin-bottom: 15px;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid rgba(51, 51, 51, .3);
    cursor: pointer;
}

.check-all-back {
    width: 28px;
    height: 28px;
    border-radius: 30px;
    background-color: #24D3ED;
    padding: 2px;
}

.name-all {
    padding: 4px 10px;
    font-weight: 900;
}

.line-h {
    position: relative;
    width: 15px;
    height: 1px;
    margin: 14px 0 14px 15px;
    background-color: rgba(51, 51, 51, .3);
}

.line-v {
    position: absolute;
    bottom: -14px;
    right: 0;
    width: 1px;
    height: 35px;
    margin: 0 14px 15px 14px;
    background-color: rgba(51, 51, 51, .3);
}

.check {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid rgba(51, 51, 51, .3);
    cursor: pointer;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-left: 10px;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
}

.name {
    padding: 5px 10px;
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
