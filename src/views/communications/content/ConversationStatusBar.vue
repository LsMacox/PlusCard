<template>
  <div class="app--conversation--header">
    <div class="app--conversation--header-tools">
      <div class="left-block d-flex">
        <v-img
          class="header-avatar"
          max-width="48"
          max-height="48"
          :src="avatar"
          @error="errorLoadingAvatar = true"
        />
        <div class="header-info">
          <p
            class="body-m-semibold neutral-900--text"
            :style="isGroup ? 'margin-top: 12px' : ''"
          >
            {{ name }}
          </p>
          <div
            v-if="!isGroup"
            class="online"
          >
            <app-typing
              v-if="typing && typing.conversation_id == conversationId"
              :conversation-id="conversationId"
            />
            <p
              class="body-s-semibold"
              :class="[isOnline ? 'success--text' : 'error--text']"
            >
              {{ isOnline ? 'В сети' : 'Не в сети' }}
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
                    @click="handler(moreItem.func, moreItem.mode)"
                  >
                    <iconify-icon
                      class="icon"
                      :icon="moreItem.icon"
                      width="21"
                    />
                    <p class="body-s-medium neutral-500--text">{{ Array.isArray(moreItem.title) ? moreItem.mode ? moreItem.title[0] : moreItem.title[1] : moreItem.title }}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div
          v-if="chatUser.id == conversation.creator_id"
          class="app--conversation--header__burger"
        >
          <i
            class="fas fa-ellipsis-v"
            style="cursor: pointer;"
            @click="openUpdate(conversation)"
          />
        </div> -->
      </div>
    </div>
    <div
      v-if="searchShow"
      class="app--conversation--header-search"
    >
      <base-text-field
        v-model="internalSearchString"
        class="search-field"
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
  </div>
</template>

<script>
  // components
  import AppTyping from './components/chat/Typing'

  // mixins
  import MixinIndex from '../mixins/index.js'

  export default {
    components: {
      AppTyping,
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
        searchShow: false,
        internalSearchString: this.searchString,
        internalSearchChoose: this.searchChoose,
        moreShow: false,
        errorLoadingAvatar: false,
      }
    },
    computed: {
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      conversation () {
        return this.$store.getters['chat/data/conversation'](this.conversationId)
      },
      members () {
        return this.$store.getters['chat/data/members'](this.conversationId)
      },
      activeMembers () {
        return this.$store.getters['chat/data/activeMembers'](this.conversationId)
      },
      isOnline () {
        return true
      },
      moreList () {
        return [
          { icon: 'check-circle', title: 'Выбрать', func: 'moreChoose' },
          { icon: 'feather-user', title: 'О клиенте', func: 'moreAbout' },
          { icon: 'feather-star', mode: !this.conversation.chosen, title: ['В избранное', 'Убрать из избраного'], func: 'moreFavorites' },
          { icon: 'ion-archive-outline', mode: !this.conversation.archived, title: ['Архивировать', 'Вернуть из архива'], func: 'moreArchive' },
          { icon: 'feather-hash', title: 'Редактировать', func: 'moreEdit' },
          { icon: 'feather-trash', title: 'Удалить чат', func: 'moreDelete' },
        ]
      },
      avatar () {
        let avatar = ''
        if (this.isGroup) {
          avatar = this.getGroupImgData(this.conversation)
        } else if (this.activeMembers && this.activeMembers.length > 1) {
          const creator = this.activeMembers.filter(member => member.id === this.conversation.creator_id)[0]
          avatar = creator.avatar
        } else {
          avatar = this.img404
        }

        if (this.errorLoadingAvatar) avatar = this.img404

        return avatar
      },
      name () {
        let name

        if (this.isGroup) {
          name = this.conversation.display_name
        } else {
          // ищем во всех участниках, включая удаленных
          // this.members.forEach(item => {
          //   if (item.id !== this.chatUser.id) name = item.display_name
          // })
          name = this.conversation.display_name
        }
        return name
      },
      isGroup () {
        return this.activeMembers.length > 2
      },
      typing () {
        return this.$store.getters['chat/message/typing']
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
      searchCount (v) {
        if (
          (v !== 0 && this.internalSearchChoose === 0) ||
          (this.internalSearchChoose > v)
        ) {
          this.internalSearchChoose = 1
        }
        if (v === 0) this.internalSearchChoose = 0
      },
    },
    methods: {
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
        //
      },
      nextEntry () {
        if (this.internalSearchChoose + 1 < (this.searchCount + 1)) this.internalSearchChoose++
        this.$emit('update:searchChoose', this.internalSearchChoose)
      },
      prevEntry () {
        if (this.internalSearchChoose - 1 > 0) this.internalSearchChoose--
        this.$emit('update:searchChoose', this.internalSearchChoose)
      },
      handler (func, mode) {
        this[func](mode)
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
      moreFavorites (isFavorite) {
        this.hideMore()
        if (isFavorite) {
          this.$store.dispatch('chat/conversation/chosenSet', { conversation_id: this.conversationId })
        } else {
          this.$store.dispatch('chat/conversation/chosenRemove', { conversation_id: this.conversationId })
        }
      },
      moreArchive (isArchive) {
        this.hideMore()

        const conversation = {
          conversation_id: this.conversationId,
          archived: isArchive,
        }

        this.$store.dispatch('chat/conversation/updateArchived', conversation)
      },
      moreEdit () {
        console.log('more edit')
      },
      moreDelete () {
        this.hideMore()
        this.$store.dispatch('chat/conversation/delete', this.conversationId)
      },
    },
  }
</script>
