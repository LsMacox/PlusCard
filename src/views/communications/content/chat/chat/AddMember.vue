<template>
    <el-dialog
            :visible.sync="dialog"
            :close-on-click-modal="false"
            :before-close="close"
            append-to-body
            custom-class="app--modal"
    >
        <div
                v-loading="loading"
                class="modal"
        >

            <div class="header">Список клиентов</div>

            <div class="content">

                <!-- все получатели -->
                <div style="display: flex;">
                    <div
                            class="check-all"
                            @click="setRecipientAll()"
                    >
                        <div
                                v-if="checkAll"
                                class="check-all-back"
                        >
                            <v-icon color="white">check</v-icon>
                        </div>
                    </div>
                    <div class="name-all">Участники ваших чатов</div>
                </div>

                <!-- список получателей -->
                <div
                        v-for="(item, i) in clients"
                        :key="i"
                        class="res-row"
                >
                    <div class="line-h">
                        <div class="line-v"></div>
                    </div>
                    <div
                            class="check"
                            @click="setRecipient(item)"
                    >
                        <div
                                v-show="checkAll || isRecipient(item)"
                                class="check-all-back"
                        >
                            <v-icon color="white">check</v-icon>
                        </div>
                    </div>
                    <div
                            class="avatar"
                            :style="'background: url(' + item.avatar + ');'"
                    ></div>
                    <div class="name">{{item.name}}</div>
                </div>

            </div>

            <div class="action">
                <el-button
                        size="medium"
                        @click="close()"
                >Отмена
                </el-button>

                <div class="app--spacer"></div>

                <el-button
                        type="primary"
                        size="medium"
                        :loading="loadingRequest"
                        :disabled="!members.length"
                        @click="add()"
                >Добавить
                </el-button>
            </div>

        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialog: Boolean
        },
        data() {
            return {
                loading: false,
                checkAll: false,
                members: [],
                membersOld: []
            }
        },
        watch: {
            members(val) {
                if (val && val.length === this.clients.length) this.checkAll = true
                else this.checkAll = false
            }
        },
        computed: {
            loadingRequest() {
                return this.$store.getters['template/shared/loadingRequest']
            },
            loadingSend() {
                return this.$store.getters['chat/message/loading']
            },
            colors() {
                return this.$store.getters['template/colors/colors']
            },
            programId() {
                return this.$store.getters["brand/program/programId"]
            },
            editedConversation() {
                return this.$store.getters["chat/conversation/editedConversation"]
            },
            clients() {
                let clients = this.$store.getters['chat/member/clients']
                let members = Object.assign([], this.membersOld)

                let arr = []
                let check = false
                clients.forEach(item => {
                    check = false
                    members.forEach(member => {
                        if (member.active && item.id === member.id) check = true
                    })
                    if (!check) arr.push(item)
                })

                return arr
            }
        },
        methods: {
            close() {
                this.$emit('update:dialog', false)
            },
            isEmptyObject(obj) {
                return JSON.stringify(obj) === '{}'
            },

            /*
             * ПОЛУЧАТЕЛИ
             */

            setRecipientAll() {
                if (this.members.length == this.clients.length) {
                    this.members = []
                } else {
                    this.members = Object.assign([], this.clients)
                }
            },
            setRecipient(item) {
                let check = false
                let index = null
                this.members.forEach((recipient, i) => {
                    if (recipient.id === item.id) {
                        check = true
                        index = i
                    }
                })
                if (check) this.members.splice(index, 1)
                else this.members.push(item)
            },
            isRecipient(item) {
                let check = this.members.filter(recipient => recipient.id === item.id)
                if (check.length) return true
                return false
            },
            add() {
                const conversation = {
                    conversation_id: this.editedConversation.id,
                    members: this.members.map(item => item.id)
                }
                ////console.log(conversation)
                this.$store.dispatch("chat/member/add", conversation).then(() => {
                    this.close()
                })
            },
        },
        async created() {
            this.membersOld = Object.assign([], this.editedConversation.members)
            this.loading = true
            try {
                if (this.programId) await this.$store.dispatch('chat/member/list', this.programId)
            } catch (e) {
            }
            this.loading = false
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/components/_modal.scss";    

    .modal {
        min-width: 500px;
    }

    .content {
        min-height: 300px;
        margin: 0 0 20px 0;
        padding: 0 !important;
        max-height: 60vh;
        overflow-y: auto;
    }

    /* RECIPIENTS */

    .res-row {
        display: flex;
        margin: 5px 0;
    }

    .check-all {
        margin-bottom: 15px;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        border: 1px solid rgba(51, 51, 51, .3);
        cursor: pointer;
    }

    .check-all-back {
        width: 28px;
        height: 28px;
        border-radius: 30px;
        background-color: #24D3ED;
        padding: 2px;
    }

    .name-all {
        padding: 4px 10px;
        font-weight: 900;
    }

    .line-h {
        position: relative;
        width: 15px;
        height: 1px;
        margin: 14px 0 14px 15px;
        background-color: rgba(51, 51, 51, .3);
    }

    .line-v {
        position: absolute;
        bottom: -14px;
        right: 0;
        width: 1px;
        height: 35px;
        margin: 0 14px 15px 14px;
        background-color: rgba(51, 51, 51, .3);
    }

    .check {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        border: 1px solid rgba(51, 51, 51, .3);
        cursor: pointer;
    }

    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        margin-left: 10px;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
    }

    .name {
        padding: 5px 10px;
    }

    /* MEDIA */
    /* EXTRA SMALL */
    @media (max-width: 600px) {

    }

    /* SMALL */
    @media (min-width: 600px) and (max-width: 959.8px) {

    }

    /* MEDIUM */
    @media (min-width: 960px) and (max-width: 1263.8px) {

    }

    /* LARGE */
    @media (min-width: 1264px) and (max-width: 1903.8px) {

    }

    /* X LARGE */
    @media (min-width: 1904px) {

    }
</style>
