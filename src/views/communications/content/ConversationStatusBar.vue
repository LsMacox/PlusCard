<template>
  <div class="app--conversation--header">
    <div class="app--conversation--header-tools">
      <div class="left-block d-flex">
        <v-img
          class="header-avatar"
          max-width="48"
          max-height="48"
          :src="conversationAvatar"
        />
        <div class="header-info">
          <p class="body-m-semibold neutral-900--text">
            {{ conversationName }}
          </p>
          <div class="online">
            <p
              class="body-s-semibold"
              :class="[isConversationOnline ? 'success--text' : 'error--text']"
            >
              {{ isConversationOnline ? 'В сети' : 'Не в сети' }}
            </p>
          </div>
        </div>
      </div>
      <div class="right-block">
        <div class="app--conversation--header__toolbar">
          <div
            class="app--conversation--header__toolbar__icon"
          >
            <iconify-icon
              class="icon-search"
              :class="{ active: searchShow }"
              icon="ion-search-outline"
              width="21"
              @click="searchShow = !searchShow"
            />
          </div>
          <div
            class="app--conversation--header__toolbar__icon"
            @click="setMuted(conversation)"
          >
            <iconify-icon
              v-if="conversation.muted"
              class="icon-volume"
              icon="feather-volume"
              width="21"
            />
            <iconify-icon
              v-else
              class="icon-volume"
              icon="feather-volume-1"
              width="21"
            />
          </div>
          <div
            v-click-outside="hideMore"
            class="app--conversation--header__toolbar__icon"
            style="margin-left: 13px;"
          >
            <iconify-icon
              class="icon-more"
              :class="{ active: moreShow }"
              icon="feather-more-vertical"
              width="21"
              @click="moreShow = !moreShow"
            />
            <div
              v-if="moreShow"
              class="more-block"
            >
              <ul class="more-list">
                <li
                  v-for="(moreItem, i) in moreList"
                  :key="i"
                  class="more-item"
                >
                  <a
                    href="#"
                    @click="handler(moreItem.func)"
                  >
                    <iconify-icon
                      class="icon"
                      :icon="moreItem.icon"
                      width="21"
                    />
                    <p class="body-s-medium neutral-500--text">{{ moreItem.title }}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          v-if="chatUser.id == conversation.creator_id"
          class="app--conversation--header__burger"
        >
          <i
            class="fas fa-ellipsis-v"
            style="cursor: pointer;"
            @click="openUpdate(conversation)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="searchShow"
      class="app--conversation--header-search"
    >
      <base-text-field
        v-model="internalSearchString"
        class="field-search"
        placeholder="Поиск чатов"
        prepend-inner-icon="$iconify_ion-search-outline"
        clear-icon="$iconify_ion-close-circle-outline"
        :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
        clearable
        hide-details
      >
        <template v-slot:append>
          <div class="found-block">
            <p class="body-m-medium neutral-500--text">
              {{ searchChoose }}/{{ searchCount }}
            </p>
            <div class="controls">
              <iconify-icon
                :class="['icon', 'icon-next', searchChoose && searchChoose < searchCount ? 'active' : '']"
                icon="octicon-chevron-up-16"
                width="15"
                @click="nextEntry"
              />
              <iconify-icon
                class="icon icon-prev"
                :class="['icon', 'icon-prev', searchChoose && searchChoose !== 1 ? 'active' : '']"
                icon="octicon-chevron-up-16"
                width="15"
                @click="prevEntry"
              />
            </div>
          </div>
        </template>
      </base-text-field>
      <v-btn
        class="btn-close"
        color="primary-100"
        @click="searchShow = !searchShow"
      >
        <iconify-icon
          class="icon-close"
          icon="jam-close"
          width="18"
        />
      </v-btn>
    </div>
    <chat-update
      v-if="dialogUpdate"
      :dialog.sync="dialogUpdate"
      :item="editedItem"
    />
  </div>
</template>

