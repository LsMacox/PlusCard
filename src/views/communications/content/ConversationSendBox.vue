<template>
  <div class="app-conversation-send-box">
    <div
      v-cloak
      id="conversationDrop"
      class="app--conversation--drop--wrap"
      @drop.prevent="addFile"
      @dragover.prevent
      @dragleave="moveOut"
    >
      Перетащите сюда фотографии, чтобы отправить их
    </div>
    <div
      class="app--conversation--sendForm"
    >
      <app-reply
        v-if="internalIsReplyMessage && !internalIsEditMessage"
        :conversation-id="currentConversationId"
        :is-reply-message.sync="internalIsReplyMessage"
        :message="messages[replyMessageId]"
      />

      <app-edit
        v-if="internalIsEditMessage"
        :conversation-id="currentConversationId"
        :is-edit-message.sync="internalIsEditMessage"
        :message="messages[editMessageId]"
      />

      <div
        class="app--conversation--sendField"
        :class="[
          internalIsReplyMessage ? 'reply' :
          internalIsEditMessage ? 'edit' :
          message && message.length ? 'writes' : ''
        ]"
      >
        <div
          id="messageWrapper"
        >
          <v-row
            no-gutters
            style="height: 100%"
          >
            <!-- ==== record ==== -->
            <app-record-start
              v-if="isRecording"
              :conversation-id="currentConversationId"
              :is-recording="isRecording"
              :is-play.sync="isPlay"
              :is-stop.sync="isStop"
              :record-strip-count="recordStripCount"
              :record-strip-max-height="recordStripMaxHeight"
              :record-list.sync="recordList"
              :record-volumes.sync="recordVolumes"
              :record-play.sync="recordPlay"
              :record-play-current-time.sync="recordPlayCurrentTime"
              :recorder="recorder"
            />
            <!-- ==== record stop ==== -->
            <app-record-stop
              v-if="!isRecording && isStop && recordList.length"
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
            <!-- ==== text ==== -->
            <div
              v-if="!isRecording && !isStop"
              class="app-conversation--sendForm__message__text"
              :class="[message && message.length ? 'writes' : '']"
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
                  id="file"
                  ref="attachFile"
                  type="file"
                  class="input-file"
                  multiple
                  :disabled="!validateAttachment"
                  @change="validateFile()"
                >
              </div>
              <iconify-icon
                v-else
                class="icon icon-close"
                icon="ion-close-circle-outline"
                width="21"
                @click="clearMessage"
              />
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
                @change="changeCurrent"
                @keyup.ctrl.enter="addLine($event)"
                @keypress.enter.exact.stop="send"
              />
              <div class="left-block">
                <!-- Hash Icon -->
                <iconify-icon
                  class="icon icon-hash"
                  icon="feather-hash"
                  width="21"
                />
                <!-- Smile Icon -->
                <iconify-icon
                  class="icon icon-smile"
                  icon="feather-smile"
                  width="21"
                />
                <!-- Microphone Icon -->
                <iconify-icon
                  v-if="!message || !message.length"
                  id="record"
                  class="icon icon-mic"
                  icon="feather-mic"
                  width="21"
                  @click="toggleRecorder($event)"
                />
                <!-- Send Icon -->
                <iconify-icon
                  v-if="message && message.length"
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
  import AppRecordStop from './components/sendbox/RecordStop'
  import AppRecordStart from './components/sendbox/RecordStart'

  // mixins
  import MixinAttachment from '../mixins/conversation-send-box/attachment.js'
  import MixinValidate from '../mixins/conversation-send-box/validate.js'
  import MixinRecorder from '../mixins/conversation-send-box/recorder.js'
  import MixinMessage from '../mixins/conversation-send-box/message.js'
  import MixinTyping from '../mixins/conversation-send-box/typing.js'
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-send-box/data.js'

  export default {
    components: {
      AppEdit,
      AppReply,
      AppRecordStop,
      AppRecordStart,
    },
    mixins: [
      MixinAttachment,
      MixinValidate,
      MixinRecorder,
      MixinMessage,
      MixinTyping,
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

      isReplyMessage: Boolean,
      isEditMessage: Boolean,

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
        cursorIn: false,
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
        //
        selected: {},
        topicFilter: false,
        messagesCount: 0,
        //
        dialogMessageDelete: false,
        // reply
        internalIsReplyMessage: this.isReplyMessage,
        // edit
        internalIsEditMessage: this.isEditMessage,
        editMessageTextOld: '',
        overlayChat: false,
        //
        updatedMessageId: null,
        deletedMessageId: null,
        sending: false,
        messageMenu: false,
        posX: 0,
        posY: 0,
        //
        typingTime: null,
        message: '',
        attachFileName: null,
        attachFileType: null,
        attachFile: null,
        attachLoading: false,
        attachPreview: false,
        files: [],
        formDataFiles: [],
        filesPreview: [],
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
        if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.chat_members || []
        return []
      },
      members () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.members || []
        return []
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.currentConversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      conversationProgram () {
        if (!this.isEmptyObject(this.conversation)) {
          return this.conversation.program
        }
        return {}
      },
      realChatName () {
        if (!this.isEmptyObject(this.conversationProgram)) {
          return this.conversationProgram.real_chat_name
        }
        return false
      },
    },
    watch: {
      async message (v) {
        this.limitTextArea()
        this.sendTypingEvent(this.currentConversationId)
      },
      isReplyMessage (v) {
        this.internalIsReplyMessage = v
      },
      isEditMessage (v) {
        this.internalIsEditMessage = v
      },
      internalIsReplyMessage (v) {
        this.$emit('update:isReplyMessage', v)
        if (v) this.internalIsEditMessage = false
      },
      internalIsEditMessage (v) {
        this.$emit('update:isEditMessage', v)
        if (v) {
          this.internalIsReplyMessage = false
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
      selectedTopicId (v) {
        if (!v) this.topicFilter = false
      },
      currentConversationId (v) {
        this.message = this.conversation.currentTemplateMessage
        if (this.overlayChat) {
          const elem = this.$refs.conversationField
          if (elem) elem.scrollTop = elem.scrollHeight
          this.overlayChat = false
          this.internalIsReplyMessage = true
        }
      },
    },
    mounted () {
      document
        .getElementById('conversationWrap')
        .addEventListener('dragover', function () {
          document.getElementById('conversationDrop').style.width =
            document.getElementById('conversationWrap').offsetWidth + 'px'
          document.getElementById('conversationDrop').style.display = 'block'
        })
      this.init()
    },
    methods: {
      changeCurrent () {
        this.$store.commit(
          'chat/conversation/setCurrentConversationMessage',
          this.message,
        )
      },
      methodsNotAvailable () {
        this.$notify({
          message:
            'В данный момент ведутся технические работы связанные с этим функционалом',
          type: 'warning',
        })
      },
      moveOut () {
        document.getElementById('conversationDrop').style.display = 'none'
      },
      addFile (e) {
        const droppedFiles = e.dataTransfer.files
        if (droppedFiles) {
          this.moveOut()
          this.$refs.attachFile.files = droppedFiles
          this.validateFile()
        }
      },
      init () {
        var observe
        if (window.attachEvent) {
          observe = function (element, event, handler) {
            element.attachEvent('on' + event, handler)
          }
        } else {
          observe = function (element, event, handler) {
            element.addEventListener(event, handler, false)
          }
        }
        var text = document.getElementById('message')
        if (!text) return

        const resize = () => {
          text.style.height = 'auto'
          text.style.height = text.scrollHeight + 'px'
          this.$emit('send-message')
        }

        /* 0-timeout to get the already changed text */
        function delayedResize () {
          window.setTimeout(resize, 0)
        }

        observe(text, 'cut', delayedResize)
        observe(text, 'paste', delayedResize)
        observe(text, 'drop', delayedResize)

        text.focus()
        text.select()
        resize()
      },
    },
  }
</script>
