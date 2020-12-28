<template>
  <div class="app-conversation-send-box">
    <div
      class="app--conversation--sendForm"
    >
      <app-topic
        v-if="internalIsTopicMessage"
        :conversation-id="currentConversationId"
        :is-topic-message.sync="internalIsTopicMessage"
        :is-topic-panel.sync="internalIsTopicPanel"
      />

      <app-reply
        v-if="internalIsReplyMessage"
        :conversation-id="currentConversationId"
        :is-reply-message.sync="internalIsReplyMessage"
        :msg-item="messages[replyMessageId]"
      />

      <app-edit
        v-if="internalIsEditMessage"
        :conversation-id="currentConversationId"
        :is-edit-message.sync="internalIsEditMessage"
        :msg-item="messages[editMessageId]"
      />

      <div
        class="app--conversation--sendField"
        :class="[
          internalIsReplyMessage ? 'reply' :
          internalIsEditMessage ? 'edit' :
          internalIsTopicMessage ? 'topic' :
          (message && message.length) ? 'writes' :
          isAttachedFile ? 'file' : ''
        ]"
      >
        <div
          id="messageWrapper"
        >
          <v-row
            no-gutters
            style="height: 100%"
          >
            <!-- ==== Choice ==== -->
            <app-choice
              v-if="isChoiceMessage && internalChoiceMessageIds.length > 0"
              :is-choice-message.sync="internalIsChoiceMessage"
              :message-ids="internalChoiceMessageIds"
            />
            <!-- ==== Record ==== -->
            <app-record-start
              v-if="isRecording"
              :is-recording="isRecording"
              :is-stop.sync="isStop"
              :record-strip-count="recordStripCount"
              :record-strip-max-height="recordStripMaxHeight"
              :record-list.sync="recordList"
              :record-volumes.sync="recordVolumes"
              :record-play.sync="recordPlay"
              :record-play-current-time.sync="recordPlayCurrentTime"
              :recorder="recorder"
            />
            <!-- ==== Record stop ==== -->
            <app-record-stop
              v-if="!isRecording && isStop && recordList.length"
              ref="recordStop"
              :conversation-id="currentConversationId"
              :is-recording="isRecording"
              :is-play.sync="isPlay"
              :is-stop.sync="isStop"
              :record-strip-count="recordStripCount"
              :record-list.sync="recordList"
              :record-volumes.sync="recordVolumes"
              :record-play.sync="recordPlay"
              :record-play-current-time.sync="recordPlayCurrentTime"
              :recorder="recorder"
            />
            <!-- ==== Text ==== -->
            <div
              v-if="!isRecording && !isStop && !(isChoiceMessage && internalChoiceMessageIds.length)"
              class="app-conversation--sendForm__message__text"
              :class="[(message && message.length) ? 'writes' : '']"
            >
              <!-- Attach -->
              <div
                v-if="!message || !message.length"
                class="attach"
              >
                <iconify-icon
                  class="icon icon-attach"
                  icon="ion-attach"
                  width="21"
                  @click="$refs.attachFile.click()"
                />
                <input
                  ref="attachFile"
                  type="file"
                  class="input-file"
                  @change="addFile"
                >
              </div>
              <iconify-icon
                v-else
                class="icon icon-close"
                icon="ion-close-circle-outline"
                width="21"
                @click="clearMessage"
              />
              <div class="message-block">
                <label for="messageTextArea" />
                <v-textarea
                  id="messageTextArea"
                  ref="messageTextArea"
                  v-model="message"
                  class="message-text-area"
                  rows="1"
                  row-height="20"
                  auto-grow
                  hide-details
                  :disabled="sending"
                  placeholder="Напишите сообщение..."
                  @keyup.ctrl.enter="addLine"
                  @keypress.enter.exact.stop="send"
                  @change="setTemplateMessage(message)"
                />
              </div>
              <div class="left-block">
                <!-- Hash Icon -->
                <iconify-icon
                  class="icon icon-hash"
                  icon="feather-hash"
                  width="21"
                  @click="toogleTopic"
                />
                <!-- Smile Icon -->
                <iconify-icon
                  class="icon icon-smile"
                  icon="feather-smile"
                  width="21"
                />
                <!-- Microphone Icon -->
                <iconify-icon
                  v-if="(!message || !message.length) && !isAttachedFile"
                  id="record"
                  class="icon icon-mic"
                  icon="feather-mic"
                  width="21"
                  @click="toggleRecorder"
                />
                <!-- Send Icon -->
                <iconify-icon
                  v-if="(message && message.length) || isAttachedFile"
                  class="icon icon-send"
                  icon="feather-send"
                  width="21"
                  @click="send"
                />
              </div>
            </div>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // components
  import AppEdit from './components/sendbox/Edit'
  import AppReply from './components/sendbox/Reply'
  import AppTopic from './components/sendbox/Topic'
  import AppChoice from './components/sendbox/Choice'
  import AppRecordStop from './components/sendbox/RecordStop'
  import AppRecordStart from './components/sendbox/RecordStart'

  // mixins
  import MixinRecorder from '../mixins/conversation-send-box/recorder.js'
  import MixinMessage from '../mixins/conversation-send-box/message.js'
  import MixinTyping from '../mixins/conversation-send-box/typing.js'
  import MixinFiles from '../mixins/conversation-send-box/files.js'
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-send-box/data.js'

  export default {
    components: {
      AppEdit,
      AppReply,
      AppTopic,
      AppChoice,
      AppRecordStop,
      AppRecordStart,
    },
    mixins: [
      MixinRecorder,
      MixinMessage,
      MixinTyping,
      MixinFiles,
      MixinIndex,
      MixinData,
    ],
    props: {
      messages: {
        type: [Array, Object],
        default () {
          return []
        },
      },

      isTopicPanel: Boolean,
      isReplyMessage: Boolean,
      isEditMessage: Boolean,
      isChoiceMessage: Boolean,
      isForwardMessage: Boolean,
      isTopicMessage: Boolean,

      choiceMessageIds: {
        type: Array,
        default () {
          return []
        },
      },
      replyMessageId: {
        type: [String, Number],
        default: '',
      },
      editMessageId: {
        type: [String, Number],
        default: '',
      },
    },
    data () {
      return {
        // recorder
        attempts: 5,
        recorder: this._initRecorder(),
        recordList: [],
        recordVolumes: [],
        recordPlay: {},
        recordPlayCurrentTime: 0,
        // recorder boolean
        isStop: false,
        isPlay: false,
        // record strip
        recordStripCount: 100,
        recordStripMaxHeight: 21,
        recordStripMinHeight: 4,
        // other
        selected: {},
        topicFilter: false,
        messagesCount: 0,
        sending: false,
        message: '',
        // reply
        internalIsReplyMessage: this.isReplyMessage,
        // edit
        internalIsEditMessage: this.isEditMessage,
        editMessageTextOld: '',
        // choice
        internalIsChoiceMessage: this.isChoiceMessage,
        internalChoiceMessageIds: this.choiceMessageIds,
        // topic
        internalIsTopicPanel: this.isTopicPanel,
        internalIsTopicMessage: this.isTopicMessage,
        // typing
        typingTime: null,
        // files
        attachedFile: {},
      }
    },
    computed: {
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      profile () {
        return this.$store.getters.user
      },
      currentConversationId () {
        return this.$store.getters['chat/conversation/currentConversationId']
      },
      employees () {
        return this.$store.getters['chat/data/employees'](this.currentConversationId)
      },
      members () {
        return this.$store.getters['chat/data/members'](this.currentConversationId)
      },
      conversation () {
        return this.$store.getters['chat/data/conversation'](this.currentConversationId)
      },
      conversationProgram () {
        return this.$store.getters['chat/data/conversationProgram'](this.currentConversationId)
      },
      realChatName () {
        return this.$store.getters['chat/data/realChatName'](this.currentConversationId)
      },
    },
    watch: {
      async message (v) {
        this.limitTextArea()
        if (!v || !v.length) {
          this.setTemplateMessage('')
        }
        await this.sendTypingEvent(this.currentConversationId)
      },
      isReplyMessage (v) {
        this.internalIsReplyMessage = v
      },
      isEditMessage (v) {
        this.internalIsEditMessage = v
      },
      isChoiceMessage (v) {
        this.internalIsChoiceMessage = v
      },
      isTopicMessage (v) {
        this.internalIsTopicMessage = v
      },
      isTopicPanel (v) {
        this.internalIsTopicPanel = v
      },
      internalIsReplyMessage (v) {
        if (v && this.isRecording) {
          this.internalIsEditMessage = false
          this.internalIsChoiceMessage = false
          this.internalIsTopicMessage = false
          this.$emit('update:isReplyMessage', false)
          return
        }

        if (v) {
          this.internalIsEditMessage = false
          this.internalIsChoiceMessage = false
          this.internalIsTopicMessage = false
        }
        this.$emit('update:isReplyMessage', v)
      },
      async internalIsEditMessage (v) {
        if (v && this.isRecording) {
          this.internalIsReplyMessage = false
          this.internalIsChoiceMessage = false
          this.internalIsTopicMessage = false
          this.$emit('update:isEditMessage', false)
          return
        }

        this.$emit('update:isEditMessage', v)
        if (v) {
          this.internalIsReplyMessage = false
          this.internalIsChoiceMessage = false
          this.internalIsTopicMessage = false

          if (this.$refs?.recordStop) {
            this.$refs.recordStop.cancelRecorder()
            await this.$nextTick()
          }

          if (
            this.chatUser.id === this.messages[this.editMessageId].sender_id &&
            (this.profile.id === this.messages[this.editMessageId].real_sender_id ||
              !this.realChatName)
          ) {
            this.message = this.messages[this.editMessageId].message
            this.editMessageTextOld = this.messages[this.editMessageId].message
          } else {
            this.message = ''
            this.internalIsEditMessage = false
          }
        } else {
          this.message = ''
        }
      },
      internalIsChoiceMessage (v) {
        if (v && this.isRecording) {
          this.internalIsEditMessage = false
          this.internalIsReplyMessage = false
          this.internalIsTopicMessage = false
          this.$emit('update:isChoiceMessage', false)
          return
        }

        if (v) {
          this.internalIsEditMessage = false
          this.internalIsReplyMessage = false
          this.internalIsTopicMessage = false
        }

        if (!v) {
          this.internalChoiceMessageIds = []
        }

        this.$emit('update:isChoiceMessage', v)
      },
      internalIsTopicMessage (v) {
        if (v && this.isRecording) {
          this.internalIsEditMessage = false
          this.internalIsReplyMessage = false
          this.internalIsChoiceMessage = false
          this.$emit('update:isTopicMessage', false)
          return
        }

        if (v) {
          this.internalIsEditMessage = false
          this.internalIsReplyMessage = false
          this.internalIsChoiceMessage = false
        }

        if (!v) {
          this.internalSelectedTopic = {}
        }

        this.$emit('update:isTopicMessage', v)
      },
      internalChoiceMessageIds (v) {
        this.$emit('update:choiceMessageIds', v)
      },
      internalIsTopicPanel (v) {
        this.$emit('update:isTopicPanel', v)
      },
      currentConversationId (v) {
        this.message = this.conversation.currentTemplateMessage
      },
    },
    mounted () {},
    methods: {
      toogleTopic () {
        this.internalIsTopicMessage = !this.internalIsTopicMessage
      },
      setTemplateMessage (message) {
        this.$store.commit(
          'chat/conversation/setCurrentConversationMessage',
          message,
        )
      },
    },
  }
</script>
