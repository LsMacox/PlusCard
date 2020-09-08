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

        <div class="header">Редактирование чата</div>

        <el-form
                :model="form"
                :rules="rules"
                ref="form"
                @submit.prevent.native="submit('form')"
        >
            <div class="content">

                <el-form-item prop="name">
                    <el-input
                            v-model="form.name"
                            placeholder="Введите название чата"
                    ></el-input>
                </el-form-item>

                <!-- все получатели -->
                <div style="display: flex;">
                    <div class="name-all">Участники чата</div>
                    <div class="app--spacer"></div>
                    <el-button
                            type="primary"
                            size="mini"
                            @click="openAdd()"
                    >Добавить участника</el-button>
                </div>

                <!-- список получателей -->
                <div
                        v-for="(item, i) in clients"
                        :key="i"
                >
                    <div
                            v-if="item.active"
                            class="res-row"
                    >
                        <div
                                class="avatar"
                                :style="'background: url(' + item.avatar + ');'"
                        ></div>
                        <div class="name">{{item.name}}</div>
                        <div
                                v-if="!isPrivateChat && chatUser.id !== item.id"
                                class="remove-link"
                                @click="openRemove(item)"
                        >удалить</div>
                    </div>
                </div>

            </div>

            <div class="action">
                <el-button
                        size="medium"
                        @click="close()"
                >Отмена</el-button>

                <div class="app--spacer"></div>

                <el-button
                        type="primary"
                        size="medium"
                        :loading="loadingRequest"
                        :disabled="!members.length"
                        @click="submit('form')"
                >Обновить</el-button>
            </div>

        </el-form>

    </div>

    <add-member
            v-if="dialogAdd"
            :dialog.sync="dialogAdd"
    ></add-member>

    <remove-member
            v-if="dialogRemove"
            :dialog.sync="dialogRemove"
            :conversation-id="editedConversation.id"
            :item="editedItem"
    ></remove-member>

</el-dialog>
</template>

<script>
import AddMember from "./AddMember";
import RemoveMember from "./RemoveMember";

export default {
    components: {
        AddMember,
        RemoveMember
    },
    props: {
        dialog: Boolean,
        item: Object
    },
    data () {
        return {
            dialogAdd: false,
            dialogRemove: false,
            editedItem: {},
            form: {
                id: null,
                name: null
            },
            loading: false,
            checkAll: false,
            members: [],
            rules: {
                name: [
                    { required: true, message: 'Название чата обязательно', trigger: 'blur' },
                    { max: 100, message: 'Название чата не должен быть более 100 символов', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        members (val) {
            if (val && val.length === this.clients.length) this.checkAll = true
            else this.checkAll = false
        }
    },
    computed: {
        loadingRequest () {
            return this.$store.getters['template/shared/loadingRequest']
        },
        loadingSend () {
            return this.$store.getters['chat/message/loading']
        },
        colors () {
            return this.$store.getters['template/colors/colors']
        },
        programId () {
            return this.$store.getters["brand/program/programId"]
        },
        chatUser () {
            return this.$store.getters["chat/chatUser/chatUser"]
        },
        editedConversation () {
            return this.$store.getters["chat/conversation/editedConversation"]
        },
        isPrivateChat () {
            let activeMembers = this.editedConversation.members.filter(item => item.active)
            if (activeMembers.length === 1 || activeMembers.length === 2) return true
            return false
        },
        clients () {
            return this.editedConversation.members
        }
    },
    methods: {
        close () {
            this.members = []
            this.$emit('update:dialog', false)
        },
        isEmptyObject (obj) {
            return JSON.stringify(obj) === '{}'
        },

        /*
         * ПОЛУЧАТЕЛИ
         */

        setRecipientAll () {
            if (this.members.length == this.clients.length) {
                this.members = []
            } else {
                this.members = Object.assign([], this.clients)
            }
        },
        setRecipient (item) {
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
        isRecipient (item) {
            let check = this.members.filter(recipient => recipient.id === item.id)
            if (check.length) return true
            return false
        },
        submit (formRef) {
            this.$refs[formRef].validate((v) => {
                if (v) this.update()
                else return false
            })
        },
        update () {
            const conversation = {
                conversation_id: this.form.id,
                name: this.form.name,
            }
            ////console.log(conversation)
            this.$store.dispatch("chat/conversation/update", conversation).then(() => {
                this.close()
            })
        },
        openAdd () {
            this.dialogAdd = true
        },
        openRemove (item) {
            this.editedItem = item
            this.dialogRemove = true
        }
    },
    async created () {
        this.$store.commit('chat/conversation/editedConversation', this.item)
        this.form.id = this.editedConversation.id
        this.form.name = this.editedConversation.name
        this.members = Object.assign([], this.clients)
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

.remove-link {
    padding: 5px ;
    color: #FF8A65;
    cursor: pointer;
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
