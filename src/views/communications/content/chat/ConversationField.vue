<template>
  <div
    v-if="!currentConversationId"
    class="empty-field"
  >
    Выберите чат из списка слева
  </div>

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
    v-else
    :loading="loadingConversations || loadingMessage"
    :style="{height: '100%', width: '100%'}"
    type="header, body, actions"
    :types="{
      test: 'avatar, text',
      header: 'list-item-avatar-two-line',
      body: 'image@3',
    }"
  >
    <div
      id="conversationWrap"
      class="app--conversationWrapper"
    >
      <conversation-status-bar
        :conversation-id="currentConversationId"
        :visible-search.sync="visibleSearch"
        :search-string.sync="searchString"
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
        <!-- прелоадер старых сообщений -->
        <v-skeleton-loader
          :loading="loadingMessagePage"
          height="100%"
          type="list-item-avatar-three-line@5"
        >
          <div
            v-for="(item, i) in messages"
            :key="i"
          >
            <div :ref="`message${item.id}`">
              <message
                :item="item"
                :conversation-id="currentConversationId"
                :my-message="chatUser.id == item.sender_id && ( profile.id == item.real_sender_id || !realChatName)"
                :dialog-reply-message.sync="dialogReplyMessage"
                :quoted-message.sync="quotedMessage"
                :quoted-message-sender.sync="quotedMessageSender"
                :send-type.sync="sendType"
                :overlay-chat.sync="overlayChat"
              />
            </div>
          </div>
        </v-skeleton-loader>
      </div>

      <!-- строка typing -->
      <div style="padding: 2px 3px 2px 4px">
        <app-typing :conversation-id="currentConversationId" />
      </div>

      <!-- форма отправки -->
      <conversation-send-box
        :conversation-id="currentConversationId"
        :dialog-reply-message.sync="dialogReplyMessage"
        :quoted-message.sync="quotedMessage"
        :quoted-message-sender.sync="quotedMessageSender"
        :send-type.sync="sendType"
        @send-message="toBottomFeed()"
      />
    </div>
  </v-skeleton-loader>
</template>

