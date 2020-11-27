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
      <!-- <app-reply
        :dialog.sync="dialogReplyMessage"
        :name.sync="quotedMessageSender"
        :message.sync="quotedMessage"
      /> -->

      <!-- <app-topic-bar :conversation-id="conversationId" /> -->

      <div
        class="app--conversation--sendField"
      >
        <div
          id="messageWrapper"
        >
          <v-row
            no-gutters
            style="height: 100%"
          >
            <!-- ==== record ==== -->
            <div
              v-if="isRecording"
              class="app-conversation--sendForm__message__record"
            >
              <div class="record-time">
                <p class="body-m-regular neutral-600--text">
                  {{ recordedTime }}
                </p>
              </div>
              <div class="left-block">
                <v-btn
                  class="record-cancel"
                  color="primary-100"
                  @click="cancelRecorder()"
                >
                  <iconify-icon
                    class="icon-close"
                    icon="jam-close"
                    width="21"
                  />
                </v-btn>
                <v-btn
                  class="record-stop"
                  color="error"
                  @click="stopRecord()"
                >
                  <div
                    class="stop-overlay"
                    :style="`width: calc(130px + ${Math.round(volume * 60)}px);
                               height: calc(130px + ${Math.round(volume * 60)}px);`"
                  />
                  <iconify-icon
                    class="icon-stop"
                    icon="carbon-stop"
                    width="21"
                  />
                </v-btn>
              </div>
            </div>
            <!-- ==== record stop ==== -->
            <div
              v-if="!isRecording && isStop"
              class="app-conversation--sendForm__message__record-stop"
            >
              <div class="right-block">
                <iconify-icon
                  v-if="!isPlay"
                  class="icon icon-play"
                  icon="feather-play"
                  width="21"
                  @click="switchPlayBackRecording"
                />
                <iconify-icon
                  v-else
                  class="icon icon-play"
                  icon="ion-pause-outline"
                  width="21"
                  @click="switchPlayBackRecording"
                />
                <div class="strips">
                  <div
                    v-for="(v, i) in recordVolumes"
                    :key="i"
                    class="strip"
                    :class="[isRecordStripActive(i) ? 'active' : '']"
                    :style="`height: ${v}px`"
                  />
                </div>
                <div class="durations">
                  <p class="body-m-regular neutral-600--text">
                    {{ this.$moment(recordPlayCurrentTime * 1000).format('mm:ss') }}/{{ recordList[0].duration }}
                  </p>
                </div>
              </div>
              <div class="left-block">
                <iconify-icon
                  class="icon icon-trash"
                  icon="feather-trash"
                  width="21"
                  @click="cancelRecorder"
                />
                <iconify-icon
                  class="icon icon-send"
                  icon="feather-send"
                  width="21"
                  @click="sendRecord"
                />
              </div>
            </div>
            <!-- ==== text ==== -->
            <div
              v-if="!isRecording && !isStop"
              class="app-conversation--sendForm__message__text"
              :class="[message.length ? 'writes' : '']"
            >
              <!-- Attach -->
              <div
                v-if="!message.length"
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
                id="message"
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
                @keypress.enter.exact.stop="send(sendType)"
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
                  v-if="!message.length"
                  id="record"
                  class="icon icon-mic"
                  icon="feather-mic"
                  width="21"
                  @click="toggleRecorder($event)"
                />
                <!-- Send Icon -->
                <iconify-icon
                  v-if="message.length"
                  class="icon icon-send"
                  icon="feather-send"
                  width="21"
                  @click="send(sendType)"
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

  // mixins
  import MixinAttachment from '../mixins/conversation-send-box/attachment.js'
  import MixinValidate from '../mixins/conversation-send-box/validate.js'
  import MixinRecorder from '../mixins/conversation-send-box/recorder.js'
  import MixinMessage from '../mixins/conversation-send-box/message.js'
  import MixinTyping from '../mixins/conversation-send-box/typing.js'
  import MixixIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-send-box/data.js'

  export default {
    mixins: [
      MixinAttachment,
      MixinValidate,
      MixinRecorder,
      MixinMessage,
      MixinTyping,
      MixixIndex,
      MixinData,
    ],
    props: {
      conversationId: {
        required: true,
        type: [String, Number],
      },
      dialogReplyMessage: Boolean,
      quotedMessage: {
        type: Object,
        default: null,
      },
      quotedMessageSender: {
        type: String,
        default: '',
      },
      sendType: {
        type: String,
        default: 'send',
      },
    },
    data () {
      return {
        startTime: 0,
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
        dialogMessageUpdate: false,
        dialogMessageDelete: false,
        // reply
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
    watch: {
      volume (v) {
        let newVolume = Math.round(v * this.recordStripMaxHeight)
        newVolume = (newVolume < this.recordStripMinHeight)
          ? this.recordStripMinHeight
          : newVolume
        this.recordVolumes.push(newVolume)
      },
      isRecording (v) {
      /// /console.log('records', this.recordList);
      },
      async message (v) {
        this.sendTypingEvent(this.conversationId)
        await this.$nextTick()
        this.handleResizeHeightTextArea()
      },
      selectedTopicId (v) {
        if (!v) this.topicFilter = false
      },
      conversationId (v) {
        // console.log('current', this.conversation);
        this.message = this.conversation.currentTemplateMessage
        if (this.dialogReplyMessage) {
          this.closeReplyMessage()
        }
        if (this.overlayChat) {
          const elem = this.$refs.conversationField
          if (elem) elem.scrollTop = elem.scrollHeight
          this.overlayChat = false
          this.dialogReplyMessage = true
          this.sendType = 'forward'
        }
      },
      dialogReplyMessage (v) {
        if (!v) this.closeReplyMessage()
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
