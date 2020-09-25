<template>
  <v-card>
    <v-toolbar color="info">
      <v-toolbar-title>Новая тема</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          icon
          @click="back()"
        >
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card-title>
        <span class="headline">Новый чат</span>
      </v-card-title> -->
    <v-divider />
    <v-card-text>
      <v-container>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <v-row>
            <v-col>
              <!-- настройки темы -->
              <v-text-field
                v-model="name"
                :rules="nameRules"
                placeholder="Название темы"
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
              <!-- получатели темы -->
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
                v-for="(item, i) in members"
                :key="i"
                class="res-row"
              >
                <div class="line-h">
                  <div class="line-v" />
                </div>

                <!-- выбор участника -->
                <div
                  v-if="item.id != chatUser.id"
                  class="check"
                  @click="setRecipient(item.id)"
                >
                  <div
                    v-show="checkAll || isRecipient(item.id)"
                    class="check-all-back"
                  >
                    <v-icon color="white">
                      fa-check
                    </v-icon>
                  </div>
                </div>
                <div
                  v-else
                  class="check"
                >
                  <div class="check-all-back">
                    <v-icon color="white">
                      fa-check
                    </v-icon>
                  </div>
                </div>

                <!-- аватар и имя -->
                <div
                  class="avatar"
                  :style="'background: url(' + item.avatar + ');'"
                />
                <div class="name">
                  {{ item.name }}
                </div>

                <v-spacer />

                <!-- выбор прав -->
                <div
                  v-if="item.id != chatUser.id"
                  class="topic-rights"
                >
                  <div
                    v-if="isRecipient(item.id)"
                    :class="getCanWriteClass(item.id)"
                    @click="setCanWrite(item.id)"
                  />

                  <div
                    v-if="isRecipient(item.id)"
                    :class="getCanWriteLabelClass(item.id)"
                    @click="setCanWrite(item.id)"
                  >
                    Написание
                  </div>
                </div>
                <div
                  v-else
                  class="topic-rights"
                >
                  <div class="topic-admin">
                    администратор
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        text
        class="//close"
        @click="back()"
      >
        Отмена
      </v-btn>
      <v-spacer />

      <!-- кнопка добавить тему -->
      <v-btn
        class="//box-button"
        color="success"
        :loading="topicCreateAction"
        :disabled="!validateTopic"
        @click="create()"
      >
        <v-icon left>
          fa-plus
        </v-icon>Добавить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    components: {
    },
    props: {
      dialog: Boolean,
      conversationId: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {
        checkAll: false,
        name: '',
        recipients: [],
        nameRules: [
          v => !!v || 'Введите название темы',
          v => !this.nameExist || 'Тема с таким названием уже существует',
        ],
        formValid: false,
        topicCreateAction:false,

      }
    },
    computed: {
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
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
      nameExist () {
        return this.$store.getters['chat/topic/nameExist']
      },
      validateTopic () {
        return this.checkRecipients() && this.formValid
      },
    },
    watch: {
      name (v) {
        if (v) this.getValidate()
      },
      recipients (val) {
        if (val.length === this.members.length && val.length > 0) this.checkAll = true
        else this.checkAll = false
      },
    },
    mounted () {
      // this.recipients.push({
      //     id: this.chatUser.id,
      //     can_write: true
      // });
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ТЕМЫ
       */

      back () {
        this.name = ''
        this.recipients = []
        this.$refs.form.reset()
        this.$store.commit('chat/topic/nameExist', true)
        this.$emit('update:dialog', false)
      },
      checkRecipients () {
        const recipients = this.recipients.filter(
          item => item.id !== this.chatUser.id,
        )
        if (recipients.length) return true
        return false
      },
      setRecipientAll () {
        if (this.recipients.length === this.members.length) {
          this.recipients = []
        } else {
          this.recipients = this.members.map(item => {
            return {
              id: item.id,
              can_write: false,
            }
          })
        }
      },
      setRecipient (id) {
        let index = null
        this.recipients.forEach((item, i) => {
          if (item.id === id) {
            return (index = i)
          }
        })
        if (index !== null) this.recipients.splice(index, 1)
        else {
          this.recipients.push({
            id,
            can_write: false,
          })
        }
      },
      isRecipient (id) {
        const check = this.recipients.filter(item => item.id === id)
        if (check.length) return true
        return false
      },
      getCanWriteClass (id) {
        const recipient = this.recipients.filter(item => item.id === id)
        if (recipient.length) {
          if (recipient[0].can_write) return 'can-write can-write-active'
        }
        return 'can-write'
      },
      getCanWriteLabelClass (id) {
        const recipient = this.recipients.filter(item => item.id === id)
        if (recipient.length) {
          if (recipient[0].can_write) return 'can-write-label-active'
        }
        return 'can-write-label'
      },
      setCanWrite (id) {
        let index = null
        this.recipients.forEach((item, i) => {
          if (item.id === id) index = i
        })
        if (index !== null) {
          if (this.recipients[index]) {
            this.recipients[index].can_write = !this.recipients[index].can_write
          }
        } else {
          this.recipients.push({
            id,
            can_write: true,
          })
        }
      },
      async getValidate () {
        // чат-пользователь

        const topic = {
          conversation_id: this.conversationId,
          name: this.name,
        }
        /// ///console.log(topic)
        this.$store.dispatch('chat/topic/nameValidation', topic)
      },
      async create () {
        // чат-пользователь

        const topic = {
          conversation_id: this.conversationId,
          name: this.name,
          is_private: false,
          members: this.recipients,
        }

        topic.members.push({
          id: this.chatUser.id,
          can_write: true,
        })
        /// /console.log(topic)

        this.topicCreateAction = true
        this.$store.dispatch('chat/topic/create', topic).then(() => {
          this.back()
        }).finally(() => {
          this.topicCreateAction = false
        })
      },
    },
  }
