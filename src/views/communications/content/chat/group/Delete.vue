<template>
<v-dialog
        v-model="dialog"        
        custom-class="app--modal"
>
    <div class="modal">

        <div class="header">Удалить группу?</div>

        <div class="content">

            <div>Название: {{item.name}}</div>

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
</v-dialog>
</template>

<script>
export default {
    props: [
        'dialog',
        'item'
    ],
    data () {
        return {

        }
    },
    computed: {
        loadingRequest () {
            return this.$store.getters['template/shared/loadingRequest']
        },
        colors () {
            return this.$store.getters['template/colors/colors']
        }
    },
    methods: {
        close () {
            this.$emit('update:dialog', false)
        },
        remove () {
            const group = {
                id: this.item.id,
            }
            ////console.log(group)
            this.$store.dispatch("chat/group/delete", group).then(() => {
                this.close()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/components/_modal.scss"; 

.modal {
    min-width: 400px;
}

.content {
    margin: 0 0 20px 0;
    padding: 0 !important;
    max-height: 60vh;
    overflow-y: auto;
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