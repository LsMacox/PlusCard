import { mapGetters } from 'vuex'

export default {
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
  },
}
