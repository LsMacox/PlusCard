<template>
  <div class="layout layout-cabinet">
    <app-menu-drawer />
    <app-view />
  </div>
</template>

<script>
  export default {
    components: {
      AppMenuDrawer: () => import('./components/AppMenuDrawer/index'),
      AppView: () => import('./components/AppView'),
    },
    data: () => ({
      expandOnHover: false,
    }),
    computed: {
      loadingApp () {
        return this.$store.getters.loadingApp
      },
    },
    async created () {

    },
    methods: {
      async socketOn (data) {
        // console.log('socketOn', data)
        // console.log(data)

        // токен чат-пользователя для операций с чатами
        const currentConversationId = this.$store.getters['chat/conversation/currentConversationId']

        // подтверждение получение данных
        if (JSON.stringify(data) !== '{}' && data.command !== '/connect/redis') {
          if (data.redis_queue !== ':typing') {
            const confirm = {
              redis_queue: data.redis_queue,
              // channel_user_id: data.channel_user_id,
              guid: data.guid,
              confirm: true,
            }
            this.$store.dispatch('auth/redis/confirm', confirm)
          }
        }

        /*
         * MESSAGE
         */

        // получили сообщение
        if (data.command === '/message/send') {
          const message = data.data.data

          // добавляем новое сообщение в массив сообщений
          this.$store.commit('chat/message/addInMessages', message)

          // добавляем новое сообщение как последнее в списке чатов
          this.$store.commit('chat/conversation/addInLast', message)

          // отправляем на отметку delivered
          const conversationId = message.conversation_id
          const delivered = {
            conversation_id: conversationId,
            messages: [message.id],
          }
          this.$store.dispatch('chat/message/deliveredStatus', delivered)

          // отправляем на отметку read

          // если активный диалог
          if (conversationId === currentConversationId) {
            const read = {
              conversation_id: conversationId,
              messages: [message.id],
            }
            this.$store.dispatch('chat/message/readStatus', read)
            // добавляем в unread_count
          } else {
            this.$store.commit('chat/conversation/addUnreadCount', conversationId)
          }
        }

        // обновляем статус delivered в messages
        if (data.command === '/message/delivered') {
          const messages = data.data.data

          // обновляем статус
          if (messages.length) {
            const conversationId = messages[0].conversation_id
            const delivered = {
              conversation_id: conversationId,
              data: messages,
            }
            this.$store.dispatch('chat/message/status', delivered)
          }
        }

        // обновляем статус read в messages
        if (data.command === '/message/read') {
          const messages = data.data.data

          // обновляем статус
          if (messages.length) {
            const conversationId = messages[0].conversation_id

            // если активный диалог
            if (conversationId === currentConversationId) {
              const read = {
                conversation_id: conversationId,
                data: messages,
              }
              this.$store.dispatch('chat/message/status', read)
            }
          }
        }

        // обновляем сообщение в массиве messages
        if (data.command === '/message/update') {
          const message = data.data.data
          this.$store.commit('chat/message/updateInMessages', message)
        }

        // удаляем сообщение из массива messages
        if (data.command === '/message/delete/all') {
          const message = data.data.data
          this.$store.commit('chat/message/deleteInMessages', message)
        }

        // событие typing
        if (data.command === '/message/typing') {
          const typingEvent = data.data.data
          const typing = {
            conversation_id: typingEvent.conversation_id,
            sender_id: typingEvent.sender_id,
          }
          this.$store.commit('chat/message/typing', typing)
        }

        /*
         * CONVERSATION
         */

        // событие conversation/create
        if (data.command === '/conversation/create') {
          const conversationId = data.data.data.id
          this.$store.dispatch('chat/conversation/read', conversationId).then(() => {
            const conversation = {
              id: conversationId,
              offset: 0,
              limit: 20,
            }

            this.$store.dispatch('chat/message/list', conversation)
          })
        }

        // событие conversation/update
        if (data.command === '/conversation/update') {
          const conversationId = data.data.data.id
          this.$store.dispatch('chat/conversation/read', conversationId)
        }

        // событие conversation/delete
        if (data.command === '/conversation/delete') {
          const conversationId = data.data.data.id
          this.$store.commit('chat/conversation/deleteInConversations', conversationId)
          if (currentConversationId === conversationId) {
            this.$store.commit('chat/conversation/conversationSort')
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.layout {
  // height: 100%;
}
</style>
