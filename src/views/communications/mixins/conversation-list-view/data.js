export default {
  computed: {
    activeMembers () {
      return this.conversation.members.filter((item) => item.active)
    },
    program () {
      return this.$store.getters.program
    },
    profile () {
      return this.$store.getters.user
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
    conversationProgram () {
      if (!this.isEmptyObject(this.conversation)) return this.conversation.program
      return {}
    },
    employees () {
      if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.chat_members
      return []
    },
    realChatName () {
      if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.real_chat_name
      return false
    },
    messages () {
      return this.$store.getters['chat/message/messages'][this.conversationId] // id чата
    },
    typing () {
      return this.$store.getters['chat/message/typing']
    },
  },
}
