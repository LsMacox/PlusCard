<template>
  <div style="display: flex; width: 100%;">
    <div class="app--conversation--list--card">
      <div class="app--conversationn--list--avatar--wrapper">
        <v-menu
          open-on-hover
          top
          offset-y
        >
          <div>
            <div style="display: flex; padding-bottom: 10px;">
              <div>Участники чата</div>
            </div>
            <div>
              <div
                v-for="(member, i) in conversation.members"
                :key="i"
              >
                <div
                  v-if="member.active"
                >
                  <div
                    v-if="member.id !== chatUser.id"
                    style="display: inline; padding-top: 5px; color: #409EFF; border-bottom: 1px dotted #409EFF; cursor:pointer;"
                    @click="toAccount(member.id)"
                  >
                    {{ member.name }}
                  </div>
                  <div
                    v-else
                  >
                    {{ member.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-slot:activator="{on}">
            <div
              class="list-avatar"
              v-on="on"
            >
              <img
                v-for="(avatar, i) in getAvatars(conversation)"
                :key="i"
                :src="avatar"
                class="list-avatar-img"
                :style="
                  'position: absolute;' +
                    'left: ' +
                    14 * i +
                    'px;' +
                    'z-index: ' +
                    (0 + i) +
                    ';'
                "
              >
            </div>
          </template>
        </v-menu>
      </div>
      <div class="app--conversation--list--card--content--wrapper">
        <div class="app--conversation--list--card--content">
          <div class="app--conversation--list--card--top--line">
            <div
              v-if="conversation.chosen"
              class="app--conversation--list--card--favorite"
            >
              <i class="fas fa-star" />
            </div>

            <div class="app--conversation--list--card-name">
              {{ conversation.display_name ? conversation.display_name : getName(conversation) }}
            </div>
            <div
              v-if="conversation.muted"
              class="app--conversation--list--card--mute"
            >
              <img src="@/assets/chat/list_volume_off.svg">
            </div>
          </div>

          <div
            v-if="typing && typing.conversation_id == conversationId"
            style="margin-top:2px;"
          >
            <app-typing
              :conversation-id="conversationId"
            />
          </div>
          <div
            v-else
            class="app--conversation--list--card--bottom--line"
            :class="[getAuthorName(conversation) != 'Вы' ? 'blueAuthor' : '']"
          >
            {{ getAuthorName(conversation) }}:<br>
            {{ getLastMessage(conversation) }}
          </div>
        </div>

        <div class="app--conversation--list--card--info">
          <div class="app--conversation--list--card--date">
            {{ getLastTime(conversation) }}
          </div>
          <div
            v-if="conversation && conversation.unread_count"
            class="app--conversation--list--card--unread"
          >
            {{ conversation.unread_count }}
          </div>
          <div
            v-else
            style="height: 22px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppTyping from './TypingConversationList'

  export default {
    components: {
      AppTyping,
    },
    props: {
      conversationType: {
        type: [Number, String],
        default: 'business',
        required: true,
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {

      }
    },
    computed: {

      program () {
        return this.$store.getters['brand/program/program']
      },
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
      messages () {
        return this.$store.getters['chat/message/messages'][this.conversationId] // id чата
      },
      typing () {
        return this.$store.getters['chat/message/typing']
      },
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      // TEMPLATE
      getClass (id) {
        if (id === this.conversationId) return 'list-item list-item-active'
        return 'list-item'
      },
      getAvatars (item) {
        let avatars = []

        // есть чат пользователь
        if (this.chatUser && this.chatUser.id) {
          const chatUserId = this.chatUser.id
          let count = 0

          // количество активных участников чата
          item.members.forEach(item => {
            if (item.active) count++
          })

          if (count === 1) {
            avatars = [item.members[0].avatar]
          }

          if (count === 2) {
            const member = item.members.filter(item => item.id !== chatUserId)
            if (member.length) {
              avatars = [member[0].avatar]
            }
          }

          if (count > 2) {
            // console.log('count > 2')

            // нет последнего сообщения
            if (!item.last_message) {
              // console.log('my last message')

              item.members.forEach(item => {
                if (avatars.length < 3) {
                  avatars.unshift(item.avatar)
                }
              })

              // есть последнее сообщение
            } else {
              const lastSender = item.last_message.sender_id

              // аватар последнего написавшего и первый в массиве
              const firstAvatar = item.members.filter(
                item => item.id === lastSender,
              )
              if (firstAvatar.length) avatars.unshift(firstAvatar[0].avatar)

              // не более 3-х аватаров
              item.members.forEach(item => {
                if (avatars.length < 3 && item.id !== lastSender) {
                  // console.log('avatars now', avatars);
                  avatars.unshift(item.avatar)
                }
              })
            }
          }
        }

        return avatars
      },
      getName (item) {
        let name = ''
        if (this.chatUser && !this.isEmptyObject(this.chatUser)) {
          const chatUserId = this.chatUser.id

          // чат пользователь - создатель чата
          if (item.name && chatUserId === item.creator_id) return item.name

          // количество активных участников чата
          let count = 0
          item.members.forEach(item => {
            if (item.active) count++
          })
          if (count === 1) {
            name = item.members[0].name
          }
          if (count === 2) {
            const member = item.members.filter(item => item.id !== chatUserId)
            if (member.length) {
              name = member[0].name
            }
          }
          if (count > 2) {
            if (item.name) return item.name
            item.members.forEach(item => {
              if (item.id !== chatUserId && item.active) {
                if (!name) name = item.name
                else name = name + ', ' + item.name
              }
            })
          }
        }
        return name
      },
      getLastTime (item) {
        let time = ''
        if (item.last_message) {
          time = item.last_message.created_at
          if (time) return this.getDate(time)
        }
        return time
      },
      getAuthorName (conversation) {
        if (conversation && conversation.last_message) {
          const item = conversation.last_message

          let author = {}
          let isEmployee = false

          if (item.sender_id === this.chatUser.id) isEmployee = true

          if (isEmployee) {
            if (this.realChatName) {
              author = this.getAuthor(item)
              if (author.id) {
                if (author.id === this.profile.id) return 'Вы'
                else return `${author.name} (${this.conversationProgram.name})`
              } else if (item.real_sender_id === this.chatUser.id) {
                // реальный отправитель чат-бот
                return this.chatUser.name
              }
            } else {
              author = this.getAuthor(item)
              if (author.id) {
                if (author.id === this.profile.id) return 'Вы'
                else return `${this.conversationProgram.name} (${author.name})`
              } else if (item.real_sender_id === this.chatUser.id) {
                // реальный отправитель чат-бот
                return this.chatUser.name
              }
            }
          } else {
            author = this.getAuthor(item)
            if (author.id) return `${author.name}`
          }
        }

        return 'Пользователь'
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
      getLastMessage (item) {
        const message = item.last_message
        if (message) {
          // console.log(message)
          if (message && message.attachments.length) {
            if (message.attachments[0].type === 'message/text') { return message.attachments[0].content }
            if (message.attachments[0].type === 'plus/account') return 'карта'
            if (message.attachments[0].type === 'media/image') { return 'изображение' }
            if (message.attachments[0].type === 'media/audio') { return 'аудиосообщение' }
            if (message.attachments[0].type === 'media/video') return 'видео'
            if (message.attachments[0].type === 'media/file') return 'файл'
          }
          return message.message
        }
        return ''
      },
      formatMessage (message) {
        let str = JSON.parse(message)
        let pos = 0
        while (true) {
          const foundPos = str.indexOf('\n', pos)
          if (foundPos !== -1) str = str.replace('\n', '<br>')
          if (foundPos === -1) break
          pos = foundPos
        }
        return str
      },
      getDate (date) {
        if (!date) return '-'
        const time = Date.parse(date)
        // let time = new Date(date).getTime()
        const offset = new Date().getTimezoneOffset()
        // offset 0
        const messageDate = new Date(time + offset * 0 * 60 * 1000)
        const currentDate = new Date()
        let options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          // hour: 'numeric',
          // minute: 'numeric'
        }
        if (
          currentDate.getDate() === messageDate.getDate() &&
          currentDate.getMonth() === messageDate.getMonth() &&
          currentDate.getFullYear() === messageDate.getFullYear()
        ) {
          options = {
            hour: 'numeric',
            minute: 'numeric',
          }
        }
        if (
          currentDate.getDate() - messageDate.getDate() === 1 &&
          currentDate.getMonth() === messageDate.getMonth() &&
          currentDate.getFullYear() === messageDate.getFullYear()
        ) {
          options = {
            hour: 'numeric',
            minute: 'numeric',
          }
          return 'Вчера в ' + messageDate.toLocaleString('ru', options)
        } else {
          return messageDate.toLocaleString('ru', options)
        }
      },
      formatStatus (status) {
        if (status === 'sending') return 'Отправлено'
        if (status === 'delivered') return 'Доставлено'
        if (status === 'seen') return 'Просмотрено'
        return status
      },
      async toAccount (id) {
        this.$store.dispatch('account/account/getUserAccount', { programId: this.program.id, userId: id }).then((accountId) => {
          // TODO
          console.log('accountId', accountId)
          if (accountId) {
            const href = '/accounts/client/' + accountId
            window.open(href, '_blank')
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
    .list {
        border-radius: 5px;
        background-color: #ffffff;
        height: calc(100vh - 172px);
        overflow-y: scroll;
        overflow-x: hidden;
    }
    /* conversation scrool-y */
    .scroll-y::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #f5f5f5;
    }

    .scroll-y::-webkit-scrollbar {
        width: 5px;
        background-color: #f5f5f5;
    }

    .scroll-y::-webkit-scrollbar-thumb {
        background-color: #00d3ef;
        border: 2px solid #00d3ef;
    }
</style>

<style lang="scss" scoped>
    .app--conversation--list--card{
        display: flex;
        flex-direction: row;
        width: 351px;
        height: 75px;

        .app--conversationn--list--avatar--wrapper {
            width: 83px;
            padding-left: 12px;
            margin-right: 14px;
            margin-top: 10px;
        }

        .app--conversation--list--card--top--line {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            width: 145px;
            margin-top: 17px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            .app--conversation--list--card--favorite{
                margin-right: 4px;
                width: 15px;
                height: 14px;

                & > i{
                    color: #F5CB47;
                    width: 15px;
                    height: 14px;
                }
            }

            .app--conversation--list--card-name{
                Font-family: SF Pro Rounded, sans-serif;
                font-style: normal;
                font-weight: bold;
                font-size: 14px;
                line-height: 17px;
                color: #686868;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

            }

            .app--conversation--list--card--mute{
                margin-left: 6px;
                & > img{
                    height: 12px;
                    width: 12px;
                }
            }
        }

        .app--conversation--list--card--content--wrapper {
            width: 268px;
            padding-left: 14px;
            padding-right: 16px;
            border-bottom: 1px solid #EBEBEB;

            .app--conversation--list--card--content{
                float:left;
                width: 155px;

                .app--conversation--list--card--bottom--line {
                    font-size: 10px;
                    line-height: 12px;
                    color: #7D7D7D;
                    margin-top: 2px;
                    height: 25px;
                    width: 176px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .app--conversation--list--card--bottom--line.blueAuthor{
                    color: #4583AC;
                }
            }
        }

        .app--conversation--list--card--info {
            font-size: 10px;
            line-height: 12px;
            float:right;

            .app--conversation--list--card--date {
                width: 70px;
                height: 22px;
                margin-top: 10px;
                font-style: normal;
                font-weight: bold;
                font-size: 10px;
                line-height: 30px;
                flex-direction: column-reverse;
                align-items: end;
                text-align: right;
                color: #7D7D7D;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .app--conversation--list--card--unread {
                background: #169AC7;
                width: 20px;
                height: 20px;
                text-align: center;
                align-self: flex-end;
                font-size: 13px;
                line-height: 21px;
                color: #fff;
                font-weight: 500;
                border-radius: 50%;
                float: right;
                margin-top: 4px;
            }
        }
    }

    .list-avatar {
        position: relative;
        width: 55px;
        height: 55px;
    }

    .list-avatar-img {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        border: 3px solid #EBEBEB;
        background-color: #ffffff;
    }

    .list-empty {
        padding: 20px;
        text-align: center;
    }

</style>
