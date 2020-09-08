<template>
    <div class="app--conversation--header">
        <div style="display: flex;">
            <div class="app--conversation--header__title">
                {{getConversationName(conversation)}}
            </div>
            <div class="app--conversation--header__count">
                {{getActiveMembers(activeMembers.length)}}
            </div>
        </div>
        <div style="display: flex; margin-right: 30px;">
            <div class="app--conversation--header__toolbar">
                <div class="app--conversation--header__toolbar__icon" style="cursor: pointer;">
                    <input v-if="visibleSearchProp" v-model="searchStringProp" class="app--conversation--header__toolbar__search" type="text"></input>
                    <i class="fa fa-search" aria-hidden="true" @click="visibleSearchProp = !visibleSearchProp"></i>
                </div>
                <div
                        class="app--conversation--header__toolbar__icon"
                        style="margin-left: 34.5px; cursor: pointer;"
                        @click="setChosen(conversation)"
                >
                    <i
                            v-if="conversation.chosen"
                            class="fas fa-star nameFavorite"
                    ></i>
                    <i
                            v-else
                            class="far fa-star"
                            aria-hidden="true"
                    ></i>
                </div>
                <div
                        class="app--conversation--header__toolbar__icon"
                        style="margin-left: 30.5px; width:15px; height: 15px; margin-top: 3px; cursor: pointer;"
                        @click="setMuted(conversation)"
                >
                    <img
                            v-if="conversation.muted"
                            src="/icons/volume_off.svg" />
                    <img
                            v-else
                            src="/icons/volume.svg"/>
                </div>
            </div>
            <div
                    v-if="chatUser.id == conversation.creator_id"
                    class="app--conversation--header__burger"
            >
                <i
                        class="fas fa-ellipsis-v"
                        style="cursor: pointer;"
                        @click="openUpdate(conversation)"
                ></i>
            </div>
        </div>

        <chat-update
                v-if="dialogUpdate"
                :dialog.sync="dialogUpdate"
                :item="editedItem"
        ></chat-update>

    </div>
</template>

<script>
    import ChatUpdate from "./chat/Update"

    export default {
        components: {
            ChatUpdate,
        },
        props: {
            conversationId: String | Number,
            visibleSearch: Boolean,
            searchString: String
        },
        data() {
            return {
                dialogUpdate: false,
                editedItem: {},
            }
        },
        computed: {
            visibleSearchProp: {
                get(){
                  return this.visibleSearch;
                },
                set(v){
                    this.$emit('update:visibleSearch', v)
                }
            },
            searchStringProp: {
                get(){
                    return this.searchString;
                },
                set(v){
                    this.$emit('update:searchString', v)
                }
            },
            chatUser() {
                return this.$store.getters["chat/chatUser/chatUser"]
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
            activeMembers() {
                if (!this.isEmptyObject(this.conversation)) return this.conversation.members.filter(item => item.active)
                return []
            },
        },
        methods: {
            isEmptyObject(obj) {
                return JSON.stringify(obj) === "{}"
            },
            getActiveMembers(count) {
                let members = ['участник', 'участника', 'участников']
                return count + ' ' + this.declOfNum(count, members)
            },
            declOfNum(number, titles) {
                let cases = [2, 0, 1, 1, 1, 2]
                return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]
            },
            getConversationName(conversation) {
                let name = 'Чат'
                //
                if (this.activeMembers.length > 2) name = conversation.name
                else {
                    // ищем во всех участниках, включая удаленных
                    this.members.forEach(item => {
                        if (item.id != this.chatUser.id) name = item.name
                    })
                }
                return name
            },
            setChosen(item) {
                let conversation = {
                    conversation_id: item.id,
                }
                if (item.chosen) {
                    this.$store.dispatch('chat/conversation/chosenRemove', conversation)
                } else {
                    this.$store.dispatch('chat/conversation/chosenSet', conversation)
                }
            },
            setMuted(item) {
                let conversation = {
                    conversation_id: item.id,
                }
                if (item.muted) {
                    this.$store.dispatch('chat/conversation/mutedRemove', conversation)
                } else {
                    this.$store.dispatch('chat/conversation/mutedSet', conversation)
                }
            },
            openUpdate(item) {
                this.editedItem = item
                this.dialogUpdate = true
            },
        }
    };
</script>

<style lang="scss" scoped>
    .app--conversation--header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 68px;
        line-height: 68px;
        border-bottom: 1px solid #EBEBEB;

        .app--conversation--header__title {
            font-weight: bold;
            font-size: 20px;
            line-height: 24px;
            height: 24px;
            margin: 22px 28px 22px 22px;
            color: #686868;
        }

        .app--conversation--header__count {
            font-weight: 300;
            font-size: 13px;
            line-height: 16px;
            color: #686868;
            height: 16px;
            margin-top: 28px;
        }

        .app--conversation--header__toolbar {
            display: flex;
            flex-direction: row;

            .app--conversation--header__toolbar__icon {
                position: relative;
                color: #C4C4C4;
                height: 15px;
                width: 15px;

                .nameFavorite {
                    color: #F5CB47 !important;
                }
            }
        }

        .app--conversation--header__burger {
            color: #C4C4C4;
            font-size: 20px;
            margin-left: 35px;
        }


    }

    .app--conversation--header__toolbar__search{
        width: 150px;
        height: 20px;
        border-bottom: 1px solid #eaeaea;
        position: absolute;
        top: 25px;
        left: -155px;
        outline: none;
    }
</style>