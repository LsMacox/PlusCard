<template>
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
</template>

<script>
  //
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
        color: rgba(51, 51, 51, .6);
        border-bottom: 1px dotted rgba(51, 51, 51, .6);
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
        background-color: #24D3ED;
        cursor: pointer;
    }

    .topic-empty {
        font-size: 18px;
        color: rgba(51, 51, 51, .5);
        text-align: center;
    }

    .topic-row {
        display: flex;
    }

    .topic-select {
        width: 20px;
        height: 20px;
        margin: 9px;
        border-radius: 4px;
        border: 1px solid #c3c3c3;
        cursor: pointer;
    }

    .topic-select-active {
        background-color: #24D3ED;
    }

    .topic-row-line {
        display: flex;
        width: 100%;
        padding: 7px 0;
        border-bottom: 1px solid rgba(0, 0, 0, .2);
    }

    .topic-name {
        padding: 2px 0 0 0;
    }

    .topic-admin {
        color: #ff4a00;
        padding: 1px 5px 0 0;
    }

    .topic-members {
        color: rgba(0, 0, 0, .4);
        padding: 2px 7px 0 0;
    }

    .topic-icon-box {
        width: 23px;
    }

    .topic-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, .2);
    }

    .topic-icon:hover {
        color: rgba(0, 0, 0, .4);
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

    .can-write {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, .2);
        background-color: #ffffff;
        margin-right: 5px;
        cursor: pointer;
    }

    .can-write-active {
        background-color: #24D3ED;
    }

    .can-write-label {
        color: rgba(0, 0, 0, .2);
        cursor: pointer;
    }

    .can-write-label-active {
        color: rgba(0, 0, 0, .7);
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
