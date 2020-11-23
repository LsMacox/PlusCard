<template>
  <div class="app--chat--field">
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
      v-else-if="loadingConversations || loadingMessage"
      :loading="loadingConversations || loadingMessage"
      :style="{ height: '100%', width: '100%' }"
      type="header, body, actions"
      :types="{
        test: 'avatar, text',
        header: 'list-item-avatar-two-line',
        body: 'image@3',
      }"
    />
    <div
      v-else
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
            :key="i + item.id"
            class="app--conversation--message-box"
          >
            <div :ref="`message${item.id}`">
              <message
                :item="item"
                :conversation-id="currentConversationId"
                :my-message="
                  chatUser.id == item.sender_id &&
                    (profile.id == item.real_sender_id || !realChatName)"
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
      <!-- <div style="padding: 2px 3px 2px 4px">
        <app-typing :conversation-id="currentConversationId" />
      </div> -->

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
  <!-- </v-skeleton-loader> -->
  </div>
</template>

<script>
  import ConversationSendBox from './ConversationSendBox'
  import ConversationStatusBar from './ConversationStatusBar'

  import Message from './message/Message'
  // import AppTyping from './typing/Typing'

  export default {
    components: {
      ConversationSendBox,
      ConversationStatusBar,
      // AppTyping,
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
        messageRowLimit: 2,
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
        console.log('get message')
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

          messages = this.getCountMessagesInRow(messages)
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
            if (conversationField) {
              conversationField.scrollTop = msg.offsetTop - 150
            } // 150 px поправка скрола
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

      if (this.currentConversationId) {
        await this.fetchData(this.currentConversationId)
      }
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
              text: 'Размер файла превышает 30 МБ',
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
            text: 'Достигнуто предельное количество вложений - 10',
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
      getCountMessagesInRow (messages) {
        if (typeof messages === 'undefined') return

        // const msg = Object.values(messages)
        // let parentCount = 0

        // for (const propId in messages) {
        //   const msgIndex = this.getMessageIndexById(propId)
        //   let parentIndex = msgIndex

        //   if (parentCount >= this.messageRowLimit) {
        //     parentCount = 0
        //     for (let i = 0; i < this.messageRowLimit; i++) {
        //       if (
        //         typeof msg[parentIndex - 1] !== 'undefined' &&
        //         msg[parentIndex].sender_id === msg[parentIndex - 1].sender_id
        //       ) {
        //         parentCount++
        //         parentIndex--
        //       } else {
        //         break
        //       }
        //     }
        //   }

        // }

        // console.log('msg:', msg)

        return messages
      },
      getMessageIndexById (id) {
        const msg = Object.values(this.messages)
        const msgIndex = msg.findIndex(m => {
          return String(m.id) === String(id)
        })
        console.log('index:', msgIndex)

        return msgIndex
      },
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
          } else { // синхронная загрузка
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
