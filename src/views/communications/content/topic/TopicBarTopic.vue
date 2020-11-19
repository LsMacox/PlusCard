<template>
  <div class="app--topic-bar-topic">
    <!-- Диалог тем -->
    <v-dialog
      v-model="dialog"
      width="500px"
      persistent
      scrollable
    >
      <!-- новая тема -->
      <app-topic-bar-topic-create
        v-if="dialogTopicCreate"
        :dialog.sync="dialogTopicCreate"
        :conversation-id="conversationId"
      />
      <!-- Редактирвоание -->
      <app-topic-bar-topic-update
        v-else-if="dialogTopicUpdate"
        :dialog.sync="dialogTopicUpdate"
        :conversation-id="conversationId"
        :topic-id="updatedTopicId"
      />
      <!-- Выбор темы -->
      <v-card v-else>
        <v-toolbar color="info">
          <v-toolbar-title>Список тем</v-toolbar-title>
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
        <!-- <v-card-title>
        <span class="headline">Новый чат</span>
      </v-card-title> -->
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <!-- список пуст -->
                <div
                  v-if="!topics.length"
                  class="topic-empty"
                >
                  Добавьте тему для беседы
                </div>

                <!-- список тем -->
                <div
                  v-else
                >
                  <div
                    v-for="(item, i) in topics"
                    :key="i"
                    class="topic-row"
                  >
                    <div
                      :class="getSelectTopicClass(item.id)"
                      @click="selectTopic(item.id)"
                    />

                    <div class="topic-row-line">
                      <div
                        class="topic-name"
                      >
                        {{ item.name }}
                      </div>

                      <v-spacer />

                      <div
                        v-if="item.owner_id == chatUser.id"
                        class="topic-admin"
                      >
                        (ред.)
                      </div>

                      <div
                        class="topic-members"
                      >
                        {{ item.members.length }} участников
                      </div>
                      <div class="topic-icon-box">
                        <v-icon
                          class="topic-icon"
                          @click="openTopicUpdate(item.id)"
                        >
                          fa-edit
                        </v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn

                  color="primary"
                  @click="dialogTopicCreate = true"
                >
                  <v-icon left>
                    fa-plus-circle
                  </v-icon>Создать новую тему
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            text
            class="//close"
            @click="close()"
          >
            Отмена
          </v-btn>
          <v-spacer />

          <v-btn
            color="primary"
            :disabled="!(topics.length && validateTopics)"
            @click="save()"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import AppTopicBarTopicCreate from './TopicBarTopicCreate'
  import AppTopicBarTopicUpdate from './TopicBarTopicUpdate'

  export default {
    components: {
      AppTopicBarTopicCreate,
      AppTopicBarTopicUpdate,
    },
    props: {
      dialog: Boolean,
      conversationId: {
        required: true,
        type: [Number, String],
      },
    },
    data () {
      return {
        dialogTopicCreate: false,
        dialogTopicUpdate: false,
        updatedTopicId: null,
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
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
      selectedTopicId: {
        get () {
          return this.$store.getters['chat/topic/selectedTopicId']
        },
        set (val) {
          this.$store.commit('chat/topic/selectedTopicId', val)
        },
      },
      validateTopics () {
        if (this.selectedTopicId) return true
        return false
      },
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      getTopicHeader () {
        if (this.dialogTopicCreate) return 'Новая тема'
        if (this.dialogTopicUpdate) return 'Просмотр темы'
        return 'Список тем'
      },
      back () {
        this.dialogTopicCreate = false
        this.dialogTopicUpdate = false
        this.$store.commit('chat/topic/nameExist', false)
      },
      close () {
        this.dialogTopicCreate = false
        this.selectedTopicId = null
        this.$emit('update:dialog', false)
      },
      save () {
        this.dialogTopicCreate = false
        this.$emit('update:dialog', false)
      },
      openTopicUpdate (id) {
        this.updatedTopicId = id
        this.dialogTopicUpdate = true
      },
      getSelectTopicClass (id) {
        if (this.selectedTopicId === id) return 'topic-select topic-select-active'
        return 'topic-select'
      },
      selectTopic (id) {
        this.selectedTopicId = id
      },
    },
  }
</script>