<script>
  import ConversationSendBox from './ConversationSendBox'
  import ConversationStatusBar from './ConversationStatusBar'

  //   import AppMessageUpdate from './MessageUpdate'
  //   import AppMessageDelete from './MessageDelete'
  //   //
  //   import AppAttachmentText from './AttachmentText'

  //   import AppAttachmentAccount from './AttachmentAccount'
  //   import AppAttachmentDeleted from './AttachmentDeleted'
  //   import AppAttachmentFile from './AttachmentFile'
  //   import AppAttachmentImage from './AttachmentImage'
  //   import AppAttachmentAudio from './AttachmentAudio'
  //   import AppAttachmentVideo from './AttachmentVideo'
  //   import AppAttachmentPurchase from './AttachmentPurchase'

  //   //
  //   import AppReply from './Reply'
  //   import AppTopicBar from './TopicBar'

  import AppTyping from './Typing'
  //
  import Message from './message_card/Message'

  export default {
    components: {
      ConversationSendBox,
      ConversationStatusBar,
      //   AppMessageUpdate,
      //   AppMessageDelete,
      //   //
      //   AppAttachmentText,
      //   AppAttachmentAccount,
      //   AppAttachmentDeleted,
      //   AppAttachmentFile,
      //   AppAttachmentImage,
      //   AppAttachmentAudio,
      //   AppAttachmentVideo,
      //   AppAttachmentPurchase,
      //   //
      //   AppReply,
      //   AppTopicBar,
      AppTyping,

      //
      Message,
    },
    data () {
      return {
        activeWindow: true,
        searchString: '',
        messageForCenterId: null,
        visibleSearch: false,
        messageIdToScrollPage: null,
        feedScrollTop: null,
        loadingMessage: false,
        //
        previewDialog: false,
        topicFilter: false,
        //
        messagesCount: 0,
        //
        dialogMessageUpdate: false,
        dialogMessageDelete: false,
        // reply
        dialogReplyMessage: false,
        quotedMessage: {},
        quotedMessageSender: null,
        overlayChat: false,
        //
        updatedMessageId: null,
        deletedMessageId: null,
        sending: false,
        messageMenu: false,
        posX: 0,
        posY: 0,
        //
        newMessage: '',
        attachFileName: '',
        attachFileType: '',
        attachFilePreview: '',
        attachFile: '',
        attachLoading: false,
        attachPreview: false,
        filesPreview: [],
        sendType: 'send',
        typingTime: null,
        dragAndDropCapable: false,
        files: [],
      }
    },
    computed: {
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      loadingMessagePage: {
        get () {
          return this.$store.getters['chat/message/loadingMessagePage']
        },
        set (v) {
          this.$store.commit('chat/message/loadingMessagePage', v)
        },
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
      loadingConversations () {
        return this.$store.getters['chat/conversation/loadingConversations']
      },
      currentConversationId () {
        return this.$store.getters['chat/conversation/currentConversationId']
      },
      currentConversationType () {
        return this.$store.getters['chat/conversation/currentConversationType']
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.currentConversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      messages () {
        let messages = {}
        if (this.currentConversationId) {
          messages = this.$store.getters['chat/message/messages'][
            this.currentConversationId
          ]
          if (this.topicFilter) {
            const newMessages = {}
            for (const item in messages) {
              if (messages[item].topic_id === this.selectedTopicId) {
                newMessages[item] = messages[item]
              }
            }
            // console.log('new_msg',newMessages);
            return newMessages
          }
        }
        // console.log('msg',messages);
        return messages || {}
      },
      issetMessages () {
        return Object.keys(this.messages).length
      },
      selectedTopicId () {
        return this.$store.getters['chat/topic/selectedTopicId']
      },
      recipients () {
        return this.$store.getters['chat/message/recipients']
      },
      validateSendMessage () {
        if (
          typeof this.$store.getters['chat/message/messages'][
            this.currentConversationId
          ] !== 'undefined'
        ) {
          // проверка на строку из пробелов и вложения
          if (/\S/.test(this.newMessage) || this.files.length) {
            return true
          }
        }
        return false
      },
      validateAttachment () {
        if (
          typeof this.$store.getters['chat/message/messages'][
            this.currentConversationId
          ] !== 'undefined'
        ) {
          return true
        }
        return false
      },
      conversationProgram () {
        if (!this.isEmptyObject(this.conversation)) { return this.conversation.program }
        return {}
      },
      realChatName () {
        if (!this.isEmptyObject(this.conversationProgram)) { return this.conversationProgram.real_chat_name }
        return false
      },
    },
    watch: {
      async currentConversationId (v) {
        if (v) {
          // при переходе в другой чат обнуляем
          this.messageIdToScrollPage = null
          this.feedScrollTop = null
          //
          await this.fetchData(v)
          if (this.issetMessages) this.toBottomFeed()
        }
      },
      /* activeWindow(v){
               //console.log('watcher');
                if (this.messages && Object.keys(this.messages).length && !this.loadingMessagePage && v) {
                   //console.log('update from watcher!');
                    this.updateMessages(this.messages)
                }
            }, */
      async messages (v) {
        if (Object.keys(v).length && !this.loadingMessagePage) {
          // console.log('async messages');
          /* if(this.activeWindow) { */
          // console.log('update from async messages');
          this.updateMessages(v)
        /* } */
        }
        // перемещение ленты чата на сообщение с которого началась загрузка страницы сообщений
        await this.$nextTick()
        if (this.$refs[this.messageIdToScrollPage]) {
          const msg = this.$refs[this.messageIdToScrollPage][0]

          if (msg) {
            const conversationField = this.$refs.conversationField
            if (conversationField) { conversationField.scrollTop = msg.offsetTop - 150 } // 150 px поправка скрола
          }
        }
      },
      async filteredMessages (v) {
        await this.$nextTick()
        this.toBottomFeed()
      },
      // поисковая строка
      searchString (v) {
        if (v) {
          this.searchByFilterString(v)
        } else {
          this.messageForCenterId = null
        }
      },
      // управление скроллом ленты сообщений
      // прокрутка до найденного сообщения
      messageForCenterId (v) {
        if (v) {
          const feed = this.$refs.conversationField
          const msg = this.$refs['message' + v]

          if (msg && msg.length) {
            feed.scrollTop = msg[0].offsetTop - 80 // поправка скролла ленты сообщений
          }
        } else {
          this.toBottomFeed()
        }
      },
    },
    async mounted () {
      /* window.addEventListener('focus', function(){
                if (this.messages && Object.keys(this.messages).length && !this.loadingMessagePage) {
                    this.updateMessages(v)
                }
                this.activeWindow = true;
               //console.log('focus star');
            });
            window.addEventListener('blur', function(){
               //console.log('focus stop');
                this.activeWindow = false;
            }); */
      // выполняется один раз, остальное через watch

      if (this.currentConversationId) { await this.fetchData(this.currentConversationId) }
      if (this.issetMessages) {
        this.init()
        this.updateMessages()
      }
    },
    methods: {
      searchByFilterString (searchable) {
        if (searchable) {
          searchable = searchable.toLowerCase()

          let id = null
          let text = null

          for (const item in this.messages) {
            id = null
            text = null

            // есть сообщение во вложении пересылаемого сообщения
            if (
              this.messages[item].parent_message &&
              this.messages[item].parent_message.attachments &&
              this.messages[item].parent_message.attachments.length
            ) {
              if (
                this.messages[item].parent_message.attachments[0].type ===
                'message/text'
              ) {
                id = this.messages[item].parent_message.id
                text = this.messages[item].parent_message.attachments[0].content
              }

            // есть сообщение во вложении
            } else if (
              this.messages[item].attachments &&
              this.messages[item].attachments.length
            ) {
              if (this.messages[item].attachments[0].type === 'message/text') {
                id = this.messages[item].id
                text = this.messages[item].attachments[0].content
              }

            // есть сообщение
            } else if (this.messages[item].message) {
              id = this.messages[item].id
              text = this.messages[item].message
            }

            // есть сообщение
            if (text) {
              text = text.toLowerCase()

              if (text.indexOf(searchable) !== -1) {
                this.messageForCenterId = id
                return
              }
            }
          }
          this.messageForCenterId = null
        }
      },
      getImagePreviews () {
        for (let i = 0; i < this.files.length; i++) {
          if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
            const reader = new FileReader()
            reader.addEventListener(
              'load',
              function () {
                this.$refs['preview' + parseInt(i)][0].src = reader.result
                if (
                  this.$refs['preview' + parseInt(i)][0].naturalHeight >
                  this.$refs['preview' + parseInt(i)][0].naturalWidth
                ) {
                  this.$refs['preview' + parseInt(i)][0].height = 260
                  this.$refs['preview' + parseInt(i)][0].style.height = '260px'
                  this.$refs['preview' + parseInt(i)][0].width = 146
                  this.$refs['preview' + parseInt(i)][0].style.width = '146px'
                }
                if (
                  this.$refs['preview' + parseInt(i)][0].naturalHeight <
                  this.$refs['preview' + parseInt(i)][0].naturalWidth
                ) {
                  this.$refs['preview' + parseInt(i)][0].height = 146
                  this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                  this.$refs['preview' + parseInt(i)][0].width = 260
                  this.$refs['preview' + parseInt(i)][0].style.width = '260px'
                } else {
                  this.$refs['preview' + parseInt(i)][0].height = 146
                  this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                  this.$refs['preview' + parseInt(i)][0].width = 146
                  this.$refs['preview' + parseInt(i)][0].style.width = '146px'
                }
              }.bind(this),
              false,
            )
            reader.readAsDataURL(this.files[i].original)
          } else {
            this.$nextTick(function () {
              this.$refs['preview' + parseInt(i)][0].src =
                'https://nektony.com/wp-content/uploads/2016/10/file.svg'
              if (
                this.$refs['preview' + parseInt(i)][0].naturalHeight >
                this.$refs['preview' + parseInt(i)][0].naturalWidth
              ) {
                this.$refs['preview' + parseInt(i)][0].height = 260
                this.$refs['preview' + parseInt(i)][0].style.height = '260px'
                this.$refs['preview' + parseInt(i)][0].width = 146
                this.$refs['preview' + parseInt(i)][0].style.width = '146px'
              }
              if (
                this.$refs['preview' + parseInt(i)][0].naturalHeight <
                this.$refs['preview' + parseInt(i)][0].naturalWidth
              ) {
                this.$refs['preview' + parseInt(i)][0].height = 146
                this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                this.$refs['preview' + parseInt(i)][0].width = 260
                this.$refs['preview' + parseInt(i)][0].style.width = '260px'
              } else {
                this.$refs['preview' + parseInt(i)][0].height = 146
                this.$refs['preview' + parseInt(i)][0].style.height = '146px'
                this.$refs['preview' + parseInt(i)][0].width = 146
                this.$refs['preview' + parseInt(i)][0].style.width = '146px'
              }
            })
          }
        }
      },
      visibleDragArea () {
        var element = document.getElementById('file-drag-drop')
        element.style.display = 'block'
      },
      onDragOver (e) {
      // console.log('files in drop zone');
      },
      determineDragAndDropCapable () {
        var div = document.createElement('div')
        return (
          ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
          'FormData' in window &&
          'FileReader' in window
        )
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
        if (this.topicFilter) {
          return 'topic-filter-btn-ball topic-filter-btn-ball-active'
        }
        return 'topic-filter-btn-ball'
      },

      /*
       * ФОРМА ОТПРАВКИ
       */

      getEraseClass () {
        if (this.validateSendMessage) {
          return 'send-block-erase send-block-erase-active'
        }
        return 'send-block-erase'
      },
      getSendingClass () {
        if (this.validateSendMessage) {
          return 'dialog-send-sending dialog-send-sending-active'
        }
        return 'dialog-send-sending'
      },

      /*
       * СОБЫТИЯ КЛАВИАТУРЫ И TYPING
       */

      messageEvent (conversationId, $event) {
        // ctrl + enter новая строка
        if ($event.ctrlKey === true && $event.code === 'Enter') {
          this.newMessage = this.newMessage + '\n'
        }
        if ($event.ctrlKey === true && $event.code === 'NumpadEnter') {
          this.newMessage = this.newMessage + '\n'
        }
        // enter отправка сообщения
        if ($event.ctrlKey === false && $event.code === 'Enter') {
          if (!this.sending) this.send(this.sendType)
        }
        if ($event.ctrlKey === false && $event.code === 'NumpadEnter') {
          if (!this.sending) this.send(this.sendType)
        }
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
        const attachFile = this.$refs.attachFile.files[0]
        if (attachFile) {
          if (attachFile.size > 30720000) {
            this.$refs.attachFile.value = null
            this.$notify({
              message: 'Размер файла превышает 30 МБ',
              type: 'error',
            })
          }
          this.previewAttachFile(attachFile)
        /*
                    if (attachFile.type == 'image/png' || attachFile.type == 'image/jpeg') {

                    } else {
                        this.$refs.attachFile.value = null
                    }
                    */
        }
      },
      readPreview (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      },
      readFile (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = reject
          reader.readAsBinaryString(file)
        })
      },
      async previewAttachFile (file) {
        this.attachLoading = true
        this.attachFileName = file.name
        this.attachFileType = file.type
        this.attachFilePreview = await this.readPreview(file)
        const binary = await this.readFile(file)
        this.attachFile = btoa(binary)
        const attach = {
          name: this.attachFileName,
          mime: this.attachFileType,
          data: this.attachFile,
          original: file,
        }
        if (this.files.length < 10) {
          this.files.push(attach)
          this.filesPreview.push(this.attachFilePreview)
        } else {
          this.$notify({
            message: 'Достигнуто предельное количество вложений - 10',
            type: 'error',
          })
        }
        this.attachLoading = false
        this.getImagePreviews()
      // console.log(attach)
      // console.log(attach)
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
        this.filesPreview.splice(index, 1)
        if (!this.files.length) this.attachPreview = false
      },

      /*
       * ДИАЛОГИ СООБЩЕНИЙ
       */
      closeReplyMessage () {
        this.quotedMessage = {}
        this.quotedMessageSender = null
        this.sendType = 'send'
        this.dialogReplyMessage = false
        if (this.overlayChat) {
          const elem = this.$refs.conversationField
          if (elem) elem.scrollTop = elem.scrollHeight
          this.overlayChat = false
        }
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
        this.quotedMessage = {}
        this.dialogReplyMessage = false
        this.sendType = 'send'
        this.$store.commit('chat/topic/selectedTopicId', null)
        this.$store.commit('chat/message/recipients', [])
        this.sending = false
      },
      toBottomFeed () {
        const elem = this.$refs.conversationField
        if (elem) elem.scrollTop = elem.scrollHeight
      },
      async updateMessages (messages) {
        this.overlayChat = false

        this.toBottomFeed()
        // массовое прочтение сообщений
        await this.$store.dispatch(
          'chat/message/toRead',
          this.currentConversationId,
        )
      },
      // отправляем сообщение
      async send (type) {
        // console.log('вызов send')
        // console.log(this.newMessage)
        if (this.validateSendMessage) {
          this.sending = true
          // токен чат-пользователя для операций с чатами

          const message = {
            conversation_id: this.currentConversationId,
            message_id: this.quotedMessage ? this.quotedMessage.id : null,
            message: this.newMessage,
            media: this.files,
            topic_id: this.selectedTopicId,
            recipients: Array.from(new Set(this.recipients)),
            type: type,
          }
          // console.log(message)
          await this.$store.dispatch('chat/message/send', message)
          this.clearForm()
        }
      },
      async fetchData (id) {
        // id чата
        if (id) {
          this.loadingMessage = true

          // асинхронная загрузка
          if (Object.keys(this.messages).length) {
            console.log('асинхронная загрузка')
            try {
              this.$store.dispatch('chat/topic/list', id)
              this.$store.dispatch('chat/group/list', id)

              const conversation = {
                id,
                offset: 0,
                limit: 20,
              }

              this.$store.dispatch('chat/message/list', conversation)
            } catch (e) {
              console.error(e)
            } finally {
              this.loadingMessage = false
            }

          // синхронная загрузка
          } else {
            console.log('синхронная загрузка')
            try {
              await this.$store.dispatch('chat/topic/list', id)
              await this.$store.dispatch('chat/group/list', id)

              const conversation = {
                id,
                offset: 0,
                limit: 20,
              }

              await this.$store.dispatch('chat/message/list', conversation)
            } catch (e) {
              console.error(e)
            } finally {
              this.loadingMessage = false
            }
          }
        }
      },
      async scrollFeed (e) {
        const h = e.target.scrollTop

        // загрузка страницы сообщений
        if (this.feedScrollTop > 0 && h === 0) {
          const keys = Object.keys(this.messages)
          if (keys.length) {
            this.messageIdToScrollPage = `message${keys[0]}`
          }

          this.loadingMessagePage = true
          try {
            const conversation = {
              id: this.currentConversationId,
              offset: 0,
              limit: 20,
            }

            if (this.messages && Object.keys(this.messages).length) {
              conversation.offset = Object.keys(this.messages).length
            }

            await this.$store.dispatch('chat/message/list', conversation)
          } catch (e) {}
          this.loadingMessagePage = false
        }
        this.feedScrollTop = h
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

        if (text) {
          const resize = () => {
            text.style.height = 'auto'
            text.style.height = text.scrollHeight + 'px'
          }

          /* 0-timeout to get the already changed text */
          const delayedResize = () => {
            window.setTimeout(resize, 0)
          }

          observe(text, 'change', resize)
          observe(text, 'cut', delayedResize)
          observe(text, 'paste', delayedResize)
          observe(text, 'drop', delayedResize)
          observe(text, 'keydown', delayedResize)

          text.focus()
          text.select()
          resize()
        }

        window.onresize = this.toBottomFeed()
      },
    },
  }
