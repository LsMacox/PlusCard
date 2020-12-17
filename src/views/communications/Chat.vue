<template>
  <div class="app--chat__container">
    <app-conversation-empty v-show="showEmpty" />
    <app-conversation-list
      :show-empty="showEmpty"
      @toogleEmpty="toogleEmpty"
    />
    <template v-if="!showEmpty">
      <app-conversation-field />
    </template>
  </div>
</template>

<script>
  import AppConversationList from './content/ConversationList'
  import AppConversationField from './content/ConversationField'
  import AppConversationEmpty from './content/ConversationEmpty'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      AppConversationList,
      AppConversationField,
      AppConversationEmpty,
    },
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
      return {
        dialogCreate: false,
        showEmpty: false,
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),

      activeChatList () {
        return this.$route.hash || '#business'
      },

      currentConversationId: {
        get () {
          return this.$store.getters['chat/conversation/currentConversationId']
        },
        set (v) {
          this.$store.commit('chat/conversation/currentConversationId', v)
        },
      },
      currentConversationType: {
        get () {
          return this.$store.getters['chat/conversation/currentConversationType']
        },
        set (v) {
          this.$store.commit('chat/conversation/currentConversationType', v)
        },
      },
    },
    watch: {
      conversationType (v) {
        if (v) this.currentConversationType = v
      },
      conversationId (v) {
        this.currentConversationId = v
      },
    },
    created () {
      this.currentConversationType = this.conversationType
      this.currentConversationId = this.conversationId
    },
    methods: {
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
      toogleEmpty (v) {
        this.showEmpty = v
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/chat/index.scss";
</style>
