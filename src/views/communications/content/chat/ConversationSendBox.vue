<template>
  <div>
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
      style="display:flex; flex-direction: column; position:relative;"
    >
      <app-reply
        :dialog.sync="dialogReplyMessage"
        :name.sync="quotedMessageSender"
        :message.sync="quotedMessage"
      />

      <app-topic-bar :conversation-id="conversationId" />

      <div
        class="app--conversation--sendForm"
        style="display:flex; flex-direction: column;"
      >
        <div class="app--conversation--sendForm">
          <div
            style="display: flex;align-self: flex-start;justify-content: center;align-items: center;margin-top: 25px;"
          >
            <div
              class="app--conversation--sendForm__button app--conversation--sendForm__button__recipient"
              style="display: none;"
              @click="methodsNotAvailable()"
            >
              Получатели
            </div>
            <div
              class="app--conversation--sendForm__button app--conversation--sendForm__button__theme"
              style="display: none;"
              @click="methodsNotAvailable()"
            >
              Темы
            </div>

            <div
              class="app--conversation--sendForm__button app--conversation--sendForm__button__attach"
              @click="$refs.attachFile.click()"
            >
              <img
                src="@/assets/chat/attachment.svg"
                alt
              >
            </div>
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
          <div style="display:flex; width:100%;">
            <div
              id="messageWrapper"
              style="position:relative; width:95%;"
            >
              <v-row no-gutters>
                <div
                  v-if="isRecording"
                  class="app--conversation--sendForm__recorder__wrapper"
                >
                  <div class="app--conversation--sendForm__recorder__indicator">
                    <i />
                  </div>
                  <div class="app--conversation--sendForm__recorder__timer">
                    {{ recordedTime }}
                  </div>
                </div>
                <span
                  class="app--conversation--sendForm__message__button app--conversation--sendForm__message__button__microphone"
                >
                  <img
                    v-if="!isRecording"
                    id="record"
                    src="@/assets/chat/microphone.svg"
                    alt
                    @click="toggleRecorder($event)"
                  >
                  <i
                    v-if="isRecording"
                    class="far fa-stop-circle app--conversation--sendForm__message__button__stop"
                    @click="sendRecord()"
                  />
                  <i
                    v-if="isRecording"
                    class="far fa-times-circle app--conversation--sendForm__message__button__cancel"
                    @click="cancelRecorder()"
                  />
                </span>
                <span
                  class="app--conversation--sendForm__message__button app--conversation--sendForm__message__button__send"
                  :style="{
                    cursor: sending? 'pointer': 'unset'
                  }"
                  @click="send(sendType)"
                >
                  <img
                    src="@/assets/chat/sendButton.svg"
                    alt
                  >
                </span>

                <textarea
                  id="message"
                  v-model="message"
                  :disabled="sending"
                  class="app-conversation--sendForm__message__area"
                  @change="changeCurrent"
                  @keyup.ctrl.enter="addLine($event)"
                  @keypress.enter.exact.stop="send(sendType)"
                />
              </v-row>

              <div
                id="attachments--wrapper"
                class="app--conversation--sendForm__attachments__wrapper"
              >
                <div
                  v-for="(item, index) in files"
                  :key="index"
                  style="position:relative"
                >
                  <i
                    class="fa fa-times"
                    @click="attachmentDelete(index)"
                  />
                  <img
                    class="preview"
                    :src="item.thumb"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//   import ConversationStatusBar from './ConversationStatusBar'
  import AppReply from './Reply'
  //   import AppTyping from './Typing'
  import AppTopicBar from './TopicBar'
  //
  import Recorder from '@/utils/recorder'
  import { convertTimeMMSS } from '@/utils'

  export default {
    components: {
      //   ConversationStatusBar,
      AppReply,
      //   AppTyping,
      AppTopicBar,
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
        attempts: 5,
        recorder: this._initRecorder(),
        recordList: [],
        selected: {},
        topicFilter: false,
        //
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
      iconButtonType () {
        return this.isRecording && this.isPause
          ? 'mic'
          : this.isRecording
            ? 'pause'
            : 'mic'
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
        return this.$store.getters['chat/message/recipients']
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

      recordDuration () {
        return this.recorder.duration - this.tsNow(true) - this.startTime
      },
    },
    watch: {
      isRecording (v) {
      /// /console.log('records', this.recordList);
      },
      message (v) {
        this.sendTypingEvent(this.conversationId)
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
        this.stopRecorder()
        const record = this.recordList[0]
        /// /console.log('rec', record);
        this.deleteRecord()

        const type = 'send'
        const message = new FormData()
        message.append('files[0]', record.blob)
        message.set('conversation_id', this.conversationId)
        await this.$store.dispatch('chat/message/send', { type, message })
      },
      deleteRecord () {
        this.recordList.splice(0, 1)
      },
      cancelRecorder () {
        this.stopRecorder()
        this.deleteRecord()
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
      stopRecorder () {
        if (!this.isRecording) {
          return
        }
        this.startTime = 0
        this.recorder.stop()
        this.recordList = this.recorder.recordList()
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
        this.message = this.message + '\n'
        var text = document.getElementById('message')
        if (text) {
          text.style.height = 'auto'
          text.style.height = text.scrollHeight + 'px'
        }
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
        this.$refs.attachFile.type = 'text'
        this.$refs.attachFile.type = 'file'
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

<style lang="scss" scoped>
.app--conversation--drop--wrap {
  background: #fff;
  display: none;
  padding: 17px 10px 0;
  border: 1px dashed #999;
  overflow: hidden;
  text-align: center;
  line-height: calc(100vh - 184px);
  color: #999;
  position: absolute;
  z-index: 1000;
  top: 0;
}

.app--conversation--sendForm {
  background: #f5f5f5;
  min-height: 91px;
  display: flex;
  align-items: center;
  width: 100%;

  .app--conversation--sendForm__button {
    background: #a4b1c1;
    border-radius: 10px;
    height: 31px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 15px;
    font-weight: 500;
    font-size: 13px;
    &:hover {
      cursor: pointer;
    }
  }

  .app--conversation--sendForm__button__recipient {
    margin-left: 20px;
  }

  .app--conversation--sendForm__button__theme {
    padding: 8px 25px;
    margin-left: 13.71px;
  }

  .app--conversation--sendForm__button__attach {
    border-radius: 21px;
    width: 42px;
    height: 42px;
    margin-left: 18.17px;
  }

  .app-conversation--sendForm__message__area {
    background: #ffffff;
    opacity: 0.3;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    min-height: 66px;
    width: 98%;
    margin: 13px 0px 13px 20px;
    outline: none;
    padding: 13px 72px;
    font-family: SF Pro Text;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
    max-height: 200px;
  }

  .app--conversation--sendForm__message__button img:active {
    border-radius: 50%;
    background: #a4b1c1;
  }

  .app--conversation--sendForm__message__button__microphone img {
    position: absolute;
    top: 13px;
    left: 20px;
    margin: 11px 16px 10px 13px;
    padding: 8px 12px 9px 12px;
    cursor: pointer;
    z-index: 150;
  }

  .app--conversation--sendForm__message__button__send img {
    position: absolute;
    top: 12px;
    right: 0px;
    margin: 12px 10px 12px 10px;
    padding: 12px 10px 12px 11px;
    cursor: pointer;
    z-index: 150;
  }

  .app--conversation--sendForm__message__button__stop {
    font-size: 26px;
    position: absolute;
    top: 13px;
    left: 20px;
    margin: 14px 22px 14px 19px;
    padding: 5px 6px 5px 6px;
    cursor: pointer;
    z-index: 150;
    color: #c4c4c4;
  }

  .app--conversation--sendForm__message__button__cancel {
    font-size: 26px;
    position: absolute;
    top: 13px;
    left: 20px;
    margin: 19px 28px 19px 65px;
    cursor: pointer;
    z-index: 150;
    color: #c4c4c4;
  }

  .app--conversation--sendForm__recorder__wrapper {
    position: absolute;
    color: #333;
    display: flex;
    align-items: center;
    top: 35px;
    left: 120px;

    .app--conversation--sendForm__recorder__indicator {
      background-color: #ff1010;
      height: 10px;
      width: 10px;
      border-radius: 50%;
      margin-right: 5px;
      margin-bottom: 2px;
      vertical-align: baseline;
      display: inline-block;
      animation: blinker-data-v-395362ea 0.5s cubic-bezier(0.5, 0, 1, 1)
        infinite alternate;
    }

    // .app--conversation--sendForm__recorder__timer {
    // }

    .app--conversation--sendForm__recorder__label {
      font-size: 12px;
      margin-left: 10px;
      margin-bottom: 2px;
    }
  }
}

@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.input-file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.input-file + .js-labelFile {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0px;
  cursor: pointer;
}
</style>

<style lang="scss">
.app--conversation--sendForm__attachments__wrapper {
  display: flex;
  flex-flow: row wrap;
  padding: 10px 0 10px 25px;
  i {
    position: absolute;
    right: 5px;
    top: 3px;
    padding: 3px;
    cursor: pointer;
  }
  .preview,
  img {
    max-height: 111px;
    max-width: 111px;
    padding: 5px;
    vertical-align: middle;
    text-align: center;
  }
}

#message::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 6px 0 rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 6px 0 rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

#message::-webkit-scrollbar {
  height: 5px;
  background-color: #f5f5f5;
}

#message::-webkit-scrollbar-thumb {
  background-color: #00d3ef;
  border: 2px solid #00d3ef;
}
</style>
