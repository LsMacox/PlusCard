<template>
<div class="purchase">

    <div class="purchase-author">{{getAuthor()}} создал(а):</div>
    <div class="purchase-name">{{content.name}}</div>

    <div class="list">
        <div
                v-for="(item, i) in content.products"
                :key="i"
                class="product-row"
        >
            <div
                    v-if="item.performed_at"
                    class="product-check"
            >
                <v-img :src="'../img/' + iconCheck"></v-img>
            </div>
            <div
                    v-else
                    class="product-check"
            >
                <v-img :src="'../img/' + iconUnCheck"></v-img>
            </div>
            <div>{{item.name}}</div>
        </div>
    </div>

    <div
            v-if="checkJoin()"
            class="button"
            @click="join()"
    >
        <v-icon color="#07C9EB">add</v-icon>
        <div class="button-text">Присоединиться</div>
    </div>

</div>
</template>

<script>
export default {
    props: [
        'content'
    ],
    data () {
        return {
            iconCheck: 'purchase-check.png',
            iconUnCheck: 'purchase-uncheck.png'
        }
    },
    computed: {
        colors () {
            return this.$store.getters['template/colors/colors']
        },
        chatUser () {
            return this.$store.getters['chat/chatUser/chatUser']
        }
    },
    methods: {
        getAuthor () {
            let author = ''
            if (this.content) {
                let creatorId = this.content.creator_id
                this.content.members.forEach(item => {
                    if (item.id == creatorId) {
                        author = item.name
                    }
                })
            }
            return author
        },
        checkJoin () {
            let check = false
            if (this.content) {
                let chatUserId = this.chatUser.id
                this.content.members.forEach(item => {
                    if (item.id == chatUserId && item.status == 'invited') {
                        check = true
                    }
                })
            }
            return check
        },
        async join () {
            const join = {
                list_id: this.content.id
            }
            ////console.log(join)
            // токен чат-пользователя для операций с чатами

            //this.$store.dispatch('purchase/purchase/join', join)
        }
    },
    mounted () {
        ////console.log(this.content)
    }
}
</script>

<style scoped>
    .purchase {
        padding: 10px;
        border-radius: 4px;
        color: #ffffff;
        background-color: #07C9EB;
    }

    .purchase-author {
        font-weight: 300;
    }

    .list {
        padding: 7px;
    }

    .product-row {
        display: flex;
    }

    .product-check {
        margin: 4px;
    }

    .button {
        padding: 5px;
        border-radius: 4px;
        background-color: #ffffff;
        text-align: center;
        cursor: pointer;
    }

    .button-text {
        display: inline-block;
        padding: 2px;
        font-weight: 300;
        color: #07C9EB;
    }
</style>