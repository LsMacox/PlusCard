<template>
  <div class="typing-box">
    <div
      v-if="typingShow"
      class="typing-message"
    >
      {{ typingName }}
      <div>
        {{ typingMessage }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        type: [Number, String],
        required: true,
      },
    },
    data () {
      return {
        typingShow: false,
        typingMessage: null,
        typingName: null,
      }
    },
    computed: {
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
      typing: {
        get () {
          return this.$store.getters['chat/message/typing']
        },
        set (v) {
          this.$store.commit('chat/message/typing', v)
        },
      },
    },
    watch: {
      typing (v) {
        if (v && v.sender_id !== this.profile.id && v.conversation_id === this.conversationId) {
          this.setTyping(v)
        }
      },
    },
    created () {
      if (this.typing) {
        if (this.typing && this.typing.sender_id !== this.profile.id && this.typing.conversation_id === this.conversationId) {
          this.setTyping(this.typing)
        }
      }
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      setTyping (typing) {
        let name = 'Пользователь'
        let isEmployee = false

        if (this.employees && this.employees.length) {
          const employee = this.employees.filter(item => item.id === typing.sender_id)
          if (employee.length) {
            if (this.realChatName) name = `${employee[0].name} (${this.conversationProgram.name})`
            else name = `${this.conversationProgram.name} (${employee[0].name})`
            isEmployee = true
          }
        }

        if (!isEmployee && this.members && this.members.length) {
          const member = this.members.filter(item => item.id === typing.sender_id)
          if (member.length) {
            name = member[0].name
          }
        }

        setTimeout(() => {
          this.typingShow = false
          this.typing = {}
          this.typingName = null
          this.typingMessage = null
        }, 3000)

        this.typingShow = true
        this.typingName = name
        this.typingMessage = ' печатает сообщение...'
      },
    },
  }
</script>
