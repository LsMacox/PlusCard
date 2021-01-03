<template>
  <div
    v-if="!showEmpty"
    class="app--chat--list"
  >
    <div id="app--conversation--list--container">
      <v-scroll-x-transition :hide-on-leave="true">
        <div
          v-show="!isArchive"
          class="app--conversation--list--header"
        >
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
              <v-btn
                class="btn-add-chat"
                color="primary"
                fab
                :loading="chatMemberListAction"
                @click="openCreate()"
              >
                <v-icon
                  color="neutral-100"
                  size="15"
                >
                  $iconify_eva-plus-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-scroll-x-transition>

      <v-scroll-x-transition :hide-on-leave="true">
        <v-skeleton-loader
          v-show="!isArchive"
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
                v-if="archiveConversation.length && (!search || !String(search).replace(/\s+/g, ' ').replace(/^\s/g, '').length)"
                class="list-item item-archive"
                @click="isArchive = !isArchive"
              >
                <div style="display: flex; width: 100%;">
                  <div class="app--conversation--list--card">
                    <div class="app--conversationn--list--avatar--wrapper">
                      <div class="list-avatar">
                        <iconify-icon
                          class="icon-archive"
                          icon="ion-archive-outline"
                          width="21"
                        />
                      </div>
                    </div>
                    <div class="app--conversation--list--card--content--wrapper">
                      <div class="app--conversation--list--card--content">
                        <div
                          class="app--conversation--list--card--top--line"
                        >
                          <div class="app--conversation--list--card-name">
                            Архив
                          </div>
                        </div>
                        <div
                          class="app--conversation--list--card--bottom--line"
                        >
                          {{ archiveNames }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-for="(item, i) in groupedConversation"
                :key="i"
                class="list-item"
                :class="{'list-item-active': (item.id === currentConversationId)}"
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
      </v-scroll-x-transition>

      <v-scroll-x-reverse-transition :hide-on-leave="true">
        <div
          v-show="isArchive"
          class="app--coversation--archive"
        >
          <div class="archive--header">
            <v-btn
              class="archive--back"
              text
              @click="isArchive = !isArchive"
            >
              <iconify-icon
                class="icon-back"
                icon="arrow-back"
                width="21"
              />
            </v-btn>
            <div class="archive--title">
              <p class="title-s-bold">
                Архив
              </p>
            </div>
          </div>
          <div
            v-for="(item, i) in archiveConversation"
            :key="i"
            class="list-item"
            :class="{'list-item-active': (item.id === currentConversationId)}"
            @click="conversationChat(item.id)"
          >
            <conversation-list-view
              :conversation-type="currentConversationType"
              :conversation-id="item.id"
            />
          </div>
        </div>
      </v-scroll-x-reverse-transition>

      <chat-create-panel
        v-model="isChatCreate"
      />
    </div>
  </div>
</template>

<script>
  // components
  import ConversationListView from './ConversationListView'
  import ChatCreatePanel from './components/chat/ChatCreatePanel'

  // mixins
  import MixinIndex from '../mixins/index.js'
  import MixinData from '../mixins/conversation-list/data.js'

  // other
  import FuzzySearch from 'fuzzy-search'

  export default {
    components: {
      ChatCreatePanel,
      ConversationListView,
    },
    mixins: [
      MixinIndex,
      MixinData,
    ],
    props: {
      showEmpty: Boolean,
      loadingProgram: Boolean,
    },
    data () {
      return {
        isChatCreate: false,
        chatMemberListAction: false,
        search: null,
        isArchive: false,
        intervalConversationsActivity: {},
      }
    },
    computed: {
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
      groupedConversation () {
        const conversations = this.conversationsSorted(this.conversations.filter(item => !item.archived))
        const chosenConversations = conversations.filter((item) => item.chosen)
        let groupedConversation = Array.from(new Set(chosenConversations.concat(conversations)))

        const search = String(this.search).replace(/\s+/g, ' ').replace(/^\s/g, '')

        if (!groupedConversation.length) {
          this.$emit('update:showEmpty', true)
          return []
        }

        if (this.search && search.length) {
          groupedConversation = this.conversationSearcher.search(search.toLowerCase())
        }

        this.$emit('update:showEmpty', false)
        return groupedConversation
      },
      archiveConversation () {
        let archiveConversation = this.conversations
        archiveConversation = this.conversationsSorted(archiveConversation)
        archiveConversation = archiveConversation.filter(c => c.archived)
        return archiveConversation
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      messages () {
        return this.$store.getters['chat/message/messages'][
          this.currentConversationId
        ] // id чата
      },
      archiveNames () {
        if (!this.archiveConversation.length) return 'Нету пользователей!'

        const names = []
        const limit = 6

        for (let i = 0; i < this.archiveConversation.length; i++) {
          if (i >= limit) break
          if (
            this.archiveConversation[i].display_name &&
            this.archiveConversation[i].display_name.length
          ) {
            let name = this.archiveConversation[i].display_name.toLowerCase()
            name = name.charAt(0).toUpperCase() + name.slice(1)
            names.push(name)
          }
        }

        return names.join(', ')
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
          this.$emit('update:loadingProgram', true)
          await this.conversationInit(v.id)
          this.$emit('update:loadingProgram', false)
        }
      },
      currentConversationType (v) {
      // this.loadConversationList()
      },
    },
    async mounted () {
      this.search = ''
      this.$emit('update:loadingProgram', true)
      if (this.program) await this.conversationInit(this.program.id)
      await this.$store.dispatch('chat/conversation/lastActivity')
      this.$emit('update:loadingProgram', false)
      this.setIntervalConversationsActivity()
    },
    beforeDestroy () {
      clearInterval(this.intervalConversationsActivity)
    },
    methods: {
      conversationChat (id) {
        // обнуляем непрочитанные
        this.$store.commit('chat/conversation/clearUnreadCount', id)
        // переходим на чат
        const path = `/communications/chat/${this.currentConversationType}/${id}`
        this.toRoute(path)
      },
      async setIntervalConversationsActivity () {
        this.intervalConversationsActivity = setInterval(async () => {
          await this.$store.dispatch('chat/conversation/lastActivity')
        }, 100000)
      },
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
      async openCreate () {
        this.chatMemberListAction = true
        try {
          await this.$store.dispatch('chat/member/list', this.programId)
          if (this.clients && this.clients.length > 0) {
            this.isChatCreate = true
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
          this.$emit('toogleEmpty', true)
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
