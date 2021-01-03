<template>
  <div style="display: flex; width: 100%;">
    <div class="app--conversation--list--card">
      <div class="app--conversationn--list--avatar--wrapper">
        <div class="list-avatar">
          <img
            :src="avatar"
            class="list-avatar-img"
            @error="e => e.target.src = img404"
          >
          <div
            v-if="conversation.creator_last_activity && isOnline(conversation.creator_last_activity)"
            class="online"
          />
        </div>
      </div>
      <div class="app--conversation--list--card--content--wrapper">
        <div class="app--conversation--list--card--content">
          <div
            class="app--conversation--list--card--top--line"
            :style="(!authorName.length && isGroup) || (!lastMessage && !isGroup) ? 'margin-top: 29px' : ''"
          >
            <div class="app--conversation--list--card-name">
              {{ (conversation.display_name ? conversation.display_name : name) }}
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
            :class="[authorName == 'Вы' ? 'blueAuthor' : '']"
          >
            {{ (authorName.length ? authorName + ': ' : '') }}
            <span v-html="removeCarry(lastMessage)" />
          </div>
        </div>

        <div class="app--conversation--list--card--info">
          <div class="app--conversation--list--card--date">
            {{ lastTime }}
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
            v-else
            class="bottom-block"
          >
            <div
              v-if="conversation.muted"
              class="app--conversation--list--card--muted"
            >
              <iconify-icon
                class="icon-muted"
                icon="feather-volume"
                width="21"
              />
            </div>
            <div
              v-if="conversation.chosen"
              class="app--conversation--list--card--favorite"
            >
              <i class="fas fa-star" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // components
  import AppTyping from './components/chat/Typing'

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
      return {}
    },
    methods: {
      isMemberClient (memberId) {
        return memberId !== this.chatUser.id
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
