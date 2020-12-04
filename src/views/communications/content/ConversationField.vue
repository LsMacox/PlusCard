<template>
  <div class="app--chat--field">
    <div
      v-if="!currentConversationId"
      class="empty-field"
    >
      <v-img
        max-width="186"
        max-height="156"
        :src="require('@/assets/png/empty-chat.png')"
      />
    </div>
    <!-- overlayChat -->
    <div
      v-else-if="overlayChat"
      class="overlayChat"
      @click="closeReplyMessage()"
    >
      <div class="overlayChatText">
        Выберите чат из списка справа
        <br>для пересылки сообщения
      </div>
    </div>
    <v-skeleton-loader
      v-else-if="loadingConversations || loadingMessage"
      :loading="loadingConversations || loadingMessage"
      :style="{ height: '100%', width: '100%' }"
      type="header, body, table-tfoot"
      :types="{
        test: 'avatar, text',
        header: 'list-item-avatar-two-line',
        body: 'image@4',
      }"
    />
    <div
      v-else
      id="conversationWrap"
      class="app--conversationWrapper"
    >
      <conversation-status-bar
        :conversation-id="currentConversationId"
        :search-string.sync="searchString"
        :search-choose.sync="searchChoose"
        :search-count="searchCount"
      />
      <div class="app--conversation--drop--wrap">
        Перетащите сюда фотографии, чтобы отправить их
      </div>

      <!-- лента чатов conversation-scroll-y -->
      <div
        id="conversationField"
        ref="conversationField"
        class="app--conversation--content"
        @scroll="scrollFeed"
      >
        <!-- прелоадер старых сообщений  -->
        <div
          v-for="item in messages"
          :key="item.id"
          class="app--conversation--message-box"
        >
          <div :id="`message-${item.id}`">
            <message
              :item="item"
              :conversation-id="currentConversationId"
              :my-message="
                chatUser.id == item.sender_id &&
                  (profile.id == item.real_sender_id || !realChatName)"
              :is-close-action.sync="isMessageCloseActions"
              @reply="openReply"
              @edit="openEdit"
            />
          </div>
        </div>
      </div>

      <!-- строка typing -->
      <!-- <div style="padding: 2px 3px 2px 4px">
        <app-typing :conversation-id="currentConversationId" />
      </div> -->

      <!-- форма отправки -->
      <conversation-send-box
        :messages="messages"
        :is-reply-message.sync="isReplyMessage"
        :is-edit-message.sync="isEditMessage"
        :reply-message-id="replyMessageId"
        :edit-message-id="editMessageId"
        @send-message="toBottomFeed()"
      />
    </div>
  </div>
</template>

<script>
  // components
  import ConversationStatusBar from './ConversationStatusBar'
  import ConversationSendBox from './ConversationSendBox'
  import Message from './message/Message'

  // mixins
  import MixinAttachment from '../mixins/conversation-field/attachment.js'
  import MixinValidate from '../mixins/conversation-field/validate.js'
  import MixinDragOver from '../mixins/conversation-field/drag-over.js'
  import MixinMessage from '../mixins/conversation-field/message.js'
  import MixinTyping from '../mixins/conversation-field/typing.js'
  import MixinSearch from '../mixins/conversation-field/search.js'
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-field/data.js'

  export default {
    components: {
      ConversationStatusBar,
      ConversationSendBox,
      Message,
    },
    mixins: [
      MixinAttachment,
      MixinValidate,
      MixinDragOver,
      MixinMessage,
      MixinTyping,
      MixinSearch,
      MixinIndex,
      MixinData,
    ],
    data () {
      return {
        activeWindow: true,
        // search
        searchString: '',
        searchChoose: 0,
        searchCount: 0,
        searchFound: [],
        // scroll
        messageIdToScrollPage: null,
        feedScrollTop: null,
        // Boolean
        loadingMessage: false,
        topicFilter: false,
        overlayChat: false,
        sending: false,
        // message
        newMessage: '',
        isMessageCloseActions: false,
        // message reply
        isReplyMessage: false,
        replyMessageId: NaN,
        // message edit
        isEditMessage: false,
        editMessageId: NaN,
        // attach files
        attachFileName: '',
        attachFileType: '',
        attachFilePreview: '',
        attachFile: '',
        attachLoading: false,
        attachPreview: false,
        files: [],
        filesPreview: [],
        // types
        typingTime: null,
        // drag
        dragAndDropCapable: false,
      }
    },
    computed: {
      conversationProgram () {
        return this.$store.getters['chat/data/conversationProgram'](this.currentConversationId)
      },
      realChatName () {
        return this.$store.getters['chat/data/realChatName'](this.currentConversationId)
      },
    },
    watch: {
      async currentConversationId (newV, oldV) {
        if (newV) {
          // при переходе в другой чат обнуляем
          this.messageIdToScrollPage = null
          this.feedScrollTop = null
          //
          await this.fetchData(newV)
          if (this.issetMessages) this.toBottomFeed()
        }
      },
      async messages (v) {
        if (Object.keys(v).length && !this.loadingMessagePage) {
          this.updateMessages(v)
        }
        // Перемещение ленты чата на сообщение с которого началась загрузка страницы сообщений
        await this.$nextTick()
        if (document.getElementById(this.messageIdToScrollPage)) {
          const msg = document.getElementById(this.messageIdToScrollPage)

          if (msg) {
            const conversationField = this.$refs.conversationField
            if (conversationField) {
              conversationField.scrollTop = msg.offsetTop - 115
            } // 115 px поправка скрола
          }
        }
      },
      async filteredMessages (v) {
        await this.$nextTick()
        this.toBottomFeed()
      },
    },
    async mounted () {
      if (this.currentConversationId) {
        await this.fetchData(this.currentConversationId)
      }
      if (this.issetMessages) {
        this.init()
        this.updateMessages()
      }
    },
    methods: {
      openReply (replyMessageId) {
        this.isReplyMessage = true
        this.replyMessageId = replyMessageId
      },
      openEdit (editMessageId) {
        this.isEditMessage = true
        this.editMessageId = editMessageId
      },
      clearForm () {
        this.newMessage = ''
        this.attachFileName = ''
        this.attachFileType = ''
        this.attachFilePreview = ''
        this.attachFile = ''
        this.files = []
        this.filesPreview = []
        this.$refs.attachFile.value = null
        this.$store.commit('chat/topic/selectedTopicId', null)
        this.$store.commit('chat/message/recipients', [])
        this.sending = false
      },
    },
  }
</script>
