<template>
  <div>
    <div class="modal-content">
      <!-- новая тема -->
      <!-- настройки темы -->
      <v-input
        class="input-field"
        label="Название темы"
        :value.sync="topic.name"
        type="text"
        max-length="100"
        :disabled="chatUser.id == topic.owner_id ? false : true"
        hint
        :error="nameErrors"
        :validate.sync="$v.topic.name"
      />

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
              check
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
              check
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
              check
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
              check
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
    </div>

    <div
      v-if="topic.owner_id == chatUser.id"
      class="modal-action"
    >
      <v-icon
        class="delete-icon"
        @click="openTopicDelete()"
      >
        delete
      </v-icon>

      <v-spacer />

      <!-- кнопка добавить тему -->
      <v-btn
        class="box-button"
        color="success"
        :loading="topicUpdateRequest"
        :disabled="!validateTopic"
        @click="update()"
      >
        <v-icon left>
          edit
        </v-icon>
        Сохранить
      </v-btn>
    </div>

    <app-topic-bar-topic-delete
      :dialog.sync="dialogTopicDelete"
      :delete-success.sync="deleteSuccess"
      :topic-id="topicId"
    />
  </div>
</template>

<script>
  //
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
        topic: {},
        checkAll: false,
        name: '',
        recipients: [],
        dialogTopicDelete: false,
        deleteSuccess: false,
        topicUpdateRequest: false,

      }
    },
    validations: {
      topic: {
        name: {
        // required,
        // maxLength: maxLength(100)
        },
      },
    },
    computed: {
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      topicOld () {
        const topics = this.$store.getters['chat/topic/topics']
        const topic = topics.filter((item) => item.id === this.topicId)
        if (topic.length) {
          return topic[0]
        }
        return {}
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
      nameErrors () {
        const errors = []
        if (!this.$v.topic.name.$dirty) return errors
        !this.$v.topic.name.required &&
          errors.push('Поле "Название темы" обязательно')
        !this.$v.topic.name.maxLength &&
          errors.push('Поле "Название темы" не может быть более 100 символов')
        this.nameExist && errors.push('Тема с таким названием уже существует')
        return errors
      },
      validateTopic () {
        return (this.$v.topic.name.required &&
          this.$v.topic.name.maxLength &&
          this.checkRecipients() &&
          !this.nameExist &&
          JSON.stringify(this.topic) !== JSON.stringify(this.topicOld))
      },
    },
    watch: {
      'topic.name' (newVal, oldVal) {
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

.delete-icon {
  font-size: 32px;
  color: #ff4a00;
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
