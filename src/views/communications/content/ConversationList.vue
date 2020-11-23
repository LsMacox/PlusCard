<template>
  <div class="app--chat--list">
    <div id="app--conversation--list--container">
      <div class="app--conversation--list--header">
        <!--
            <div class="app--conversation--list--buttons">
                <div class="app--conversation--list--button--wrapper">
                    <button @click="switchChatList('business')" :class="['app--conversation--list--button', 'app--conversation--list--button--clients',conversationType=='business'?'app--conversation--list--button--active':'']">Клиенты</button>
                    <span class="app--conversation--list--button--badge" v-if="sumUnreadCount(conversations_business) > 0">{{sumUnreadCount(conversations_business) < 100 ? sumUnreadCount(conversations_business) : '99+'}}</span>
                </div>
                <div class="app--conversation--list--button--wrapper">
                    <button @click="switchChatList('merchant')" :class="['app--conversation--list--button', 'app--conversation--list--button--workers',conversationType=='merchant'?'app--conversation--list--button--active':'']">Сотрудники</button>
                    <span class="app--conversation--list--button--badge" v-if="sumUnreadCount(conversations_merchant) > 0">{{sumUnreadCount(conversations_merchant) < 100 ? sumUnreadCount(conversations_merchant) : '99+'}}</span>
                </div>
            </div>
            -->
        <v-row justify="space-between">
          <v-col>
            <base-text-field
              v-model="search"
              class="field-search"
              placeholder="Поиск чатов"
              prepend-inner-icon="$iconify_ion-search-outline"
              clear-icon="$iconify_ion-close-circle-outline"
              :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="auto d-flex align-center">
            <v-tooltip
              :open-delay="$config.tooltipButtonDelay"
              top
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="btn-add-chat"
                  color="primary"
                  fab
                  :loading="chatMemberListAction"
                  v-on="on"
                  @click="openCreate()"
                >
                  <v-icon
                    color="neutral-100"
                    size="15"
                  >
                    $iconify_eva-plus-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Начать переписку</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>

      <v-skeleton-loader
        :loading="loadingConversations"
        :style="{ height: '100%', width: '100%', position: 'relative' }"
        type="list-item-avatar-two-line@8"
      >
        <div class="app--conversation--content">
          <div
            v-if="groupedConversation.length"
            id="conversationList"
            class="app--conversation--list"
          >
            <div
              v-for="(item, i) in groupedConversation"
              :key="i"
              :class="getClass(item.id)"
              @click="conversationChat(item.id)"
            >
              <conversation-list-view
                :conversation-type="currentConversationType"
                :conversation-id="item.id"
              />
            </div>
          </div>
          <div
            v-else
            style="width: 100%"
          >
            <div
              class="list-empty"
              style="width: 100%"
            >
              Чаты не найдены
            </div>
          </div>
        </div>
        <div class="app--conversation--setting">
          <v-btn
            class="btn-setting"
            color="primary-100"
          >
            <iconify-icon
              class="icon-setting"
              icon="feather-settings"
              width="21"
            />
            <p class="body-m-semibold primary--text">
              Настроить чаты
            </p>
          </v-btn>
        </div>
      </v-skeleton-loader>

      <chat-create
        v-if="dialogCreate"
        :dialog.sync="dialogCreate"
      />
    </div>
  </div>
</template>