</script>

<style lang="scss" scoped>
.empty-field {
  padding: 30px;
  font-size: 20px;
  color: #757575;
}

.emptyChat {
  padding-top: 20vh;
  height: calc(100vh - 40px);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 10;
}

.overlayChat {
  padding-top: 20vh;
  height: 70vh;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 10;
}

.overlayChatText {
  color: #cccccc;
  font-size: 32px;
  font-weight: 900;
  text-align: center;
  z-index: 11;
}

/* ЛЕНТА ЧАТА */
.conversation {
  position: relative;
  width: 100%;
}

.conversation-box {
  position: relative;
  padding: 35px 14px 0 0;
  margin-bottom: 50px;
  border-radius: 5px 5px 0 0;
  background-color: #ffffff;
  //height: calc(100vh - 287px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.topic-filter {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
}

.topic-filter-box {
  display: flex;
  width: 100%;
  height: 35px;
  color: #ffffff;
  background-color: #387bc1;
  border-radius: 5px 0 0 0;
  padding: 8px 10px;
  z-index: 2;
}

.topic-filter-btn {
  position: relative;
  padding: 1px;
  width: 35px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid #ffffff;
  cursor: pointer;
}

.topic-filter-btn-ball {
  position: relative;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: #c3c3c3;
  transition: 0.5s;
}

