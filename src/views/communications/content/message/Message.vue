<template>
  <div class="message-line">
    <v-spacer v-if="myMessage" />

    <div class="message-block">
      <img
        class="message-author-avatar"
        :src="getAuthorAvatar(item)"
      >

      <div
        :style="
          myMessage
            ? 'width: calc(100% - 15px); margin-right: 15px; '
            : 'width: calc(100% - 50px);'
        "
      >
        <div
          :class="{
            'message-box': true,
            'message-my': myMessage,
          }"
          @mouseenter="showMenu(item, $event)"
          @mouseleave="hideMenu(item, $event)"
        >
          <!-- блок управления -->
          <div
            :id="'message' + item.id"
            :class="{
              'message-menu-my': myMessage,
              'message-menu-other': !myMessage,
            }"
            style="display: none; height: 60px"
          >
            <div
              :class="{
                'message-menu-my-icons': myMessage,
                'message-menu-other-icons': !myMessage,
              }"
            >
              <v-tooltip
                :open-delay="$config.tooltipButtonDelay"
                dark
                top
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    @click="openDelete(item, true)"
                    v-on="on"
                  >
                    <v-icon
                      :class="
                        myMessage
                          ? 'message-menu-my-icon1'
                          : 'message-menu-other-icon1'"
                    >
                      fa-trash-alt
                    </v-icon>
                  </v-btn>
                </template>
                <span>Удалить</span>
              </v-tooltip>

              <v-tooltip
                class="item"
                :open-delay="$config.tooltipButtonDelay"
                v-html="'Переслать'"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    :class="
                      myMessage
                        ? 'message-menu-my-icon2'
                        : 'message-menu-other-icon2'
                    "
                    @click="openForwardMessage(item)"
                    v-on="on"
                  >
                    fa-reply-all
                  </v-icon>
                </template>
              </v-tooltip>

              <v-tooltip
                class="item"
                :open-delay="$config.tooltipButtonDelay"
                v-html="'Ответить'"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    :class="
                      myMessage
                        ? 'message-menu-my-icon2'
                        : 'message-menu-other-icon2'
                    "
                    @click="openReplyMessage(item)"
                    v-on="on"
                  >
                    fa-reply
                  </v-icon>
                </template>
              </v-tooltip>

              <v-tooltip
                class="item"
                :open-delay="$config.tooltipButtonDelay"
                v-html="'Редактировать'"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-if="myMessage"
                    :class="
                      myMessage
                        ? 'message-menu-my-icon2'
                        : 'message-menu-other-icon2'
                    "
                    @click="openUpdate(item)"
                    v-on="on"
                  >
                    fa-edit
                  </v-icon>
                </template>
              </v-tooltip>
            </div>
          </div>

          <!-- блок циатата -->
          <div
            v-if="item.parent_id"
            class="message-box-quote"
          >
            <!-- вложения -->
            <div v-if="item.parent_message.attachments.length">
              <div
                v-for="(attachment, i) in item.parent_message.attachments"
                :key="i"
              >
                <app-attachment-text
                  v-if="attachment.type === 'message/text'"
                  :content="attachment.content"
                />

                <app-attachment-image
                  v-if="attachment.type === 'media/image'"
                  :content="attachment.content"
                />

                <app-attachment-audio
                  v-if="attachment.type === 'media/audio'"
                  :content="attachment.content"
                  :sender="item.sender_id"
                />

                <app-attachment-video
                  v-if="attachment.type === 'media/video'"
                  :content="attachment.content"
                />

                <app-attachment-file
                  v-if="attachment.type === 'media/file'"
                  :content="attachment.content"
                />

                <app-attachment-account
                  v-if="attachment.type === 'plus/account'"
                  :content="attachment.content"
                  :conversation-id="conversationId"
                />

                <app-attachment-deleted
                  v-if="attachment.type === 'deleted/message'"
                />
              </div>
            </div>

            <!-- текст сообщения цитаты -->
            <div
              v-if="item.parent_message.message"
              class="message-box-text chat-scroll-x"
            >
              <div class="message-box-author">
                Автор: &nbsp;{{ item.parent_message.sender.name }}
              </div>
              <div
                class="message-box-text"
              >
                <p class="body-s-regular neutral-900--text mb-0">
                  {{ formatMessage(item.parent_message.message) }}
                </p>
              </div>
            </div>
          </div>

          <div class="message-box-author-name">
            <p class="body-s-semibold neutral-900--text mb-0">
              {{ getAuthorName(item) }}
            </p>
          </div>

          <!-- блок сообщения -->
          <div class="message-box-message">
            <!-- вложения -->
            <div
              v-if="item.attachments.length"
              class="message-box-message-attachment"
            >
              <div
                v-for="attachment in item.attachments"
                :key="attachment.id"
              >
                <app-attachment-text
                  v-if="attachment.type === 'message/text'"
                  :content="attachment.content"
                />

                <app-attachment-image
                  v-if="attachment.type === 'media/image'"
                  :content="attachment.content"
                />

                <app-attachment-audio
                  v-if="attachment.type === 'media/audio'"
                  :content="attachment.content"
                  :sender="item.sender_id"
                />

                <app-attachment-video
                  v-if="attachment.type === 'media/video'"
                  :content="attachment.content"
                />

                <app-attachment-file
                  v-if="attachment.type === 'media/file'"
                  :content="attachment.content"
                />

                <app-attachment-account
                  v-if="attachment.type === 'plus/account'"
                  :content="attachment.content"
                  :conversation-id="conversationId"
                />

                <app-attachment-purchase
                  v-if="attachment.type === 'plus/purchase'"
                  :content="attachment.content"
                />

                <app-attachment-deleted
                  v-if="attachment.type === 'deleted/message'"
                />
              </div>
            </div>

            <!-- сообщение -->
            <div
              v-if="item.message"
              class="message-box-text chat-scroll-x"
            >
              <p class="body-s-regular neutral-900--text mb-0">
                {{ formatMessage(item.message) }}
              </p>
            </div>
          </div>

          <!-- блок тема -->
          <div
            v-if="item.topic_name"
            class="dialog-topic"
          >
            Тема: {{ item.topic_name }}
          </div>

          <!-- блок получатель -->
          <div
            v-if="item.recipients"
            class="message-box-recipients"
          >
            <div
              v-for="(member, i) in recipients"
              :key="i"
            >
              <v-tooltip
                :open-delay="$config.tooltipButtonDelay"
                v-html="member.name"
              >
                <template v-slot:activator="{ on }">
                  <v-img
                    :src="member.avatar"
                    class="message-box-recipients-avatars"
                    v-on="on"
                  />
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="message-time">
      <p class="body-s-regular neutral-500--text">
        {{ getDate(item.created_at) }}
      </p>
    </div>

    <app-message-update
      v-if="dialogUpdate"
      :dialog.sync="dialogUpdate"
      :item="editedItem"
    />

    <app-message-delete
      v-if="dialogDelete"
      :dialog.sync="dialogDelete"
      :item="editedItem"
      :show-delete-all="showDeleteAll"
    />
  </div>
