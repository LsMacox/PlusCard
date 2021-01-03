export default {
  computed: {
    isGroup () {
      return this.activeMembers.length > 2
    },
    profile () {
      return this.$store.getters.user
    },
    program () {
      return this.$store.getters.program
    },
    typing () {
      return this.$store.getters['chat/message/typing']
    },
    payload () {
      return this.$store.getters['chat/data/payload'](this.conversationId)
    },
    chatUser () {
      return this.$store.getters['chat/chatUser/chatUser']
    },
    activeMembers () {
      return this.$store.getters['chat/data/activeMembers'](this.conversationId)
    },
    conversation () {
      return this.$store.getters['chat/data/conversation'](this.conversationId)
    },
    conversations () {
      return this.$store.getters['chat/conversation/conversations']
    },
    members () {
      return this.$store.getters['chat/data/members'](this.conversationId)
    },
    conversationProgram () {
      return this.$store.getters['chat/data/conversationProgram'](this.conversationId)
    },
    employees () {
      return this.$store.getters['chat/data/employees'](this.conversationId)
    },
    realChatName () {
      return this.$store.getters['chat/data/realChatName'](this.conversationId)
    },
    messages () {
      return this.$store.getters['chat/message/messages'][this.conversationId]
    },
  },
}
