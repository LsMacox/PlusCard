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
  // components
  // import AppTopicBar from './topic/TopicBar'
  // import AppReply from './components/Reply'

  // utils
  import Recorder from '@/utils/recorder'
  import { convertTimeMMSS } from '@/utils'

  export default {
    components: {
      //   ConversationStatusBar,
      // AppReply,
      // AppTopicBar,
    },
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

    computed: {
      attemptsLeft () {
        return this.attempts - this.recordList.length
      },
      isPause () {
        return this.recorder.isPause
      },
      isRecording () {
        return this.recorder.isRecording
      },
      recordedTime () {
        if (this.time && this.recorder.duration >= this.time * 60) {
          this.stopRecorder()
        }
        return convertTimeMMSS(this.recorder.duration)
      },
      volume () {
        return parseFloat(this.recorder.volume)
      },
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      profile () {
        return this.$store.getters.user
      },
      programId () {
        return this.$store.getters['brand/program/programId']
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.conversationId)

        return conversation[0] || null
      },
      selectedTopicId () {
        return this.$store.getters['chat/topic/selectedTopicId']
      },
      recipients () {
        return this.$store.getters['chat/`message/recipients']
      },
      validateSendMessage () {
        if (
          this.$store.getters['chat/message/messages'] &&
          this.$store.getters['chat/message/messages'][this.conversationId]
        ) {
          // проверка на строку из пробелов и вложения
          if (
            /\S/.test(this.message) ||
            this.files.length ||
            this.message.trim() !== '' ||
            this.message.replace('\n', '').trim() !== '' ||
            (this.quotedMessage && this.quotedMessage.id)
          ) {
            return true
          }
        }
        this.clearForm()
        return false
      },
      validateAttachment () {
        if (
          typeof this.$store.getters['chat/message/messages'][
            this.conversationId
          ] !== 'undefined'
        ) { return true }
        return false
      },
      // recorder
      recordDuration () {
        return this.recorder.duration - this.tsNow(true) - this.startTime
      },
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

      micFailed () {
        this.recorder.isRecording = false
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
      async sendRecord () {
        const type = 'send'
        const message = new FormData()
        message.append('files[0]', this.recordList[0].blob)
        message.set('conversation_id', this.conversationId)
        await this.$store.dispatch('chat/message/send', { type, message })
        this.cancelRecorder()
      },
      stopRecord () {
        this.stopRecorder()
        this.getRecorderStrip()
        this.eventRecordPlayEnded()
        this.eventRecordPlayTimeUpdate()
      },
      getRecorderStrip () {
        const takeCount = Math.floor(this.recordVolumes.length / this.recordStripCount)
        const allTakenCount = (this.recordStripCount * takeCount)
        this._prepareRecordVolumes(allTakenCount, takeCount)
      },
      cancelRecorder () {
        this.stopRecorder()
        this.deleteRecord()
        this.isStop = false
        this.startTime = 0
        this.recordPlay = {}
        this.recordPlayCurrentTime = 0
        this.removeRecordStrip()
      },
      toggleRecorder (e) {
        e.preventDefault()
        e.stopPropagation()
        if (this.attempts && this.recorder.records.length >= this.attempts) {
          return
        }
        if (!this.isRecording || (this.isRecording && this.isPause)) {
          this.recorder.start()
        } else {
          this.recorder.pause()
        }
      },
      removeRecordStrip () {
        this.recordVolumes = []
      },
      switchPlayBackRecording () {
        this.isPlay = !this.isPlay
        if (!this.isPlay) {
          this.recordPlay.pause()
        } else {
          this.recordPlay.play()
        }
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }
        this.isStop = true
        this.recorder.stop()
        this.recordList = this.recorder.recordList()
        this.recordPlay = new window.Audio()
        this.recordPlay.src = this.recordList[0].url
      },
      deleteRecord () {
        this.recordList.splice(0, 1)
      },
      removeRecord (idx) {
        this.recordList.splice(idx, 1)
        this.$set(this.selected, 'url', null)
        this.$eventBus.$emit('remove-record')
      },
      choiceRecord (record) {
        if (this.selected === record) {
          return
        }
        this.selected = record
        this.selectRecord && this.selectRecord(record)
      },
      eventRecordPlayEnded () {
        this.recordPlay.onended = () => {
          if (this.isPlay) this.isPlay = false
        }
      },
      eventRecordPlayTimeUpdate () {
        this.recordPlay.ontimeupdate = () => {
          this.recordPlayCurrentTime = this.recordPlay.currentTime
        }
      },
      isRecordStripActive (idx) {
        const duration = (this.recordPlay.duration * 1000)
        const part = (duration / this.recordStripCount)
        return (part * idx) <= (this.recordPlayCurrentTime * 1000)
      },
      _initRecorder () {
        return new Recorder({
          beforeRecording: this.beforeRecording,
          afterRecording: this.afterRecording,
          pauseRecording: this.pauseRecording,
          micFailed: this.micFailed,
          bitRate: 128,
          sampleRate: 44100,
          format: 'mp3',
        })
      },
      _prepareRecordVolumes (allTakenCount, takeCount) {
        if (takeCount > 0) {
          const awayCount = (allTakenCount > this.recordVolumes.length)
            ? (allTakenCount - this.recordVolumes.length)
            : (this.recordVolumes.length - allTakenCount)

          const startPos = Math.floor(this.recordVolumes.length / 2)
          this.recordVolumes.splice(startPos, awayCount)

          this.recordVolumes = this.recordVolumes.filter((volume, i) => {
            return (i % takeCount) === 0
          }, takeCount)
        } else {
          this._addMinStripCountRecordVolumes()
        }
      },
      _addMinStripCountRecordVolumes () {
        const addCount = (this.recordStripCount - this.recordVolumes.length)
        const fillArr = new Array(addCount).fill(this.recordStripMinHeight)
        this.recordVolumes.unshift(...fillArr)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ФИЛЬТР ТЕМЫ
       */

      setTopicFilter () {
        this.topicFilter = !this.topicFilter
      },
      classTopicFilter () {
        if (this.topicFilter) { return 'topic-filter-btn-ball topic-filter-btn-ball-active' }
        return 'topic-filter-btn-ball'
      },

      /*
       * ФОРМА ОТПРАВКИ
       */

      getEraseClass () {
        if (this.validateSendMessage) { return 'send-block-erase send-block-erase-active' }
        return 'send-block-erase'
      },
      getSendingClass () {
        if (this.validateSendMessage) { return 'dialog-send-sending dialog-send-sending-active' }
        return 'dialog-send-sending'
      },

      /*
       * СОБЫТИЯ КЛАВИАТУРЫ И TYPING
       */
      addLine (e) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.message.replace(/^\s+/, '').length) return

        this.message = this.message + '\n'
        this.$emit('send-message')
      },
      messageEvent (conversationId, $event) {
        // ctrl + enter новая строка
        if ($event.ctrlKey === true && $event.code === 'Enter') {
          this.message = this.message + '\n'
        }
        if ($event.ctrlKey === true && $event.code === 'NumpadEnter') {
          this.message = this.message + '\n'
        }
        // enter отправка сообщения
        if ($event.ctrlKey === false && $event.code === 'Enter') {
          if (!this.sending) this.send(this.sendType)
        }
        if ($event.ctrlKey === false && $event.code === 'NumpadEnter') {
          if (!this.sending) this.send(this.sendType)
        }

        var text = document.getElementById('message')
        if (text) {
          text.style.height = 'auto'
          text.style.height = text.scrollHeight + 'px'
        }

        this.$emit('send-message')
      },
      sendTypingEvent (conversationId) {
        const currentTime = new Date().getTime()

        if (currentTime - this.typingTime > 1000) {
          // сообщение валидно
          if (this.validateSendMessage) {
            this.typingTime = currentTime
            this.$store.dispatch('chat/message/typing', conversationId)
          }
        }
      },
      clearMessage () {
        this.message = ''
      },
      handleResizeHeightTextArea () {
        const chat = document.getElementById('conversationWrap')
        const chatHeader = document.querySelector('.app--conversation--header')
        const textArea = this.$refs.messageTextArea.$el.querySelector('textarea')
        const maxHeight = (Math.round(chat.clientHeight / 2) - Math.round(chatHeader.offsetHeight) - 50)

        if (textArea.clientHeight > maxHeight) {
          console.log('add')
          textArea.style.maxHeight = textArea.clientHeight + 'px'
          textArea.style.overflowY = 'scroll'
          textArea.scrollTop = textArea.scrollHeight
        } else {
          textArea.style.maxHeight = 'inherit'
          textArea.style.overflowY = 'hidden'
        }
      },

      /*
       * ВЛОЖЕНИЯ
       */

      validateFile () {
        for (let i = 0; i < this.$refs.attachFile.files.length; i++) {
          const attachFile = this.$refs.attachFile.files[i]
          if (attachFile) {
            if (attachFile.size > 30720000) {
              this.$refs.attachFile.type = 'text'
              this.$refs.attachFile.type = 'file'
              this.$notify({
                message: 'Размер файла превышает 30 МБ',
                type: 'error',
              })
            }
            this.previewAttachFile(attachFile, i)
          /*
                            if (attachFile.type == 'image/png' || attachFile.type == 'image/jpeg') {

                            } else {
                                this.$refs.attachFile.value = null
                            }
                            */
          }
        }
        this.$refs.attachFile.type = 'text'
        this.$refs.attachFile.type = 'file'
      },
      readPreview (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = () => {
          /// /console.log(reader.error);
          }
          reader.readAsDataURL(file)
        })
      },
      readFile (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = () => {
          /// /console.log(reader.error);
          }
          reader.readAsBinaryString(file)
        })
      },
      getThumb (file) {
        if (file.type.match('image')) {
          return new Promise(function (resolve, reject) {
            var reader = new FileReader()

            reader.onload = function () {
              resolve(reader.result)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        } else if (file.type.match('video')) {
          return new Promise(function (resolve, reject) {
            var fileReader = new FileReader()

            fileReader.onload = function () {
              var blob = new Blob([fileReader.result], { type: file.type })
              var url = URL.createObjectURL(blob)
              var video = document.createElement('video')
              var timeupdate = function () {
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate)
                  video.pause()
                }
              }
              video.addEventListener('loadeddata', function () {
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate)
                }
              })
              var snapImage = () => {
                var canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                canvas
                  .getContext('2d')
                  .drawImage(video, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL())
              }
              video.addEventListener('timeupdate', timeupdate)
              video.preload = 'metadata'
              video.src = url
              // Load video in Safari / IE11
              video.muted = true
              video.playsInline = true
              video.play()
            }
            fileReader.onerror = reject
            fileReader.readAsArrayBuffer(file)
          })
        } else {
          return new Promise(function (resolve, reject) {
            resolve('/img/fileThumb.png')
          })
        }
      },
      async previewAttachFile (file, i) {
        this.attachLoading = true
        this.attachFileName = file.name
        this.attachFileType = file.type
        const binary = await this.readFile(file)
        this.attachFile = btoa(binary)
        const thumb = await this.getThumb(file)
        const attach = {
          name: this.attachFileName,
          mime: this.attachFileType,
          data: this.attachFile,
          original: file,
          thumb: thumb,
        }
        if (this.files.length < 10) {
          this.files.push(attach)
          this.formDataFiles.push(file)
        } else {
          this.$notify({
            message: 'Достигнуто предельное количество вложений',
            type: 'error',
          })
        }
        this.attachLoading = false
      },
      // предпросмотр вложений
      showAttachments () {
        if (this.files.length) this.attachPreview = true
      },
      hideAttachments () {
        this.attachPreview = false
      },
      showAttachmentDelete (index) {
        this.$refs.attachmentPreview[index].style.display = 'block'
      },
      hideAttachmentDelete (index) {
        this.$refs.attachmentPreview[index].style.display = 'none'
      },
      attachmentDelete (index) {
        this.files.splice(index, 1)
        this.formDataFiles.splice(index, 1)
        if (!this.files.length) this.attachPreview = false
      },

      /*
       * ДИАЛОГИ СООБЩЕНИЙ
       */
      closeReplyMessage () {
        this.$emit('update:quotedMessage', Object.assign({}))
        this.$emit('update:quotedMessageSender', null)
        this.$emit('update:sendType', 'send')
        this.$emit('update:dialogReplyMessage', false)
        if (this.overlayChat) {
          const elem = this.$refs.conversationField
          if (elem) elem.scrollTop = elem.scrollHeight
          this.overlayChat = false
        }
      },
      clearForm () {
        this.message = ''
        this.attachFileName = null
        this.attachFileType = null
        this.attachFilePreview = null
        this.formDataFiles = []
        this.attachFile = null
        this.files = []
        // this.$refs.attachFile.type = 'text'
        // this.$refs.attachFile.type = 'file'
        this.$emit('update:quotedMessage', Object.assign({}))
        this.$emit('update:quotedMessageSender', null)
        this.$emit('update:sendType', 'send')
        this.$emit('update:dialogReplyMessage', false)
        this.$store.commit('chat/topic/selectedTopicId', null)
        this.$store.commit('chat/message/recipients', [])
        this.$emit('send-message')
        this.$store.commit('chat/conversation/setCurrentConversationMessage', '')
        document.getElementById('message').style.height = 60 + 'px'
      },
      // отправляем сообщение
      async send (type) {
        if (this.sending) return
        /// /console.log('quotedMessage', this.quotedMessage);
        console.log({
          quotedMessage: this.quotedMessage,
          selectedTopicId: this.selectedTopicId,
          message: this.message,
          recipients: this.recipients,
          formDataFiles: this.formDataFiles,
        })
        if (this.validateSendMessage) {
          /// /console.log('topic', this.selectedTopicId);
          try {
            this.sending = true
            const message = new FormData()
            message.set('conversation_id', this.conversationId)
            // message.append('conversation_id', +this.conversationId);
            // message.append('conversation_id', parseInt(this.conversationId));

            if (this.quotedMessage && this.quotedMessage.id) {
              message.set('message_id', this.quotedMessage.id)
            }
            if (this.selectedTopicId) { message.append('topic_id', this.selectedTopicId) }
            if (this.message) message.set('message', this.message)
            let recipients = []
            recipients = Array.from(new Set(this.recipients))

            // отправка файлов

            if (Array.isArray(this.formDataFiles)) {
              for (let i = 0; i < this.formDataFiles.length; i++) {
                const file = this.formDataFiles[i]
                message.append('files[' + i + ']', file)
              }
            }

            // получатели
            for (let i = 0; i < recipients.length; i++) {
              const recipient = recipients[i]
              message.append('recipients[' + i + ']', recipient)
            }

            /*
                        const message = {
                            conversation_id: this.conversationId,
                            type: type,
                            message_id: this.quotedMessage ? this.quotedMessage.id : null,
                            message: this.message,
                            media: this.files,
                            topic_id: this.selectedTopicId,
                            recipients: Array.from(new Set(this.recipients)),
                        };
                        */
            /// /console.log(message)
            await this.$store.dispatch('chat/message/send', { type, message })
          } catch (e) {
            console.error('send', e)
          } finally {
            this.sending = false
            this.clearForm()
          }
        }

        this.textAreaFocus()
      },
      textAreaFocus () {
        setTimeout(() => {
          this.$refs.messageTextArea.$el.querySelector('textarea').focus()
        }, 0)
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
      async getMedia () {
        try {
          const stream = await navigator.mediaDevices.getUserMedia()
          console.log('stream', stream)
        /* use the stream */
        } catch (err) {
        /* handle the error */
        }
      },
    },
  }
</script>
