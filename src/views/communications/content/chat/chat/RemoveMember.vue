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

        <div class="header">Удалить участника?</div>

        <div class="content">

            <div>Участник: {{item.name}}</div>

        </div>

        <div class="action">
            <el-button
                    size="medium"
                    @click="close()"
            >Отмена</el-button>

            <div class="app--spacer"></div>

            <el-button
                    type="danger"
                    size="medium"
                    :loading="loadingRequest"
                    @click="remove()"
            >Удалить</el-button>
        </div>

    </div>
</el-dialog>
</template>

<script>
export default {
    props: {
        dialog: Boolean,
        conversationId: Number,
        item: Object
    },
    data () {
        return {
            loading: false,
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
        }
    },
    methods: {
        close () {
            this.$emit('update:dialog', false)
        },
        isEmptyObject (obj) {
            return JSON.stringify(obj) === '{}'
        },
        remove () {
            const conversation = {
                conversation_id: this.conversationId,
                members: [this.item.id]
            }
            ////console.log(conversation)
            this.$store.dispatch("chat/member/remove", conversation).then(() => {
                this.close()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/components/_modal.scss"; 

.modal {
    min-width: 500px;
}

.content {
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
