export default {
  computed: {
    loadingRequest () {
      return this.$store.getters['template/shared/loadingRequest']
    },
    loadingSend () {
      return this.$store.getters['chat/message/loading']
    },
    profile () {
      return this.$store.getters.user
    },
    programId () {
      return this.$store.getters['brand/program/programId']
    },
    chatUser () {
      return this.$store.getters['chat/chatUser/chatUser']
    },
    conversation () {
      const conversation = this.$store.getters[
        'chat/conversation/conversations'
      ].filter((item) => item.id === this.conversationId)

      return conversation[0] || null
    },
    selectedTopicId () {
      return this.$store.getters['chat/topic/selectedTopicId']
    },
    recipients () {
      return this.$store.getters['chat/message/recipients']
    },
  },
}
