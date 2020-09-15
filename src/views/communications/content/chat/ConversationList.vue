<template>
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
      <div style="display: flex; align-items: center;">
        <div class="app--conversation--list--search--wrapper">
          <div class="app--conversation--list--search">
            <input
              v-model="search"
              class="app--conversation--list--search--input"
              type="text"
            > <span class="app--conversation--list--search--icon"><img
              src="@/assets/chat/search.svg"
              alt=""
            ></span>
          </div>
        </div>
        <v-tooltip
          :open-delay="$config.tooltipButtonDelay"
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              style="padding: 12px; margin-left: 15px;"
              color="primary"
              fab
              v-on="on"
              @click="openCreate()"
            >
              <v-icon>mdi-plus</v-icon>
              <!-- <v-icon>$iconify_plus-circle-outlined</v-icon>    -->
            </v-btn>
          </template>
          <span>Начать переписку</span>
        </v-tooltip>
      </div>
    </div>

    <v-skeleton-loader
      :loading="loadingConversations"
      :style="{height: '100%', width: '100%'}"
      type="list-item-avatar-two-line@8"
    >
      <div
        class="app--conversation--content"
      >
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
          style="width: 100%;"
        >
          <div
            class="list-empty"
            style="width: 100%;"
          >
            Чаты не найдены
          </div>
        </div>
      </div>
    </v-skeleton-loader>

    <chat-create
      v-if="dialogCreate"
      :dialog.sync="dialogCreate"
    />
  </div>
</template>

<script>
  import ChatCreate from './chat/Create'
  import ConversationListView from './ConversationListView'
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
        search: null,
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
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
        let chosenChat = this.conversationsFiltered.filter(item => item.chosen)
        chosenChat = this.conversationsSorted(chosenChat)

        let simpleChat = this.conversationsFiltered.filter(item => !item.chosen)
        simpleChat = this.conversationsSorted(simpleChat)

        return chosenChat.concat(simpleChat) || []
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      messages () {
        return this.$store.getters['chat/message/messages'][this.currentConversationId] // id чата
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
            if (a.last_message) timeA = new Date(a.last_message.created_at).getTime()
            else timeA = new Date(a.created_at).getTime()

            if (b.last_message) timeB = new Date(b.last_message.created_at).getTime()
            else timeB = new Date(b.created_at).getTime()

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
          return convList.filter(chat => chat.unread_count > 0).length || null
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
        if (id === this.currentConversationId) return 'list-item list-item-active'
        return 'list-item'
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
      openCreate () {
        this.dialogCreate = true
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
        if (this.$route.path !== path) this.$router.push(path)
      },
      async loadConversationList () {
        // загрузка списка чатов
        if (this.currentConversationType === 'business') {
          await this.$store.dispatch('chat/conversation/GetBusinessChatList', this.programId)
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
            this.groupedConversation.forEach(item => {
              if (item.id === this.currentConversationId) check = true
            })

            if (check) {
              conversationId = this.currentConversationId
            } else {
              conversationId = this.groupedConversation[0].id
              this.$store.commit('chat/conversation/currentConversationId', conversationId)
            }

            // нет id текущего чата
          } else {
            conversationId = this.groupedConversation[0].id
            this.$store.commit('chat/conversation/currentConversationId', conversationId)
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

<style lang="scss" scoped>
    #app--conversation--list--container{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        border-right: 1px solid #EBEBEB;
        height: calc(100vh - 170px);

        .app--conversation--list--header{
            padding: 13px 15px 12px 16px;

            .app--conversation--list--buttons{
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .app--conversation--list--button--wrapper{
                    position:relative;

                    .app--conversation--list--button--badge {
                        position: absolute;
                        top: -6px;
                        right: -6px;
                        background: #E74C3C;
                        width: 24px;
                        padding: 1.2px 5px;
                        border-radius: 9px;
                        font-weight: 500;
                        font-size: 13px;
                        line-height: 15px;
                        color: #FFFFFF;
                        text-align: center;
                        font-family: "SFPro-Regular";
                    }

                    .app--conversation--list--button{
                        background: #A4B1C1;
                        border-radius: 10px;
                        font-family: "SF Pro Text", sans-serif;
                        font-size: 15px;
                        line-height: 18px;
                        text-align: center;
                        color: #fff;
                        outline:none;
                        font-weight: 600;width: 150px;
                        width: 150px;
                        height: 42px;
                    }

                    .app--conversation--list--button--active{
                        background: #4583AC;
                    }

                    .app--conversation--list--button--clients{
                        width: 150px;
                        height: 42px;
                    }

                    .app--conversation--list--button--workers{
                        width: 150px;
                        height: 42px;
                    }
                }
            }

            .app--conversation--list--search--wrapper{
                position: relative;

                .app--conversation--list--search{
                    background: #FFFFFF;
                    opacity: 0.3;
                    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
                    border-radius: 10px;

                    .app--conversation--list--search--input{
                        position:relative;
                        width: 100%;
                        height: 100%;
                        min-width: 260px;
                        min-height: 13px;
                        outline: none;
                        padding: 10px 34px;
                        color: #686868;
                    }

                    .app--conversation--list--search--icon{
                        position: absolute;
                        left: 9px;
                        top: 10px;
                    }
                }
            }

        }

        .app--conversation--content{
            display:flex;
            flex-grow: 1;
            width:100%;
            height: 100%;
            overflow-y: hidden;
            overflow-x: hidden;

            &:hover{
                overflow-y: scroll;
                overflow-x: hidden;
            }

            &::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                background-color: #f5f5f5;
            }

            &::-webkit-scrollbar {
                width: 5px;
                background-color: #f5f5f5;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #00d3ef;
                border: 2px solid #00d3ef;
            }
        }

        // .app--conversation--list{ }
    }

    .list-item {
        display: flex;
        cursor: pointer;
        height: 75px;
    }

    .list-item-active {
        background-color: #ECECEC;
    }

    .list-empty {
        padding: 20px;
        text-align: center;
    }

    .app--conversation--list::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #f5f5f5;
    }

    .app--conversation--list::-webkit-scrollbar {
        width: 5px;
        background-color: #f5f5f5;
    }

    .app--conversation--list::-webkit-scrollbar-thumb {
        background-color: #00d3ef;
        border: 2px solid #00d3ef;
    }
</style>
