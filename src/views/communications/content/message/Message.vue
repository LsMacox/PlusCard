<template>
  <div
    class="message-line"
    :class="{
      select: showActions || (isChoiceMessage && isChoice),
      choice: isChoiceMessage,
      connectNexMessage: item.connectNexMessage,
    }"
    @click="choiceMessage"
  >
    <div
      v-if="isChoiceMessage"
      class="choice__overlay"
    />
    <div
      v-click-outside="hideActions"
      class="message-block"
    >
      <div
        :ref="'messageAction' + item.id"
        class="message-actions"
        :class="[
          showActions ? 'show' : 'hide',
          actionPlacement, {'message-my': myMessage},
        ]"
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
          <li
            v-if="item.attachments.length || item.message"
            class="action-item"
          >
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
          <li
            v-if="myMessage"
            class="action-item"
          >
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
            <a
              href="#"
              @click="openChoiceMessages"
            >
              <iconify-icon
                class="icon icon-checkmark"
                icon="ion-checkmark-circle-outline"
                width="21"
              />
              <p class="body-s-medium neutral-500--text">Выбрать</p>
            </a>
          </li>
          <li
            v-if="myMessage"
            class="action-item"
          >
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
        v-if="!item.connectNexMessage"
        class="message-author-avatar"
        :src="getAuthorAvatar(item, payload)"
        @error="e => e.target.src = img404"
      >

      <div
        @contextmenu.prevent="showActions = true"
      >
        <div
          :class="{
            'message-box': true,
            'message-my': myMessage,
          }"
          :style="item.connectNexMessage ? 'margin-left: 81px;' : ''"
        >
          <!-- блок тема -->
          <div
            v-if="item.topic_name"
            class="message-topic"
          >
            <p class="body-x-semibold primary--text">
              #{{ item.topic_name }}
            </p>
          </div>

          <!-- блок с именени автора -->
          <div class="message-box-author-name">
            <p class="body-s-semibold neutral-900--text mb-0">
              {{ getAuthorName(item, payload) }}
            </p>
          </div>

          <!-- блок с текстом о пересланном сообщении -->
          <div
            v-if="item.parent_id && authorName === 'Вы'"
            class="message-box-forward-text"
          >
            <p class="body-s-medium neutral-500--text mb-0">
              Пересланное сообщение
            </p>
          </div>

          <!-- блок циатата -->
          <div
            v-if="item.parent_id"
            class="message-box-quote"
          >
            <!-- вложения -->
            <app-attachments
              v-if="item.parent_message.attachments.length"
              :msg-item="item"
              :attachments="item.parent_message.attachments"
              :conversation-id="conversationId"
            />
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
                <p
                  class="body-s-regular neutral-700--text mb-0"
                  v-html="formatMessage(item.parent_message.message)"
                />
              </div>
            </div>
          </div>

          <!-- блок сообщения -->
          <div
            class="message-box-message"
            :style="item.attachments.length ? 'margin-right: 0px' : ''"
          >
            <!-- вложения -->
            <div
              v-if="item.attachments.length"
              class="message-box-message-attachment"
            >
              <app-attachments
                :msg-item="item"
                :attachments="item.attachments"
                :conversation-id="conversationId"
              />
            </div>

            <!-- сообщение -->
            <div
              v-if="item.message"
              class="message-box-text"
            >
              <p
                class="body-s-regular neutral-900--text mb-0"
                v-html="formatMessage(item.message)"
              />
            </div>
          </div>

          <!-- блок получатель -->
          <!-- <div
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
          </div> -->

          <!-- кнопка редактирования -->
          <div
            v-if="myMessage && !item.attachments.length"
            class="message-box-edit"
          >
            <iconify-icon
              class="icon-edit"
              icon="feather-edit-2"
              width="15"
              @click="openEditMessage"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="message__right-block">
      <div
        v-if="myMessage && isMessageSendNow"
        class="message-shipment"
      >
        <iconify-icon
          v-if="!item.read"
          class="icon icon-check"
          icon="feather-check"
          width="21"
        />
        <iconify-icon
          v-if="item.read"
          class="icon icon-done"
          icon="ion-checkmark-done"
          width="21"
        />
      </div>

      <div class="message-time">
        <p class="body-s-regular neutral-500--text mb-0">
          {{ getDate(item.created_at) }}
        </p>
      </div>

      <div
        v-if="isChoiceMessage"
        class="message-choice"
      >
        <iconify-icon
          v-if="isChoice"
          class="icon-check"
          icon="octicon-check-circle-fill-16"
          width="21"
        />
        <iconify-icon
          v-else
          class="icon-not-check"
          icon="feather-circle"
          width="21"
        />
      </div>
    </div>

    <app-message-delete
      v-if="isDelete"
      :is-delete.sync="isDelete"
      :msg-item="editedItem"
      :show-delete-all="myMessage"
    />
  </div>
</template>

