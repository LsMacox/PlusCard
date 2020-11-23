<template>
  <div style="display: flex; width: 100%;">
    <div class="app--conversation--list--card">
      <div class="app--conversationn--list--avatar--wrapper">
        <div class="list-avatar">
          <img
            v-for="(avatar, i) in getAvatars(conversation)"
            :key="i"
            :src="avatar"
            class="list-avatar-img"
            @error="e => e.target.src = img404"
          >
        </div>
      </div>
      <div class="app--conversation--list--card--content--wrapper">
        <div class="app--conversation--list--card--content">
          <div class="app--conversation--list--card--top--line">
            <div class="app--conversation--list--card-name">
              {{ (conversation.display_name ? conversation.display_name : getName(conversation)) }}
            </div>
            <!-- <div
              v-if="conversation.muted"
              class="app--conversation--list--card--mute"
            >
              <img src="@/assets/chat/list_volume_off.svg">
            </div> -->
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
            :class="[getAuthorName(conversation) == 'Вы' ? 'blueAuthor' : '']"
          >
            {{ (getAuthorName(conversation) + ': ' + getLastMessage(conversation)) }}
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
            <p class="body-s-semibold neutral-100--text">
              {{ conversation.unread_count }}
            </p>
          </div>
          <div
            v-else-if="conversation.chosen"
            class="app--conversation--list--card--favorite"
          >
            <i class="fas fa-star" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // mixins
  import Formater from '@/views/communications/mixins/index.js'
  // components
  import AppTyping from './typing/TypingConversationList'

  export default {
    components: {
      AppTyping,
    },
    mixins: [Formater],
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
        img404: 'https://storage.yandexcloud.net/plusstorage/users/avatars/default.png',
      }
    },
    computed: {
      activeMembers () {
        return this.conversation.members.filter((item) => item.active)
      },
      program () {
        return this.$store.getters.program
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
      isMemberClient (memberId) {
        return memberId !== this.chatUser.id
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      // TEMPLATE
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

          // Group Avatar
          if (count > 2) avatars = [this.getGroupImgData(item)]
        }

        return avatars
      },
      getGroupImgData (item) {
        const
          imgColor = '#D63DE5'
        const imgWidth = 48
        const imgHeight = 48

        const
          cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')

        cvs.width = imgWidth
        cvs.height = imgHeight
        cvs.style.display = 'block'

        // Fill background
        ctx.moveTo(0, 0)
        ctx.lineTo(imgWidth, 0)
        ctx.lineTo(imgWidth, imgHeight)
        ctx.lineTo(0, imgHeight)
        ctx.fillStyle = imgColor
        ctx.fill()

        // Draw font
        ctx.fillStyle = '#fff'
        ctx.font = '700 28px Gilroy'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (item.name) ctx.fillText(item.name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)
        if (item.display_name) ctx.fillText(item.display_name.charAt(0).toUpperCase(), imgWidth / 2, imgHeight / 2 + 1)

        const imgData = cvs.toDataURL()
        cvs.remove()
        return imgData
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
      formatStatus (status) {
        if (status === 'sending') return 'Отправлено'
        if (status === 'delivered') return 'Доставлено'
        if (status === 'seen') return 'Просмотрено'
        return status
      },
      async toAccount (id) {
        if (!this.isMemberClient(id)) return
        this.$notify('TODO go to account form')

        // this.$notify({
        //    group: 'api',
        //       message: 'Размер файла превышает 30 МБ',
        //       type: 'error',
        //        title: 'Ошибка',
        //     })

        // this.$store.dispatch('account/account/getUserAccount', { programId: this.program.id, userId: id }).then((accountId) => {
        //   // TODO
        //   console.log('accountId', accountId)
        //   if (accountId) {
        //     const href = '/accounts/client/' + accountId
        //     window.open(href, '_blank')
        //   }
        // })
      },
    },
  }
</script>
