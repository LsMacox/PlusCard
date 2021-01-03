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
        <div
          ref="conversationFieldWrapper"
          class="content__wrapper"
        >
          <!-- прелоадер старых сообщений  -->
          <div
            v-for="(item, idx) in messages"
            :key="item.id"
            class="app--conversation--message-box"
          >
            <div
              :id="`message-${item.id}`"
              :style="Object.keys(messages).indexOf(idx) === 0 ? 'margin-top: 24px;' : ''"
            >
              <message
                :messages="messages"
                :item="item"
                :conversation-id="currentConversationId"
                :my-message="
                  chatUser.id == item.sender_id &&
                    (profile.id == item.real_sender_id || !realChatName)"
                :is-close-action.sync="isMessageCloseActions"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- форма отправки -->
      <conversation-send-box
        :messages="messages"
        :is-topic-panel.sync="isTopicPanel"
        @send-message="toBottomFeed()"
      />
    </div>
    <forward-panel
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
        // topic
        isTopicPanel: false,
        // types
        typingTime: null,
      }
    },
    watch: {
      async currentConversationId (v) {
        this.$store.commit('chat/sendbox/clearAllModes')
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
            const conversationFieldWrapper = this.$refs.conversationFieldWrapper
            if (conversationFieldWrapper) {
              conversationFieldWrapper.scrollTop = msg.offsetTop - 115
            } // 115 px поправка скрола
          }
        }
      },
    },
    updated () {
      this.wrapperOverflowX()
    },
    async mounted () {
      if (this.currentConversationId) {
        await this.fetchData(this.currentConversationId)
        await this.$nextTick()
        this.wrapperOverflowX()
        this.toBottomFeed()
      }
      if (this.issetMessages) {
        this.updateMessages()
      }
    },
    methods: {
      wrapperOverflowX () {
        if (this.$refs?.conversationFieldWrapper) {
          if (
            this.$refs.conversationField.clientHeight > this.$refs.conversationFieldWrapper.clientHeight
          ) {
            this.$refs.conversationFieldWrapper.style.overflowX = 'visible'
          } else {
            this.$refs.conversationFieldWrapper.style.overflowX = 'hidden'
          }
        }
      },
    },
  }
</script>
