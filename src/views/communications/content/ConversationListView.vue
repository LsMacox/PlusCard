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
  // components
  import AppTyping from './typing/TypingConversationList'

  // mixins
  import MixinTemplate from '../mixins/conversation-list-view/template.js'
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-list-view/data.js'

  export default {
    components: {
      AppTyping,
    },
    mixins: [
      MixinTemplate,
      MixinIndex,
      MixinData,
    ],
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
      isGroup () {
        return this.activeMembers.length > 2
      },
      activeMembers () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.members.filter(item => item.active)
        return []
      },
    },
    methods: {
      isMemberClient (memberId) {
        return memberId !== this.chatUser.id
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
