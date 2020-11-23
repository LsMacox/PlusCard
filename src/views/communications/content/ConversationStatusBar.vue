<template>
  <div class="app--conversation--header">
    <div style="display: flex;">
      <div class="app--conversation--header__title">
        {{ getConversationName(conversation) }}
      </div>
      <div class="app--conversation--header__count">
        {{ getActiveMembers(activeMembers.length) }}
      </div>
    </div>
    <div style="display: flex; margin-right: 30px;">
      <div class="app--conversation--header__toolbar">
        <div
          class="app--conversation--header__toolbar__icon"
          style="cursor: pointer;"
        >
          <input
            v-if="visibleSearchProp"
            v-model="searchStringProp"
            class="app--conversation--header__toolbar__search"
            type="text"
          >
          <i
            class="fa fa-search"
            aria-hidden="true"
            @click="visibleSearchProp = !visibleSearchProp"
          />
        </div>
        <div
          class="app--conversation--header__toolbar__icon"
          style="margin-left: 34.5px; cursor: pointer;"
          @click="setChosen(conversation)"
        >
          <i
            v-if="conversation.chosen"
            class="fas fa-star nameFavorite"
          />
          <i
            v-else
            class="far fa-star"
            aria-hidden="true"
          />
        </div>
        <div
          class="app--conversation--header__toolbar__icon"
          style="margin-left: 30.5px; width:15px; height: 15px; margin-top: 3px; cursor: pointer;"
          @click="setMuted(conversation)"
        >
          <img
            v-if="conversation.muted"
            src="@/assets/chat/volume_off.svg"
          >
          <img
            v-else
            src="@/assets/chat/volume.svg"
          >
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

    <chat-update
      v-if="dialogUpdate"
      :dialog.sync="dialogUpdate"
      :item="editedItem"
    />
  </div>
</template>

<script>
  import ChatUpdate from './components/chat/ChatUpdate'

  export default {
    components: {
      ChatUpdate,
    },
    props: {
      conversationId: {
        type: Number,
        required: true,
      },
      visibleSearch: Boolean,
      searchString: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        dialogUpdate: false,
        editedItem: {},
      }
    },
    computed: {
      visibleSearchProp: {
        get () {
          return this.visibleSearch
        },
        set (v) {
          this.$emit('update:visibleSearch', v)
        },
      },
      searchStringProp: {
        get () {
          return this.searchString
        },
        set (v) {
          this.$emit('update:searchString', v)
        },
      },
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
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      getActiveMembers (count) {
        const members = ['участник', 'участника', 'участников']
        return count + ' ' + this.declOfNum(count, members)
      },
      declOfNum (number, titles) {
        const cases = [2, 0, 1, 1, 1, 2]
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      getConversationName (conversation) {
        let name = 'Чат'
        //
        if (this.activeMembers.length > 2) name = conversation.name
        else {
          // ищем во всех участниках, включая удаленных
          this.members.forEach(item => {
            if (item.id !== this.chatUser.id) name = item.name
          })
        }
        return name
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
    },
  }
</script>
