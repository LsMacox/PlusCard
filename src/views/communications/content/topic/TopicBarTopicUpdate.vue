<template>
  <div class="app--topic-bar-topic-update">
    <v-card v-if="topic">
      <v-toolbar color="info">
        <v-toolbar-title>Редактирование темы</v-toolbar-title>
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
                  v-model="topic.name"
                  :disabled="chatUser.id == topic.owner_id ? false : true"
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
                <div
                  v-if="chatUser.id == topic.owner_id"
                  style="display: flex;"
                >
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
                <div
                  v-else
                  style="display: flex;"
                >
                  <div class="check-all">
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
                    v-if="item.id != topic.owner_id && chatUser.id == topic.owner_id"
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
                    <div
                      v-show="checkAll || isRecipient(item.id)"
                      class="check-all-back"
                    >
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
                    v-if="item.id != topic.owner_id && chatUser.id == topic.owner_id"
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
                  <!-- администратор -->
                  <div
                    v-else-if="item.id == topic.owner_id"
                    class="topic-rights"
                  >
                    <div class="topic-admin">
                      администратор
                    </div>
                  </div>
                  <!-- права в теме где я не администратор -->
                  <div
                    v-else-if="item.id == chatUser.id && isRecipient(item.id)"
                    class="topic-rights"
                  >
                    <div
                      v-if="isRecipient(item.id)"
                      :class="getCanWriteClass(item.id)"
                    />

                    <div
                      v-if="isRecipient(item.id)"
                      :class="getCanWriteLabelClass(item.id)"
                    >
                      Написание
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
        <app-topic-bar-topic-delete
          :topic-id="topic.id"
          @onDelete="back()"
        >
          <template v-slot:activator="{ on }">
            <!-- @click="openTopicDelete()" -->
            <v-btn
              color="error"
              v-on="on"
            >
              <v-icon left>
                fa-trash
              </v-icon>Удалить
            </v-btn>
          </template>
        </app-topic-bar-topic-delete>

        <v-spacer />

        <!-- кнопка добавить тему -->
        <v-btn
          color="success"
          :loading="topicUpdateRequest"
          :disabled="!validateTopic"
          @click="update()"
        >
          <v-icon left>
            fa-save
          </v-icon>Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import AppTopicBarTopicDelete from './TopicBarTopicDelete'

  export default {
    components: {
      AppTopicBarTopicDelete,
    },
    props: {
      dialog: Boolean,
      conversationId: {
        type: Number,
        required: true,
      },
      topicId: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {
        topic: null,
        checkAll: false,
        name: '',
        recipients: [],
        dialogTopicDelete: false,
        deleteSuccess: false,
        topicUpdateRequest: false,
        formValid: false,
        nameRules: [
          v => !!v || 'Введите название темы',
          v => !this.nameExist || 'Тема с таким названием уже существует',
        ],

      }
    },
    computed: {

      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      topicOld () {
        const topics = this.$store.getters['chat/topic/topics']
        if (topics) {
          const topic = topics.filter((item) => item.id === this.topicId)
          if (topic.length) {
            return topic[0]
          }
        }

        return null
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
      nameExist () {
        return this.$store.getters['chat/topic/nameExist']
      },

      validateTopic () {
        return JSON.stringify(this.topic) !== JSON.stringify(this.topicOld) && this.checkRecipients() && this.formValid
      },
    },
    watch: {
      'topic.name' (newVal, oldVal) {
        if (!(this.topic && this.topicOld)) return

        if (
          newVal &&
          oldVal !== 'undefined' &&
          this.chatUser.id === this.topic.owner_id &&
          newVal !== this.topicOld.name
        ) {
          this.getValidate()
        }
        if (newVal === this.topicOld.name) {
          this.$store.commit('chat/topic/nameExist', false)
        }
      },
      'topic.members' (val) {
        if (val.length === this.members.length) this.checkAll = true
        else this.checkAll = false
      },
      deleteSuccess (val) {
        if (val) this.$emit('update:dialog', false)
      },
    },
    mounted () {
      this.topic = JSON.parse(JSON.stringify(this.topicOld))
      this.recipients = JSON.parse(JSON.stringify(this.topic.members))
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ТЕМЫ
       */
      back () {
        this.$emit('update:dialog', false)
      },
      checkRecipients () {
        console.log('checkRecipients', this.topic)
        if (!this.topic) return false
        const recipients = this.topic.members.filter(
          (item) => item.id !== this.chatUser.id,
        )
        if (recipients.length) return true
        return false
      },
      setRecipientAll () {
        if (this.topic.members.length === this.members.length) {
          if (this.topic.owner_id === this.chatUser.id) {
            this.topic.members = []
            this.topic.members.push({
              id: this.chatUser.id,
              can_write: true,
            })
          } else {
            this.topic.members = []
          }
        } else {
          this.topic.members = this.members.map((item) => {
            return {
              id: item.id,
              can_write: false,
            }
          })
        }
      },
      setRecipient (id) {
        let index = null
        this.topic.members.forEach((item, i) => {
          if (item.id === id) {
            return (index = i)
          }
        })
        if (index !== null) this.topic.members.splice(index, 1)
        else {
          this.topic.members.push({
            id,
            can_write: false,
          })
        }
      },
      isRecipient (id) {
        if (!this.isEmptyObject(this.topic)) {
          const check = this.topic.members.filter((item) => item.id === id)
          if (check.length) return true
        }
        return false
      },
      getCanWriteClass (id) {
        const recipient = this.topic.members.filter((item) => item.id === id)
        if (recipient.length) {
          if (recipient[0].can_write) return 'can-write can-write-active'
        }
        return 'can-write'
      },
      getCanWriteLabelClass (id) {
        const recipient = this.topic.members.filter((item) => item.id === id)
        if (recipient.length) {
          if (recipient[0].can_write) return 'can-write-label-active'
        }
        return 'can-write-label'
      },
      setCanWrite (id) {
        let index = null
        this.topic.members.forEach((item, i) => {
          if (item.id === id) index = i
        })
        if (index !== null) {
          if (this.topic.members[index]) {
            this.topic.members[index].can_write = !this.topic.members[index]
              .can_write
          }
        } else {
          this.topic.members.push({
            id,
            can_write: true,
          })
        }
      },
      async getValidate () {
        // чат-пользователь

        const topic = {
          conversation_id: this.conversationId,
          name: this.topic.name,
        }
        // console.log(topic)
        this.$store.dispatch('chat/topic/nameValidation', topic)
      },
      async update () {
        // чат-пользователь

        const topic = {
          id: this.topicId,
          name: this.topic.name,
          is_private: false,
          members: this.topic.members,
        }
        // console.log(topic)
        this.topicUpdateRequest = true
        this.$store.dispatch('chat/topic/update', topic).then(() => {
          this.back()
        }).finally(() => {
          this.topicUpdateRequest = false
        })
      },
      openTopicDelete () {
        this.dialogTopicDelete = true
      },
    },
  }
</script>