<script>
  import ConversationListView from './ConversationListView'
  import ChatCreate from './components/chat/ChatCreate'

  import FuzzySearch from 'fuzzy-search'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ChatCreate,
      ConversationListView,
    },
    data () {
      return {
        dialogCreate: false,
        chatMemberListAction: false,
        search: null,
      }
    },
    computed: {
      ...mapGetters('company/program', ['program', 'programId']),
      ...mapGetters('chat/member', ['clients']),
      loadingConversations: {
        get () {
          return this.$store.getters['chat/conversation/loadingConversations']
        },
        set (v) {
          this.$store.commit('chat/conversation/loadingConversations', v)
        },
      },
      currentConversationId () {
        return this.$store.getters['chat/conversation/currentConversationId']
      },
      currentConversationType () {
        return this.$store.getters['chat/conversation/currentConversationType']
      },
      conversations_business () {
        return this.$store.getters['chat/conversation/conversations_business']
      },
      conversations_merchant () {
        return this.$store.getters['chat/conversation/conversations_merchant']
      },
      conversations () {
        if (this.currentConversationType === 'business') {
          return this.conversations_business
        } else if (this.currentConversationType === 'merchant') {
          return this.conversations_merchant
        } else {
          return []
        }
      },
      conversationSearcher () {
        return new FuzzySearch(
          this.conversations,
          ['name', 'display_name', 'members.*.name'],
          {
            caseSensitive: false,
          },
        )
      },
      conversationsFiltered () {
        let arr = []

        if (this.conversations && this.conversations.length) {
          if (this.search) {
            const searchName = this.search.toLowerCase().trim()

            arr = this.conversationSearcher.search(searchName)
          } else {
            arr = this.conversations
          }
        }

        return arr
      },
      groupedConversation () {
        let chosenChat = this.conversationsFiltered.filter((item) => item.chosen)
        chosenChat = this.conversationsSorted(chosenChat)

        let simpleChat = this.conversationsFiltered.filter(
          (item) => !item.chosen,
        )
        simpleChat = this.conversationsSorted(simpleChat)

        return chosenChat.concat(simpleChat) || []
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      messages () {
        return this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ] // id чата
      },
      activeChatList () {
        return this.$route.hash || '#business'
      },
    },
    watch: {
      async program (v) {
        if (v) {
          // сброс при смене компании
          this.$store.commit('chat/conversation/currentConversationId', null)
          // this.$store.commit('chat/conversation/currentConversationType', 'business')
          // this.toRoute('/communications/chat/business')
          // обновление списка чатов
          await this.conversationInit(v.id)
        }
      },
      currentConversationType (v) {
      // this.loadConversationList()
      },
    },
    async mounted () {
      if (this.program) await this.conversationInit(this.program.id)
    },
    methods: {
      conversationsSorted (arr) {
        let sorted = arr

        if (arr && arr.length) {
          // сортировка
          let timeA = null
          let timeB = null

          sorted = arr.sort((a, b) => {
            if (a.last_message) { timeA = new Date(a.last_message.created_at).getTime() } else timeA = new Date(a.created_at).getTime()

            if (b.last_message) { timeB = new Date(b.last_message.created_at).getTime() } else timeB = new Date(b.created_at).getTime()

            if (timeA > timeB) return -1
            if (timeA === timeB) return 0
            if (timeA < timeB) return 1
          })
        }

        return sorted
      },
      sumUnreadCount (convList) {
        if (convList) {
          // unread_count
          return convList.filter((chat) => chat.unread_count > 0).length || null
        } else {
          return null
        }
      },
      switchChatList (value) {
        if (value !== this.currentConversationType) {
          this.$router.push(`/communications/chat/${value}`)
        }
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      // TEMPLATE
      getClass (id) {
        if (id === this.currentConversationId) { return 'list-item list-item-active' }
        return 'list-item'
      },
      async openCreate () {
        this.chatMemberListAction = true
        try {
          await this.$store.dispatch('chat/member/list', this.programId)
          if (this.clients && this.clients.length > 0) {
            this.dialogCreate = true
          } else {
            throw Error('Отсуствуют чаты с клиентами')
          }
        } catch (e) {
          this.$notify({
            type: 'error',
            group: 'app',
            title: 'Ошибка',
            text: e.message,
          })
        } finally {
          this.chatMemberListAction = false
        }
      },
      clearChatState () {
        this.$store.commit('chat/chatUser/clearState')
        this.$store.commit('chat/conversation/clearState')
        this.$store.commit('chat/message/clearState')
      },
      conversationChat (id) {
        // обнуляем непрочитанные
        this.$store.commit('chat/conversation/clearUnreadCount', id)
        // переходим на чат
        const path = `/communications/chat/${this.currentConversationType}/${id}`
        this.toRoute(path)
      },
      toRoute (path) {
        if (
          this.$route.path !== path &&
          ['ChatConversation', 'ChatType', 'Chat'].includes(this.$route.name)
        ) { this.$router.push(path) }
      },
      async loadConversationList () {
        // загрузка списка чатов
        if (this.currentConversationType === 'business') {
          await this.$store.dispatch(
            'chat/conversation/GetBusinessChatList',
            this.programId,
          )
        } else if (this.currentConversationType === 'merchant') {
          await this.$store.dispatch('chat/conversation/GetMerchantChatList')
        }

        // выбор активного чата
        // есть список чатов
        if (this.groupedConversation.length) {
          let conversationId = null

          // есть id текущего чата
          if (this.currentConversationId) {
            // проверка на наличие в списке чата
            let check = false
            this.groupedConversation.forEach((item) => {
              if (item.id === this.currentConversationId) check = true
            })

            if (check) {
              conversationId = this.currentConversationId
            } else {
              conversationId = this.groupedConversation[0].id
              this.$store.commit(
                'chat/conversation/currentConversationId',
                conversationId,
              )
            }

          // нет id текущего чата
          } else {
            conversationId = this.groupedConversation[0].id
            this.$store.commit(
              'chat/conversation/currentConversationId',
              conversationId,
            )
          }

          // переходим на роут чата
          this.conversationChat(conversationId)

        // нет списка
        } else {
          this.$store.commit('chat/conversation/currentConversationId', null)
          // переходим на роут общего списка
          const path = '/communications/chat/business'
          this.toRoute(path)
        }
      },
      // redis connect + список чатов + список сообщений
      async conversationInit (id) {
        this.loadingConversations = true

        try {
          // очистка данных чата
          this.clearChatState()

          // выбрана программа id - программы
          if (id) {
            // получаем чат-пользователя
            await this.$store.dispatch('chat/chatUser/read', id)

            if (this.chatUser && this.chatUser.id) {
              await this.loadConversationList()
              await this.$store.dispatch('auth/redis/connect')
            }
          }
        } catch (e) {
        } finally {
          this.loadingConversations = false
        }
      },
    },
  }
</script>
