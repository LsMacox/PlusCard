<template>
    <div class="typing-box">
        <div
                v-if="typingShow"
                class="typing-message"
        >{{typingName}}
            <div>
                {{typingMessage}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            conversationId: String | Number,
        },
        data() {
            return {
                typingShow: false,
                typingMessage: null,
                typingName: null,
            }
        },
        watch: {
            typing(v) {
                if (v && v.sender_id != this.profile.id && v.conversation_id == this.conversationId) {
                    this.setTyping(v)
                }
            }
        },
        computed: {
            profile() {
                return this.$store.getters.getProfile;
            },
            chatUser() {
                return this.$store.getters['chat/chatUser/chatUser']
            },
            conversation() {
                let conversation = this.$store.getters["chat/conversation/conversations"].filter(item => item.id == this.conversationId)
                if (conversation.length) return conversation[0]
                return {}
            },
            members() {
                if (!this.isEmptyObject(this.conversation)) return this.conversation.members
                return []
            },
            conversationProgram() {
                if (!this.isEmptyObject(this.conversation)) return this.conversation.program
                return {}
            },
            employees() {
                if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.chat_members
                return []
            },
            realChatName() {
                if (!this.isEmptyObject(this.conversationProgram)) return this.conversationProgram.real_chat_name
                return false
            },
            typing: {
                get() {
                    return this.$store.getters['chat/message/typing']
                },
                set(v) {
                    this.$store.commit('chat/message/typing', v)
                }
            },
        },
        methods: {
            isEmptyObject(obj) {
                return JSON.stringify(obj) === "{}"
            },
            setTyping(typing) {

                let name = 'Пользователь'
                let isEmployee = false

                if (this.employees && this.employees.length) {

                    let employee = this.employees.filter(item => item.id == typing.sender_id)
                    if (employee.length) {
                        if (this.realChatName) name = `${employee[0].name} (${this.conversationProgram.name})`
                        else name = `${this.conversationProgram.name} (${employee[0].name})`
                        isEmployee = true
                    }
                }

                if (!isEmployee && this.members && this.members.length) {

                    let member = this.members.filter(item => item.id == typing.sender_id)
                    if (member.length) {
                        name = member[0].name
                    }
                }

                setTimeout(() => {
                    this.typingShow = false
                    this.typing = {}
                    this.typingName = null
                    this.typingMessage = null
                }, 3000);

                this.typingShow = true
                this.typingName = name;
                this.typingMessage = ' печатает сообщение...'
            }
        },
        created() {
            if (this.typing) {
                if (this.typing && this.typing.sender_id != this.profile.id && this.typing.conversation_id == this.conversationId) {
                    this.setTyping(this.typing)
                }
            }
        }
    }
</script>

<style scoped>
    .typing-box {
        z-index: 1500;
        height:15px;
    }

    .typing-message {
        font-size: 10px;
        line-height: 12px;
        color: #8C9499;
    }
</style>