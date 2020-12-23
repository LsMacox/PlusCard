<template>
  <div class="typing-box">
    <div
      v-if="typingShow"
      class="typing-message"
    >
      <p class="body-s-semibold neutral-500--text">
        {{ typingMessage }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        typingShow: false,
        typingMessage: null,
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
        return this.$store.getters['chat/data/conversation'](this.conversationId)
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
          this.typingMessage = null
        }, 3000)

        this.typingShow = true
        this.typingMessage = name + ' печатает...'
      },
    },
  }
</script>
