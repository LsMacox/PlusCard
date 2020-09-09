<template>
  <div
    class="message-line"
  >
    <div
      v-if="myMessage"
      class="app--spacer"
    />

    <div class="message-block">
      <div
        v-if="!myMessage"
        class="message-author-avatar"
        :style="`background: url('${getAuthorAvatar(item)}');`"
      />

      <div
        :style="myMessage ? 'width: calc(100% - 15px); margin-right: 15px; ' : 'width: calc(100% - 50px);'"
      >
        <div class="message-author">
          {{ getAuthorName(item) }}
        </div>

        <div
          class="message-box"
          :style="getMessageBoxStyle()"
          @mouseenter="showMenu(item, $event)"
          @mouseleave="hideMenu(item, $event)"
        >
          <!-- message menu мое -->
          <div
            v-if="myMessage"
            :id="'message' + item.id"
            class="message-menu-my"
            style="display: none; height: 60px;"
          >
            <div class="message-menu-my-icons">
              <el-tooltip
                class="item"
                effect="dark"
                content="Удалить"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-my-icon1"
                  @click="openDelete(item, true)"
                >
                  delete_sweep
                </v-icon>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Переслать"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-my-icon2"
                  @click="openForwardMessage(item)"
                >
                  reply_all
                </v-icon>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Ответить"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-my-icon2"
                  @click="openReplyMessage(item)"
                >
                  reply
                </v-icon>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Редактировать"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-my-icon2"
                  @click="openUpdate(item)"
                >
                  create
                </v-icon>
              </el-tooltip>
            </div>
          </div>

          <!-- message menu другое -->
          <div
            v-if="!myMessage"
            :id="'message' + item.id"
            class="message-menu-other"
            style="display: none; height: 60px;"
          >
            <div class="message-menu-other-icons">
              <el-tooltip
                class="item"
                effect="dark"
                content="Удалить"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-other-icon1"
                  @click="openDelete(item, false)"
                >
                  delete_sweep
                </v-icon>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Переслать"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-other-icon2"
                  @click="openForwardMessage(item)"
                >
                  reply_all
                </v-icon>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Ответить"
                placement="top"
                :open-delay="$Config.tooltipButtonDelay"
              >
                <v-icon
                  class="message-menu-other-icon2"
                  @click="openReplyMessage(item)"
                >
                  reply
                </v-icon>
              </el-tooltip>
            </div>
          </div>

          <!-- цитата -->
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
                v-html="formatMessage(item.parent_message.message)"
              />
            </div>
          </div>

          <!-- сообщение -->
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

            <!-- текст сообщения -->
            <div
              v-if="item.message"
              class="message-box-text chat-scroll-x"
              v-html="formatMessage(item.message)"
            />
          </div>

          <div
            v-if="myMessage"
            class="message-box-footer"
          >
            <div class="app--spacer" />

            <div class="message-time">
              {{ getDate(item.created_at) }}
            </div>

            <div class="message-box-read">
              <div v-if="item.delivered && item.read">
                <i
                  class="fas fa-check message-box-check2"
                  style="position:relative;left: 8px;"
                />
                <i class="fas fa-check message-box-check" />
              </div>
              <div v-else-if="item.delivered && !item.read">
                <i class="fas fa-check message-box-check" />
              </div>
            </div>
          </div>

          <div
            v-if="!myMessage"
            class="message-box-footer-other"
          >
            <div class="message-time-other">
              {{ getDate(item.created_at) }}
            </div>
            <div class="app--spacer" />
          </div>

          <!-- тема -->
          <div
            v-if="item.topic_name"
            class="dialog-topic"
          >
            Тема: {{ item.topic_name }}
          </div>

          <div
            v-if="item.recipients"
            class="message-box-recipients"
          >
            <div
              v-for="(member, i) in recipients"
              :key="i"
            >
              <el-tooltip
                :content="member.name"
                placement="top"
                :open-delay="$Config.tooltipDelay"
              >
                <img
                  :src="member.avatar"
                  alt=""
                  class="message-box-recipients-avatars"
                >
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!myMessage"
      class="app--spacer"
    />

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
  import AppMessageUpdate from '../MessageUpdate'
  import AppMessageDelete from '../MessageDelete'
  //
  import AppAttachmentText from '../AttachmentText'
  import AppAttachmentAccount from '../AttachmentAccount'
  import AppAttachmentDeleted from '../AttachmentDeleted'
  import AppAttachmentFile from '../AttachmentFile'
  import AppAttachmentImage from '../AttachmentImage'
  import AppAttachmentAudio from '../AttachmentAudio'
  import AppAttachmentVideo from '../AttachmentVideo'
  import AppAttachmentPurchase from '../AttachmentPurchase'

  export default {
    components: {
      AppMessageUpdate,
      AppMessageDelete,
      //
      AppAttachmentText,
      AppAttachmentAccount,
      AppAttachmentDeleted,
      AppAttachmentFile,
      AppAttachmentImage,
      AppAttachmentAudio,
      AppAttachmentVideo,
      AppAttachmentPurchase,
    },
    props: {
      item: Object,
      conversationId: String | Number,
      myMessage: Boolean,
      dialogReplyMessage: Boolean,
      quotedMessage: Object,
      quotedMessageSender: String,
      sendType: String,
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
        const conversation = this.$store.getters['chat/conversation/conversations'].filter(item => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.members
        return []
      },
      recipients () {
        if (this.item.recipients) {
          const array = this.conversation.members.filter(item => this.item.recipients.indexOf(item.id) !== -1 && item.id !== this.chatUser.id)
          return array
        } else {
          return []
        }
      },
      conversationProgram () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.program
        return {}
      },
      employees () {
        if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.chat_members
        return []
      },
      realChatName () {
        if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.real_chat_name
        return false
      },
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      getMessageBoxStyle () {
        if (this.myMessage) {
          return 'background-color: #169AC7; color: #ffffff; border-radius: 5px 5px 0 5px; word-break: break-word;'
        }
        return 'background-color: #f4f3f7; color: #181818; border-radius: 5px 5px 5px 0; word-break: break-word;'
      },
      getAuthorName (item) {
        let author = {}
        let isEmployee = false

        if (item.sender_id === this.chatUser.id) isEmployee = true

        // console.log(isEmployee)

        if (isEmployee) {
          author = this.getAuthor(item)
          if (author.id) return `${this.conversationProgram.name} (${author.name})`
          // реальный отправитель чат-бот
          else if (item.real_sender_id === this.chatUser.id) {
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
          author = this.employees.filter(item => item.id === authorId)
          if (author.length) return author[0]
        } else {
          authorId = item.sender_id
          author = this.members.filter(item => item.id === authorId)
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
            const link = '<a target="_blank" href="' + matchString[0] + '">' + matchString[0] + '"</a> '
            str = str.replace(matchString[0], link)
            // console.log('string with Link', str);
          }
          return str
        }
        return null
      },
      getDate (date) {
        if (!date) return '-'
        const messageDate = new Date(date)
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }
        return messageDate.toLocaleString('ru', options)
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

<style lang="scss" scoped>
    .message-line {
        display: flex;
        width: 100%;
        margin: 15px 0;

        .message-author-avatar {
            margin: 0 5px 0 15px;
            width: 30px;
            height: 30px;
            border-radius: 30px;
            background-repeat: no-repeat !important;
            background-size: cover !important;
            background-position: center !important;
        }

        .message-block {
            position: relative;
            display: flex;
            align-items: flex-end;
            max-width: 60%;

            .message-author {
                font-size: 13px;
                color: #9E9E9E;
                margin-bottom: 3px;
            }

            .message-box {
                position: relative;
                padding: 10px;
                word-break: break-word;

                /* меню сообщения мое */
                .message-menu-my {
                    position: absolute;
                    top: 0;
                    left: -130px;
                    width: 130px;
                    /*border: 1px solid #000000;*/
                    z-index: 3;

                    .message-menu-my-icons {
                        position: absolute;
                        top: 50%;
                        right: 5px;
                        margin-top: 7px;
                    }

                    .message-menu-my-icon1 {
                        font-size: 23px;
                        color: #bac5d2;
                        cursor: pointer;
                    }

                    .message-menu-my-icon1:hover {
                        color: #96a2b1;
                    }

                    .message-menu-my-icon2 {
                        margin-right: 5px;
                        font-size: 20px;
                        color: #bac5d2;
                        cursor: pointer;
                    }

                    .message-menu-my-icon2:hover {
                        color: #96a2b1;
                    }
                }

                /* меню сообщения другое */
                .message-menu-other {
                    position: absolute;
                    top: 0;
                    right: -60px;
                    width: 60px;
                    /*border: 1px solid #000000;*/
                    z-index: 3;

                    .message-menu-other-icons {
                        display: flex;
                        position: absolute;
                        top: 50%;
                        left: 5px;
                        margin-top: 7px;
                    }

                    .message-menu-other-icon1 {
                        font-size: 23px;
                        color: #bac5d2;
                        cursor: pointer;
                    }

                    .message-menu-other-icon1:hover {
                        color: #96a2b1;
                    }

                    .message-menu-other-icon2 {
                        margin-right: 5px;
                        font-size: 20px;
                        color: #bac5d2;
                        cursor: pointer;
                    }

                    .message-menu-other-icon2:hover {
                        color: #96a2b1;
                    }
                }

                /* блок цитаты */
                .message-box-quote {
                    padding: 15px;
                    border-radius: 5px 5px 0 0;
                    background-color: #c0c0c0;
                }

                /* блок текста сообщения */
                .message-box-text {
                    font-size: 13px;
                    text-align: left;
                    overflow: auto;
                    & > a{
                        color: #1f2a2e;
                        &:hover{
                            text-decoration: underline;
                        }
                    }
                }

                .chat-scroll-x {

                }

                /* блок сообщения */
                .message-box-message {

                    .message-box-message-attachment {
                        margin-bottom: 5px;
                    }
                }

                .message-box-footer {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                    font-size: 11px;
                    line-height: 11px;

                    .message-box-read {
                        width: 26px;
                        height: 11px;
                        font-size: 11px;
                        line-height: 11px;
                        text-align: right;

                        .message-box-check {
                            height: 10px;
                        }

                        .message-box-check2 {
                            height: 10px;
                            position: relative;
                            left: 8px;
                        }
                    }

                    .message-time-other {

                    }
                }

                .message-box-footer-other {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                    font-size: 11px;
                    line-height: 11px;

                    .message-time-other {

                    }
                }
            }
        }
    }

    .message-box-author{
        text-decoration: underline;
        margin-bottom: 10px;
    }

    .message-box-recipients {
        display: flex;
        flex-direction: row;
        position: relative;
        top: 15px;
    }

    img.message-box-recipients-avatars {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: 3px;
        cursor: pointer;
    }

</style>

<style>
    /*.v-application a{
        color: #000;
    }*/
    .message-box-text.chat-scroll-x a {
        color: #343434;
    }
</style>