.topic-filter-btn-ball-active {
  left: 15px;
  background-color: #ffffff;
}

.message-pos {
  display: flex;
  margin: 10px 0 10px 14px;
}

.message-other {
  position: relative;
  display: inline-block;
  max-width: 60%;
  background-color: #f4f3f7;
  color: #181818;
  border-radius: 5px 5px 5px 0;
}

.dialog-box-quote-other {
  padding: 15px;
  border-radius: 5px 5px 0 0;
  background-color: #c0c0c0;
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin: auto 5px 0 0;
  cursor: pointer;
}

.message-time-other {
  width: 150px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 10px;
  font-size: 11px;
  line-height: 13px;
  color: #bac5d2;
}

.attachment-box {
  margin-bottom: 3px;
}

.dialog-box-message {
  padding: 15px;
}

.dialog-box-message-text {
  font-size: 13px;
  text-align: left;
  overflow: auto;
}

/*
         * SEND BOX
         */

.send-box {
  position: relative;
  padding: 8px 13px;
  background-color: #dddfe0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.send-block {
  display: flex;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 7px;
}

.send-block-erase {
  width: 43px;
  height: 35px;
  border-radius: 43px;
  background-color: #d5d1de;
  text-align: center;
  padding: 3px 0;
  cursor: pointer;
}