</template>

<script>
  // mixins
  import Formater from '@/views/communications/mixins/index.js'

  // components
  import AppMessageUpdate from './MessageUpdate'
  import AppMessageDelete from './MessageDelete'
  // attachment
  import AppAttachmentText from '../components/attachment/AttachmentText'
  import AppAttachmentAccount from '../components/attachment/AttachmentAccount'
  import AppAttachmentDeleted from '../components/attachment/AttachmentDeleted'
  import AppAttachmentFile from '../components/attachment/AttachmentFile'
  import AppAttachmentImage from '../components/attachment/AttachmentImage'
  import AppAttachmentAudio from '../components/attachment/AttachmentAudio'
  import AppAttachmentVideo from '../components/attachment/AttachmentVideo'
  import AppAttachmentPurchase from '../components/attachment/AttachmentPurchase'

  export default {
    components: {
      // message
      AppMessageUpdate,
      AppMessageDelete,
      // attacment
      AppAttachmentText,
      AppAttachmentAccount,
      AppAttachmentDeleted,
      AppAttachmentFile,
      AppAttachmentImage,
      AppAttachmentAudio,
      AppAttachmentVideo,
      AppAttachmentPurchase,
    },
    mixins: [Formater],
    props: {
      item: {
        type: Object,
        required: true,
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
      myMessage: Boolean,
      dialogReplyMessage: Boolean,
      quotedMessage: {
        type: Object,
        default: null,
      },
      quotedMessageSender: {
        type: String,
        default: null,
      },
      sendType: {
        type: String,
        default: null,
      },
      overlayChat: Boolean,
    },
    data () {
      return {
        dialogUpdate: false,
        dialogDelete: false,
        editedItem: {},
        showDeleteAll: false,
      }
    },
    computed: {
      profile () {
        return this.$store.getters.user
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.members || []
        return []
      },
      recipients () {
        if (this.item.recipients) {
          const array = this.conversation.members.filter(
            (item) =>
              this.item.recipients.indexOf(item.id) !== -1 &&
              item.id !== this.chatUser.id,
          )
          return array
        } else {
          return []
        }
      },
      conversationProgram () {
        if (!this.isEmptyObject(this.conversation)) {
          return this.conversation.program
        }
        return {}
      },
      employees () {
        if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.chat_members || []
        return []
      },
      realChatName () {
        if (!this.isEmptyObject(this.conversationProgram)) {
          return this.conversationProgram.real_chat_name
        }
        return false
      },
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      getAuthorName (item) {
        let author = {}
        let isEmployee = false

        if (item.sender_id === this.chatUser.id) isEmployee = true

        // console.log(isEmployee)

        if (isEmployee) {
          author = this.getAuthor(item)
          if (author.id) {
            return `${this.conversationProgram.name} (${author.name})`
          } else if (item.real_sender_id === this.chatUser.id) { // реальный отправитель чат-бот
            return this.chatUser.name
          }

        // if (this.realChatName) {

        //     author = this.getAuthor(item)
        //     if (author.id) return `${author.name} (${this.conversationProgram.name})`
        //     // реальный отправитель чат-бот
        //     else if (item.real_sender_id == this.chatUser.id) {
        //         return this.chatUser.name
        //     }

        // } else {

        //     author = this.getAuthor(item)
        //     if (author.id) return `${this.conversationProgram.name} (${author.name})`
        //     // реальный отправитель чат-бот
        //     else if (item.real_sender_id == this.chatUser.id) {
        //         return this.chatUser.name
        //     }
        // }
        } else {
          author = this.getAuthor(item)
          if (author.id) return `${author.name}`
        }

        return 'Пользователь'
      },
      getAuthorAvatar (item) {
        const author = this.getAuthor(item)
        if (author.id) return author.avatar
        // реальный отправитель чат-бот
        else if (item.real_sender_id === this.chatUser.id) {
          return this.chatUser.avatar
        }
        return null
      },
      getAuthor (item) {
        let authorId = null
        let author = []
        let isEmployee = false

        if (item.sender_id === this.chatUser.id) isEmployee = true

        if (isEmployee) {
          authorId = item.real_sender_id
          author = this.employees.filter((item) => item.id === authorId)
          if (author.length) return author[0]
        } else {
          authorId = item.sender_id
          author = this.members.filter((item) => item.id === authorId)
          if (author.length) return author[0]
        }

        return {}
      },
      formatMessage (message) {
        if (message) {
          // let str = JSON.parse(message)
          let str = message
          let pos = 0
          while (true) {
            const foundPos = str.indexOf('\n', pos)
            if (foundPos !== -1) str = str.replace('\n', '<br>')
            if (foundPos === -1) break
            pos = foundPos
          }
          const regex = /^(http|https):\/\/([\S]+)/gm
          // console.log('find string', str);
          const matchString = str.match(regex)
          // console.log('link',matchString);
          if (matchString && matchString[0]) {
            const link =
              '<a target="_blank" href="' +
              matchString[0] +
              '">' +
              matchString[0] +
              '"</a> '
            str = str.replace(matchString[0], link)
          // console.log('string with Link', str);
          }
          return str
        }
        return null
      },
      showMenu (message, event) {
        const elem = document.getElementById('message' + message.id)
        elem.style.display = 'block'
        elem.style.height = event.srcElement.offsetHeight + 'px'
      },
      hideMenu (message, event) {
        const elem = document.getElementById('message' + message.id)
        elem.style.display = 'none'
        elem.style.height = '60px'
      },
      openUpdate (item) {
        // console.log('updated item', item);
        this.editedItem = Object.assign({}, item)
        this.dialogUpdate = true
      },
      openDelete (item, bool) {
        this.editedItem = Object.assign({}, item)
        this.showDeleteAll = bool
        this.dialogDelete = true
      },
      //
      openReplyMessage (message) {
        this.$emit('update:quotedMessage', Object.assign({}, message))
        this.$emit('update:quotedMessageSender', this.getAuthorName(message))
        this.$emit('update:sendType', 'reply')
        this.$emit('update:dialogReplyMessage', true)
      },
      openForwardMessage (message) {
        this.$emit('update:quotedMessage', Object.assign({}, message))
        this.$emit('update:quotedMessageSender', this.getAuthorName(message))
        this.$emit('update:sendType', 'forward')
        this.$emit('update:dialogReplyMessage', true)
        this.$emit('update:overlayChat', true)
      },
    },
  }
</script>
