<template>
  <div class="app-conversation-send-box">
    <div
      class="app--conversation--sendForm"
    >
      <app-topic
        v-if="isTopic"
        :conversation-id="currentConversationId"
        :is-topic-panel.sync="internalIsTopicPanel"
      />

      <app-reply
        v-if="isReply"
        :conversation-id="currentConversationId"
        :msg-item="messages[replyMessageId]"
      />

      <app-edit
        v-if="isEdit"
        :conversation-id="currentConversationId"
        :msg-item="messages[editMessageId]"
      />

      <div
        class="app--conversation--sendField"
        :class="[
          isReply ? 'reply' :
          isEdit ? 'edit' :
          isTopic ? 'topic' :
          (messageText && messageText.length) ? 'writes' :
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
              v-if="isChoice && choiceMessageIds.length > 0"
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
              v-if="!isRecording && !isStop && !(isChoice && choiceMessageIds.length)"
              class="app-conversation--sendForm__message__text"
              :class="[(messageText && messageText.length) ? 'writes' : '']"
            >
              <!-- Attach -->
              <div
                v-if="!messageText || !messageText.length"
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
                  @change="setTemplateMessage(messageText)"
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
                  v-if="(!messageText || !messageText.length) && !isAttachedFile"
                  id="record"
                  class="icon icon-mic"
                  icon="feather-mic"
                  width="21"
                  @click="toggleRecorder"
                />
                <!-- Send Icon -->
                <iconify-icon
                  v-if="(messageText && messageText.length) || isAttachedFile"
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
        message: '',
        messagesCount: 0,
        sending: false,
        // typing
        typingTime: null,
        // topic
        internalIsTopicPanel: this.isTopicPanel,
      }
    },
    watch: {
      async message (v) {
        this.limitTextArea()
        if (!v || !v.length) {
          this.setTemplateMessage('')
        }
        this.$store.commit('chat/sendbox/messageText', v)
        await this.sendTypingEvent(this.currentConversationId)
      },
      isRecording (v) {
        if (v) {
          this.$store.commit('chat/sendbox/clearAllModesBoolExceptCurrent', ['isReply'])
        }
      },
      async isEdit (v) {
        if (v) {
          this.$store.commit('chat/sendbox/clearAllModesBoolExceptCurrent', 'isEdit')
        } else {
          this.message = ''
        }
      },
      editMessageId (v) {
        if (v && !isNaN(v)) {
          this.$store.commit('chat/sendbox/editMessageTextOld', this.messages[this.editMessageId].message)
          this.message = this.messages[this.editMessageId].message
        }
      },
      isReply (v) {
        if (v) {
          this.$store.commit('chat/sendbox/clearAllModesBoolExceptCurrent', 'isReply')
        }
      },
      isChoice (v) {
        if (v) {
          this.$store.commit('chat/sendbox/clearAllModesBoolExceptCurrent', 'isChoice')
        }
      },
      isTopic (v) {
        if (v) {
          this.$store.commit('chat/sendbox/clearAllModesBoolExceptCurrent', 'isTopic')
        }
      },
      isTopicPanel (v) {
        this.internalIsTopicPanel = v
      },
      internalIsTopicPanel (v) {
        this.$emit('update:isTopicPanel', v)
      },
      currentConversationId (v) {
        if (this.conversation && Object.keys(this.conversation).includes('currentTemplateMessage')) {
          this.message = this.conversation.currentTemplateMessage
        }
      },
    },
    methods: {
      toogleTopic () {
        this.$store.commit('chat/sendbox/isTopic', !this.isTopic)
      },
      setTemplateMessage (messageText) {
        this.$store.commit(
          'chat/conversation/setCurrentConversationMessage',
          messageText,
        )
      },
    },
  }
</script>