.send-block-erase-active {
  background-color: #a09bab;
}

.send-block-erase-icon {
  font-size: 29px;
  z-index: 10;
}

.dialog-send-textarea {
  display: block;
  padding: 7px 14px;
  width: 100%;
  outline: none;
}

.dialog-send-sending {
  width: 43px;
  height: 35px;
  border-radius: 43px;
  background-color: #d5d1de;
  text-align: center;
  padding: 7px 0;
  cursor: pointer;
}

.dialog-send-sending-active {
  background-color: #07c9eb;
}

.dialog-send-sending-icon {
  font-size: 22px;
}

/* --- FILE --- */
.send-block-attachment {
  position: relative;
  width: 35px;
  height: 35px;
  margin: 0 7px;
  border-radius: 35px;
}

.send-block-attachment-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 15px;
  height: 15px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #ffffff;
  background-color: #ff0000;
  z-index: 2;
}

.send-block-attachment-preview-mask {
  position: absolute;
  bottom: 30px;
  left: -111px;
  width: 255px;
  z-index: 2;
  /*border: 1px solid #000000;*/
}

.send-block-attachment-preview {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0 0.1px 5px;
  position: relative;
  margin-bottom: 15px;
  border-radius: 4px;
  background-color: #ffffff;
}

.send-block-attachment-preview-img {
  position: relative;
  margin: 0 5px 5px 0;
  max-width: 119px;
  width: 119px;
  height: 119px;
  border-radius: 4px;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

.send-block-attachment-preview-img-delete {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  text-align: center;
  cursor: pointer;
}

.send-block-attachment-preview-img-delete-icon {
  width: 50px;
  margin-top: 35px;
  font-size: 50px;
}

.send-block-attachment-icon {
  width: 35px;
  height: 35px;
  border-radius: 35px;
  background-color: #07c9eb;
  cursor: pointer;
}

.send-block-attachment-icon2 {
  position: relative;
  top: -13px;
  left: 0;
  font-size: 33px;
  color: #ffffff;
}

.send-block-attachment-loading {
  width: 44px;
  height: 35px;
  border-radius: 35px;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 7px;
  text-align: center;
  padding: 5px 0;
}

.input-label {
  color: #90a4ae;
  padding: 0;
  line-height: 59px;
  width: 59px;
  margin: auto;
  display: block;
  text-align: center;
}

.input-label:hover,
.input-label:focus {
  color: #b0bec5;
  border-color: #b0bec5;
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

/* conversation scrool-x */
.conversation-scroll-x::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 6px 0 rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 6px 0 rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.conversation-scroll-x::-webkit-scrollbar {
  height: 5px;
  background-color: #f5f5f5;
}

.conversation-scroll-x::-webkit-scrollbar-thumb {
  background-color: #00d3ef;
  border: 2px solid #00d3ef;
}

/* conversation scrool-y */
.conversation-scroll-y::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.conversation-scroll-y::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

.conversation-scroll-y::-webkit-scrollbar-thumb {
  background-color: #00d3ef;
  border: 2px solid #00d3ef;
}

#file-drag-drop {
  display: none;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 1000;
  padding: 35px 15px 0 15px;
  margin-bottom: 50px;
  border-radius: 5px 5px 0 0;
  background-color: #ffffff;
  height: calc(100vh - 287px);
}
#file-drag-drop form {
  line-height: 400px;
  border-radius: 4px;
  width: 100%;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  border: 5px dotted #ccc;
}

div.file-listing {
  padding: 10px;
  margin: 5px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  .preview {
    cursor: pointer;
  }
}

.app--conversationWrapper {
  display: flex;
  flex-direction: column;
  min-height: 310px;
  height: 100%;

  .app--conversation--content {
    flex-grow: 1;
    overflow-y: hidden;
    overflow-x: hidden;
    margin-right: 5px;

    &:hover {
      margin-right: 0px;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #00d3ef;
      border: 2px solid #00d3ef;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(156, 68, 68, 0.3);
      box-shadow: inset 0 0 6px rgba(156, 68, 68, 0.3);
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar {
      width: 5px;
      background-color: #f5f5f5;
    }
  }

  .app--conversation--drop--wrap {
    background: #fff;
    display: none;
    padding: 17px 10px 0;
    border: 1px dashed #999;
    overflow: hidden;
    text-align: center;
    color: #999;
    position: absolute;
  }
}

.message-page-preloader {
  width: 100%;
  height: 100%;
}
</style>