</script>

<style scoped>
    /* MODAL */

    .modal-header {
        margin-top: 10px;
        font-size: 24px;
        color: #687983;
        text-align: center;
    }

    .modal-content {
        margin: 50px 15px 90px 15px;
    }

    .modal-action {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        display: flex;
        margin: 10px 15px;
    }

    .close {
        margin-top: 15px;
        font-size: 13px;
        line-height: 16px;
        color: rgba(51, 51, 51, 0.6);
        border-bottom: 1px dotted rgba(51, 51, 51, 0.6);
        cursor: pointer;
    }

    /* TOPICS */

    .topics-btn-add {
        position: absolute;
        top: 30px;
        right: 30px;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        padding: 2px 2px;
        font-weight: 900;
        background-color: #24d3ed;
        cursor: pointer;
    }

    .topic-empty {
        font-size: 18px;
        color: rgba(51, 51, 51, 0.5);
        text-align: center;
    }

    .topic-row {
        display: flex;
        padding: 7px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    .topic-name {
        padding: 2px 0 0 0;
    }

    .topic-members {
        color: rgba(0, 0, 0, 0.4);
        padding: 2px 10px 0 0;
    }

    .topic-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.2);
        margin-right: 3px;
    }

    .topic-icon:hover {
        color: rgba(0, 0, 0, 0.4);
    }

    .input-field {
        margin-bottom: 20px;
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
        border: 1px solid rgba(51, 51, 51, 0.3);
        cursor: pointer;
    }

    .check-all-back {
        width: 28px;
        height: 28px;
        border-radius: 30px;
        background-color: #24d3ed;
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
        background-color: rgba(51, 51, 51, 0.3);
    }

    .line-v {
        position: absolute;
        bottom: -14px;
        right: 0;
        width: 1px;
        height: 35px;
        margin: 0 14px 15px 14px;
        background-color: rgba(51, 51, 51, 0.3);
    }

    .check {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        border: 1px solid rgba(51, 51, 51, 0.3);
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

    .topic-rights {
        display: flex;
        padding: 5px 0;
    }

    .topic-admin {
        color: #ff4a00;
    }

    .can-write {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        margin-right: 5px;
        cursor: pointer;
    }

    .can-write-active {
        background-color: #24d3ed;
    }

    .can-write-label {
        color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    .can-write-label-active {
        color: rgba(0, 0, 0, 0.7);
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
