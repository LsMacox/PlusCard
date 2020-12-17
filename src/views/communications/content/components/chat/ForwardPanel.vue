<template>
  <base-side-panel
    v-model="innerActiveSidePanel"
    class="side-panel__chat-create forward"
    :width="483"
  >
    <div class="chat-create__header">
      <p class="title-m-bold neutral-900--text">
        Переслать сообщение
      </p>
      <base-text-field
        v-model="search"
        class="field-search"
        placeholder="Поиск участников"
        prepend-inner-icon="$iconify_ion-search-outline"
        clear-icon="$iconify_ion-close-circle-outline"
        :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
        clearable
        hide-details
      />
    </div>
    <div
      class="chat-create__content"
      :style="clients && clients.length ? choosenClients.length ? 'height: calc(100% - 317px)' : 'height: calc(100% - 232px)' : ''"
    >
      <div
        v-if="clients && clients.length"
        class="clients"
      >
        <ul class="clients__list">
          <li
            v-for="client in clientsFiltered"
            :key="client.id"
            class="client__item"
            @click.prevent="forwardMessage(client)"
          >
            <div class="right-block">
              <div class="item-img">
                <img
                  class="avatar"
                  :src="avatars[client.id]"
                  @error="e => e.target.src = img404"
                >
                <div class="online" />
              </div>
              <div class="item-name">
                <p class="body-m-medium neutral-900--text">
                  {{ client.name ? client.name : '-' }} {{ client.lastname ? client.lastname : '' }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="empty"
      >
        <base-empty
          text="Клиенты не найдены :’("
          sub-text="Клиентов для пересылки не найдены!"
        />
      </div>
    </div>
  </base-side-panel>
</template>

<script>
  // mixins
  import MixinIndex from '@/views/communications/mixins/index'

  // other
  import { mapGetters } from 'vuex'
  import FuzzySearch from 'fuzzy-search'

  export default {
    mixins: [MixinIndex],
    model: {
      prop: 'activeSidePanel',
      event: 'changeSidePanel',
    },
    props: {
      activeSidePanel: Boolean,
      messageId: {
        type: [Number, String],
        default: '',
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        search: '',
        sending: false,
        choosenClients: [],
        innerActiveSidePanel: this.activeSidePanel,
      }
    },
    computed: {
      ...mapGetters('company/program', ['programId']),
      messages () {
        console.log('this convId', this.conversationId)
        return this.$store.getters['chat/message/messages'][
          this.conversationId
        ] || {}
      },
      clients () {
        console.log('clients:', this.$store.getters['chat/member/clients'])
        return this.$store.getters['chat/member/clients']
      },
      clientsSearcher () {
        return new FuzzySearch(
          this.clients,
          ['name', 'lastname'],
          {
            caseSensitive: false,
          },
        )
      },
      clientsFiltered () {
        let clients = this.clients
        const search = String(this.search).replace(/\s+/g, ' ').replace(/^\s/g, '')

        if (search && search.length) {
          clients = this.clientsSearcher.search(search.toLowerCase())
        }

        return clients
      },
      selectedTopicId () {
        return this.$store.getters['chat/topic/selectedTopicId']
      },
      conversations () {
        return this.$store.getters['chat/conversation/conversations']
      },
      recipients () {
        return this.$store.getters['chat/message/recipients']
      },
      avatars () {
        const avatars = {}
        this.clients.forEach((c) => {
          avatars[c.id] = c.avatar
        })
        return avatars
      },
    },
    watch: {
      innerActiveSidePanel (v) {
        this.$emit('changeSidePanel', v)
      },
      activeSidePanel (v) {
        this.innerActiveSidePanel = v
      },
    },
    async created () {
      try {
        await this.$store.dispatch('chat/member/list', this.programId)
      } catch (e) {
        this.$notify({
          type: 'error',
          group: 'app',
          title: 'Ошибка',
          text: e.message,
        })
      }
    },
    methods: {
      async forwardMessage (client) {
        if (this.sending) return

        let conversationId = this.conversations.filter(c => c.activeMembers.length === 2)
        conversationId = conversationId.filter(c => {
          return c.activeMembers.findIndex(a => a.id === client.id) !== -1
        })[0].id

        try {
          this.sending = true
          const message = new FormData()
          console.log({
            uid: this.$uuid(),
            current_conversation_id: this.conversationId,
            send_conversation_id: conversationId,
            message_id: this.messageId,
            message: this.messages[this.messageId],
            clients: this.clients,
            conversations: this.conversations,
          })

          message.set('uid', this.$uuid())
          message.set('conversation_id', conversationId)
          if (this.messageId) {
            message.set('message_id', this.messageId)
            message.set('message', '')
          }

          if (this.selectedTopicId) {
            message.append('topic_id', this.selectedTopicId)
          }

          // recipients
          let recipients = []
          recipients = Array.from(new Set(this.recipients))

          // recipients
          for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i]
            message.append('recipients[' + i + ']', recipient)
          }

          // attach files
          if (Array.isArray(this.formDataFiles)) {
            for (let i = 0; i < this.formDataFiles.length; i++) {
              const file = this.formDataFiles[i]
              message.append('files[' + i + ']', file)
            }
          }

          await this.$store.dispatch('chat/message/send', { type: 'forward', message })
        } catch (e) {
          console.error('send', e)
        } finally {
          this.sending = false
          this.innerActiveSidePanel = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
