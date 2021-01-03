<template>
  <base-side-panel
    v-model="innerActiveSidePanel"
    class="side-panel__chat-create"
    :width="483"
  >
    <div class="chat-create__header">
      <p class="title-m-bold neutral-900--text">
        Новый чат
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
            :class="{active: isChooseClient(client)}"
            @click="toogleChooseClient(client)"
          >
            <div class="right-block">
              <div class="item-img">
                <img
                  class="avatar"
                  :src="avatars[client.id]"
                  @error="e => e.target.src = img404"
                >
                <div
                  v-if="isOnline(getConversation(client.id))"
                  class="online"
                />
              </div>
              <div class="item-name">
                <p class="body-m-medium neutral-900--text">
                  {{ client.name ? client.name : '-' }} {{ client.lastname ? client.lastname : '' }}
                </p>
              </div>
            </div>
            <div class="left-block">
              <iconify-icon
                v-if="isChooseClient(client)"
                class="icon-check"
                icon="octicon-check-circle-fill-16"
                width="21"
              />
            </div>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="empty"
      >
        <base-empty
          text="Клиент не найден :’("
          sub-text="Скорее всего, клиент еще не писал вам. Вы можете начать общение с клиентом, только если он до этого обращался в ваш чат. "
        />
      </div>
    </div>
    <div
      v-if="choosenClients.length"
      class="chat-create__footer"
    >
      <base-text-field
        v-if="choosenClients.length > 1"
        v-model="groupName"
        :rules="nameRules"
        error-style="custom"
        validation-placement="top"
        class="group-name"
        placeholder="Название группового чата"
      />
      <v-btn
        color="primary"
        class="btn-create"
        :loading="conversationCreateRequest"
        @click="createChat"
      >
        <iconify-icon
          class="icon"
          icon="ion-checkmark-circle-outline"
          width="21"
        />
        <p class="body-m-semibold neutral-100--text">
          Создать чат
        </p>
      </v-btn>
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
    },
    data () {
      return {
        search: '',
        groupName: '',
        choosenClients: [],
        innerActiveSidePanel: this.activeSidePanel,
        nameRules: [
          v => (this.groupName.length === 0 || !!v) || 'Название чата обязательно',
          v => (this.groupName.length < 25) || 'Название чата не должно быть более 25 символов',
        ],
        conversationCreateRequest: false,
      }
    },
    computed: {
      ...mapGetters('company/program', ['programId']),
      clients () {
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

        if (this.search && search.length) {
          clients = this.clientsSearcher.search(search.toLowerCase())

          this.setChoosenClients(
            this.choosenClients.filter(choosenClient => {
              const clientIds = clients.map(c => c.id)
              return clientIds.includes(choosenClient.id)
            }),
          )
        }

        return clients
      },
      avatars () {
        const avatars = {}
        this.clients.forEach((c) => {
          avatars[c.id] = c.avatar
        })
        return avatars
      },
      currentConversationType () {
        return this.$store.getters['chat/conversation/currentConversationType']
      },
      conversations () {
        return this.$store.getters['chat/conversation/conversations']
      },
    },
    watch: {
      innerActiveSidePanel (v) {
        this.$emit('changeSidePanel', v)
        if (!v) {
          this.search = ''
          this.groupName = ''
          this.choosenClients = []
        }
      },
      activeSidePanel (v) {
        this.innerActiveSidePanel = v
      },
    },
    mounted () {
      this.search = ''
      this.groupName = ''
      this.choosenClients = []
    },
    methods: {
      conversationChat (id) {
        // обнуляем непрочитанные
        this.$store.commit('chat/conversation/clearUnreadCount', id)
        // переходим на чат
        const path = `/communications/chat/${this.currentConversationType}/${id}`
        this.toRoute(path)
      },
      isChooseClient (client) {
        return this.choosenClients.findIndex(c => c.id === client.id) !== -1
      },
      getConversation (clientId) {
        return this.conversations.find(c => c.creator_id === clientId)
      },
      toogleChooseClient (client) {
        const choosenClientIdx = this.choosenClients.findIndex(c => c.id === client.id)

        if (choosenClientIdx === -1) {
          this.choosenClients.push(client)
        } else {
          this.choosenClients.splice(choosenClientIdx, 1)
        }
      },
      setChoosenClients (payload) {
        this.choosenClients = payload
      },
      createChat () {
        const name = this.choosenClients.length > 1 ? this.groupName : null

        const conversation = {
          name: name,
          program_id: this.programId,
          members: this.choosenClients.map(item => item.id),
        }

        this.conversationCreateRequest = true
        this.$store.dispatch('chat/conversation/create', conversation).then((res) => {
          this.conversationChat(this.$store.getters['chat/conversation/nowCreateConversation'].id)
          this.innerActiveSidePanel = false
        }).finally(() => {
          this.conversationCreateRequest = false
        })
      },
    },
  }
</script>