<script>
  // mixins
  import MixinIndex from '@/views/communications/mixins/index.js'
  import MixinCalculation from '@/mixins/calculation'

  // components
  import AppMessageDelete from './MessageDelete'
  // attachment
  import AppAttachments from '../components/attachment/Attachments'

  export default {
    components: {
      // message
      AppMessageDelete,
      // attacment
      AppAttachments,
    },
    mixins: [
      MixinIndex,
      MixinCalculation,
    ],
    props: {
      item: {
        type: Object,
        required: true,
      },
      isCloseAction: Boolean,
      isChoiceMessage: Boolean,
      choiceMessageIds: {
        type: Array,
        default () {
          return []
        },
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
      myMessage: Boolean,
    },
    data () {
      return {
        isDelete: false,
        editedItem: {},
        showDeleteAll: false,
        showActions: false,
        showEdit: false,
        actionPlacement: '',
      }
    },
    computed: {
      payload () {
        return this.$store.getters['chat/data/payload'](this.conversationId)
      },
      profile () {
        return this.$store.getters.user
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      conversation () {
        return this.$store.getters['chat/data/conversation'](this.conversationId)
      },
      conversationProgram () {
        return this.$store.getters['chat/data/conversationProgram'](this.conversationId)
      },
      members () {
        return this.$store.getters['chat/data/members'](this.conversationId)
      },
      employees () {
        return this.$store.getters['chat/data/employees'](this.conversationId)
      },
      realChatName () {
        return this.$store.getters['chat/data/realChatName'](this.conversationId)
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
      isMessageSendNow () {
        const msgTime = new Date(this.item.created_at).getTime()
        const currentDate = this.$moment()
        const msgDate = this.$moment(msgTime).local()
        if (
          this.myMessage &&
          (
            currentDate.diff(msgDate, 'minutes') <= 3 ||
            (
              this.conversation.last_message &&
              this.conversation.last_message.id === this.item.id
            )
          )
        ) return true
        return false
      },
      isChoice () {
        return this.choiceMessageIds.findIndex(id => id === this.item.id) !== -1
      },
      authorName () {
        if (this.conversation && this.conversation.last_message) {
          const item = this.conversation.last_message

          let author = {}
          let isEmployee = false

          if (item.sender_id === this.chatUser.id) isEmployee = true

          if (isEmployee) {
            if (this.realChatName) {
              author = this.getAuthor(item, this.payload)
              if (author.id) {
                if (author.id === this.profile.id) return 'Вы'
                else return `${author.name} (${this.conversationProgram.name})`
              } else if (item.real_sender_id === this.chatUser.id) {
                // реальный отправитель чат-бот
                return this.chatUser.name
              }
            } else {
              author = this.getAuthor(item, this.payload)
              if (author.id) {
                if (author.id === this.profile.id) return 'Вы'
                else return `${this.conversationProgram.name} (${author.name})`
              } else if (item.real_sender_id === this.chatUser.id) {
                // реальный отправитель чат-бот
                return this.chatUser.name
              }
            }
          } else {
            author = this.getAuthor(item, this.payload)
            if (author.id) return `${author.name}`
          }
        }

        return ''
      },
    },
    watch: {
      async showActions (v) {
        if (v) {
          this.$emit('update:isCloseAction', true)
          await this.$nextTick()
          this.showActions = true
          this.$emit('update:isCloseAction', false)
        }

        const headerHeight = document.querySelector('.app--conversation--header').clientHeight
        const actionEl = this.$refs['messageAction' + this.item.id]
        const actionHeight = this.nodeOffsetWH(actionEl, false)
        const MsgOffsetTop = document.getElementById('message-' + this.item.id).parentNode.offsetTop
        if (((MsgOffsetTop - actionHeight) + 60) > headerHeight + 60) {
          this.actionPlacement = 'top'
          actionEl.style.top = (-actionHeight - 13) + 'px'
        } else {
          this.actionPlacement = 'bottom'
          actionEl.style.bottom = (-actionHeight - 13) + 'px'
        }
      },
      isCloseAction (v) {
        if (v) {
          this.hideActions()
        }
      },
      isChoiceMessage (v) {
        if (v) {
          this.choiceMessageIds.splice(0, this.choiceMessageIds.length)
        }
      },
    },
    methods: {
      hideActions () {
        this.showActions = false
      },
      choiceMessage () {
        const choiceMessageIds = this.choiceMessageIds.findIndex(id => id === this.item.id)

        if (choiceMessageIds === -1) {
          this.choiceMessageIds.push(this.item.id)
        } else {
          this.choiceMessageIds.splice(choiceMessageIds, 1)
        }
      },
      openDeleteMessage () {
        this.hideActions()
        this.isDelete = true
        this.editedItem = Object.assign({}, this.item)
        this.showDeleteAll = this.myMessage
      },
      openEditMessage () {
        this.hideActions()
        this.$emit('edit', this.item.id)
      },
      openReplyMessage () {
        this.hideActions()
        this.$emit('reply', this.item.id)
      },
      openForwardMessage () {
        this.hideActions()
        this.$emit('forward', this.item.id)
      },
      openChoiceMessages () {
        this.hideActions()
        this.$emit('update:isChoiceMessage', true)
      },
      copyMessage () {
        navigator.clipboard.writeText(this.item.message)
          .then(() => {
            this.hideActions()
          })
      },
    },
  }
</script>
