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
    recipients () {
      return this.$store.getters['chat/message/recipients']
    },
    currentConversationId () {
      return this.$store.getters['chat/conversation/currentConversationId']
    },
    realChatName () {
      return this.$store.getters['chat/data/realChatName'](this.currentConversationId)
    },
    // sendbox
    isReply () {
      return this.$store.getters['chat/sendbox/isReply']
    },
    isEdit () {
      return this.$store.getters['chat/sendbox/isEdit']
    },
    isChoice () {
      return this.$store.getters['chat/sendbox/isChoice']
    },
    isEmoji () {
      return this.$store.getters['chat/sendbox/isEmoji']
    },
    isTopic () {
      return this.$store.getters['chat/sendbox/isTopic']
    },
    replyMessageId () {
      return this.$store.getters['chat/sendbox/replyMessageId']
    },
    editMessageId () {
      return this.$store.getters['chat/sendbox/editMessageId']
    },
    selectedTopicId () {
      return this.$store.getters['chat/sendbox/topicId']
    },
    choiceMessageIds () {
      return this.$store.getters['chat/sendbox/choiceMessageIds']
    },
    messageText () {
      return this.$store.getters['chat/sendbox/messageText']
    },
    editMessageTextOld () {
      return this.$store.getters['chat/sendbox/editMessageTextOld']
    },
  },
}