<script>
  // components
  import ChatUpdate from './components/chat/ChatUpdate'

  // mixins
  import MixinIndex from '../mixins/index.js'

  export default {
    components: {
      ChatUpdate,
    },
    mixins: [
      MixinIndex,
    ],
    props: {
      conversationId: {
        type: Number,
        required: true,
      },
      searchString: {
        type: String,
        default: '',
      },
      searchChoose: {
        type: [Number, String],
        default: '',
      },
      searchCount: {
        type: [Number, String],
        default: 0,
      },
    },
    data () {
      return {
        dialogUpdate: false,
        editedItem: {},
        searchShow: false,
        internalSearchString: this.searchString,
        internalSearchChoose: this.searchChoose,
        moreShow: false,
        moreList: [
          { icon: 'check-circle', title: 'Выбрать', func: 'moreChoose' },
          { icon: 'feather-user', title: 'О клиенте', func: 'moreAbout' },
          { icon: 'feather-star', title: 'В избранное', func: 'moreFavorites' },
          { icon: 'ion-archive-outline', title: 'Архивировать', func: 'moreArchive' },
          { icon: 'feather-hash', title: 'Редактировать', func: 'moreEdit' },
          { icon: 'feather-trash', title: 'Удалить чат', func: 'moreDelete' },
        ],
      }
    },
    computed: {
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
      activeMembers () {
        if (!this.isEmptyObject(this.conversation)) return this.conversation.members.filter(item => item.active)
        return []
      },
      isConversationOnline () {
        return true
      },
      conversationAvatar () {
        let avatar = ''
        if (this.activeMembers.length > 2) {
          avatar = this.conversation.avatar
        } else {
          if (
            this.conversation.activeMembers &&
            this.conversation.activeMembers.length > 0
          ) {
            avatar = this.conversation.activeMembers.filter(member => member.id === this.conversation.creator_id)[0].avatar
          } else {
            avatar = null
          }
        }
        return avatar
      },
      conversationName () {
        let name = 'Чат'
        //
        if (this.activeMembers.length > 2) name = this.conversation.name
        else {
          // ищем во всех участниках, включая удаленных
          // this.members.forEach(item => {
          //   if (item.id !== this.chatUser.id) name = item.display_name
          // })
          name = this.conversation.display_name
        }
        return name
      },
    },
    watch: {
      internalSearchString (v) {
        this.$emit('update:searchString', v)
      },
      internalSearchChoose (v) {
        this.$emit('update:searchChoose', v)
      },
      searchShow (v) {
        if (!v) {
          this.internalSearchString = ''
          this.internalSearchChoose = 0
        }
      },
    },
    methods: {
      getActiveMembers (count) {
        const members = ['участник', 'участника', 'участников']
        return count + ' ' + this.declOfNum(count, members)
      },
      setChosen (item) {
        const conversation = {
          conversation_id: item.id,
        }
        if (item.chosen) {
          this.$store.dispatch('chat/conversation/chosenRemove', conversation)
        } else {
          this.$store.dispatch('chat/conversation/chosenSet', conversation)
        }
      },
      setMuted (item) {
        const conversation = {
          conversation_id: item.id,
        }
        if (item.muted) {
          this.$store.dispatch('chat/conversation/mutedRemove', conversation)
        } else {
          this.$store.dispatch('chat/conversation/mutedSet', conversation)
        }
      },
      openUpdate (item) {
        this.editedItem = item
        this.dialogUpdate = true
      },
      nextEntry () {
        if (this.internalSearchChoose + 1 < (this.searchCount + 1)) this.internalSearchChoose++
        this.$emit('update:searchChoose', this.internalSearchChoose)
      },
      prevEntry () {
        if (this.internalSearchChoose - 1 > 0) this.internalSearchChoose--
        this.$emit('update:searchChoose', this.internalSearchChoose)
      },
      handler (func) {
        this[func]()
      },
      // more menu
      hideMore () {
        this.moreShow = false
      },
      moreChoose () {
        console.log('more choose')
      },
      moreAbout () {
        console.log('more about')
      },
      moreFavorites () {
        console.log('more favorites')
      },
      moreArchive () {
        console.log('more archive')
      },
      moreEdit () {
        console.log('more edit')
      },
      moreDelete () {
        console.log('more delete')
      },
    },
  }
</script>
