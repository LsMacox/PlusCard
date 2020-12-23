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
      <!-- status bar -->
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
              :is-choice-message.sync="isChoiceMessage"
              :is-close-action.sync="isMessageCloseActions"
              :choice-message-ids.sync="choiceMessageIds"
              @reply="openReply"
              @edit="openEdit"
              @forward="openForward"
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
        :is-forward-message.sync="isForwardMessage"
        :is-topic-panel.sync="isTopicPanel"
        :is-topic-message.sync="isTopicMessage"
        :is-choice-message.sync="isChoiceMessage"
        :choice-message-ids.sync="choiceMessageIds"
        :selected-topic.sync="selectedTopic"
        :reply-message-id="replyMessageId"
        :edit-message-id="editMessageId"
        @send-message="toBottomFeed()"
      />
    </div>
    <forward-panel
      v-model="isForwardMessage"
      :message-id="forwardMessageId"
      :conversation-id="currentConversationId"
    />
    <topic-panel
      v-model="isTopicPanel"
      :conversation-id="currentConversationId"
    />
  </div>
</template>

<script>
  // components
  import ConversationStatusBar from './ConversationStatusBar'
  import ConversationSendBox from './ConversationSendBox'
  import ForwardPanel from './components/chat/ForwardPanel'
  import TopicPanel from './components/chat/TopicPanel'
  import Message from './message/Message'

  // mixins
  import MixinValidate from '../mixins/conversation-field/validate.js'
  import MixinMessage from '../mixins/conversation-field/message.js'
  import MixinSearch from '../mixins/conversation-field/search.js'
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-field/data.js'

  export default {
    components: {
      ConversationStatusBar,
      ConversationSendBox,
      TopicPanel,
      ForwardPanel,
      Message,
    },
    mixins: [
      MixinValidate,
      MixinMessage,
      MixinSearch,
      MixinIndex,
      MixinData,
    ],
    data () {
      return {
        // search
        searchString: '',
        searchChoose: 0,
        searchCount: 0,
        searchFound: [],
        // scroll
        messageIdToScrollPage: null,
        feedScrollTop: null,
        // Booleans
        loadingMessage: false,
        topicFilter: false,
        sending: false,
        // message
        isMessageCloseActions: false,
        // forward
        isForwardMessage: false,
        forwardMessageId: NaN,
        // topic
        isTopicPanel: false,
        isTopicMessage: false,
        selectedTopic: {},
        // choice
        isChoiceMessage: false,
        choiceMessageIds: [],
        // message reply
        isReplyMessage: false,
        replyMessageId: NaN,
        // message edit
        isEditMessage: false,
        editMessageId: NaN,
        // types
        typingTime: null,
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
      async currentConversationId (v) {
        this.isReplyMessage = false
        this.isEditMessage = false
        this.isChoiceMessage = false
        this.isTopicMessage = false
        if (v) {
          // при переходе в другой чат обнуляем
          this.messageIdToScrollPage = null
          this.feedScrollTop = null
          // fetch
          await this.fetchData(v)
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
      openForward (forwardMessageId) {
        this.isForwardMessage = true
        this.forwardMessageId = forwardMessageId
      },
    },
  }
</script>
