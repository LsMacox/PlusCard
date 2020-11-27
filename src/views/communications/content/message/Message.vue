<template>
  <div class="message-line">
    <v-spacer v-if="myMessage" />

    <div
      v-click-outside="hideActions"
      class="message-block"
    >
      <div
        :ref="'messageAction' + item.id"
        class="message-actions"
        :class="[showActions ? 'show' : 'hide', actionPlacement]"
        @mouseover="showActions = true"
        @mouseleave="showActions = false"
      >
        <ul class="action-list">
          <li class="action-item">
            <a
              href="#"
              @click="openReplyMessage"
            >
              <iconify-icon
                class="icon icon-undo"
                icon="ion-arrow-undo-outline"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Ответить</p>
            </a>
          </li>
          <li class="action-item">
            <a
              href="#"
              @click="openForwardMessage"
            >
              <iconify-icon
                class="icon icon-forward"
                icon="ion-arrow-undo-outline"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Переслать</p>
            </a>
          </li>
          <li class="action-item">
            <a
              href="#"
              @click="copyMessage"
            >
              <iconify-icon
                class="icon icon-copy"
                icon="feather-copy"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Копировать</p>
            </a>
          </li>
          <li class="action-item">
            <a
              href="#"
              @click="openEditMessage"
            >
              <iconify-icon
                class="icon icon-edit"
                icon="feather-edit"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Редактировать</p>
            </a>
          </li>
          <li class="action-item">
            <a href="#">
              <iconify-icon
                class="icon icon-checkmark"
                icon="ion-checkmark-circle-outline"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Выбрать</p>
            </a>
          </li>
          <li class="action-item">
            <a
              href="#"
              @click="openDeleteMessage"
            >
              <iconify-icon
                class="icon icon-trash"
                icon="feather-trash"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Удалить</p>
            </a>
          </li>
        </ul>
      </div>

      <img
        class="message-author-avatar"
        :src="getAuthorAvatar(item)"
        @error="e => e.target.src = img404"
      >

      <div
        :style="
          myMessage
            ? 'width: calc(100% - 15px); margin-right: 15px; '
            : 'width: calc(100% - 50px);'"
        @contextmenu.prevent="showActions = true"
      >
        <div
          :class="{
            'message-box': true,
            'message-my': myMessage,
          }"
        >
          <div class="message-box-author-name">
            <p class="body-s-semibold neutral-900--text mb-0">
              {{ getAuthorName(item) }}
            </p>
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
              class="quote"
            >
              <div class="quote-author">
                <p class="body-s-semibold neutral-700--text mb-0">
                  {{ item.parent_message.sender.name }}
                </p>
              </div>
              <div
                class="quote-text"
              >
                <p class="body-s-regular neutral-700--text mb-0">
                  {{ formatMessage(item.parent_message.message) }}
                </p>
              </div>
            </div>
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
              class="message-box-text"
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
      v-if="dialogEdit"
      :dialog.sync="dialogEdit"
      :item="editedItem"
    />
    <app-message-delete
      v-if="dialogDelete"
      :dialog.sync="dialogDelete"
      :item="editedItem"
      :show-delete-all="myMessage"
    />
  </div>
</template>

<script>
  // mixins
  import MixinIndex from '@/views/communications/mixins/index.js'
  import MixinCalculation from '@/mixins/calculation.js'

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
    mixins: [
      MixinCalculation,
      MixinIndex,
    ],
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
        dialogEdit: false,
        dialogDelete: false,
        editedItem: {},
        showDeleteAll: false,
        showActions: false,
        actionPlacement: '',
        img404: 'https://storage.yandexcloud.net/plusstorage/users/avatars/default.png',
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
    watch: {
      showActions () {
        const headerHeight = document.querySelector('.app--conversation--header').clientHeight
        const actionEl = this.$refs['messageAction' + this.item.id]
        const actionHeight = this.nodeOffsetWH(actionEl, false)
        const MsgOffsetTop = document.getElementById('message-' + this.item.id).parentNode.offsetTop

        if (((MsgOffsetTop - actionHeight) + 60) > headerHeight) {
          this.actionPlacement = 'top'
        } else {
          this.actionPlacement = 'bottom'
        }
      },
    },
    mounted () {},
    methods: {
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
      hideActions () {
        this.showActions = false
      },
      openEditMessage () {
        // console.log('updated item', item);
        this.editedItem = Object.assign({}, this.item)
        this.dialogEdit = true
      },
      openDeleteMessage () {
        this.showActions = false
        this.editedItem = Object.assign({}, this.item)
        this.showDeleteAll = this.myMessage
        this.dialogDelete = true
      },
      openReplyMessage () {
        this.showActions = false
        this.$emit('update:quotedMessage', Object.assign({}, this.item))
        this.$emit('update:quotedMessageSender', this.getAuthorName(this.item))
        this.$emit('update:sendType', 'reply')
        this.$emit('update:dialogReplyMessage', true)
      },
      openForwardMessage () {
        this.showActions = false
        this.$emit('update:quotedMessage', Object.assign({}, this.item))
        this.$emit('update:quotedMessageSender', this.getAuthorName(this.item))
        this.$emit('update:sendType', 'forward')
        this.$emit('update:dialogReplyMessage', true)
        this.$emit('update:overlayChat', true)
      },
      copyMessage () {
        navigator.clipboard.writeText(this.item.message)
          .then(() => {
            this.showActions = false
          })
      },
    },
  }
</script>
