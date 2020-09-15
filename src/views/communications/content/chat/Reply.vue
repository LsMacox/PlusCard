<template>
<div>
    <div
            v-if="dialog"
            class="reply-box"
    >
        <div
                class="reply-box-message"
        >
            <div
                    class="reply-box-message-author"
            >{{name}}</div>
            <div
                    class="reply-box-message-text"
            >{{getMessage(message)}}</div>
        </div>

        <v-spacer></v-spacer>

        <div style="margin: 3px;">
            <v-icon
                    color="blue"
                    class="reply-box-icon"
                    @click="close()"
            >clear</v-icon>
        </div>

    </div>
</div>
</template>

<script>
export default {
    props: [
        'dialog',
        'name',
        'message'
    ],
    data () {
        return {

        }
    },
    methods: {
        close () {
            this.$emit('update:dialog', false)
        },
        getMessage (item) {
            let message = item
            if (message) {
                //////console.log(message)
                if (message && message.attachments.length) {
                    if (message.attachments[0].type == 'message/text') return message.attachments[0].content
                    if (message.attachments[0].type == 'plus/account') return 'карта'
                    if (message.attachments[0].type == 'media/image') return 'изображение'
                    if (message.attachments[0].type == 'media/audio') return 'аудиосообщение'
                    if (message.attachments[0].type == 'media/video') return 'видео'
                    if (message.attachments[0].type == 'media/file') return 'файл'
                }
                return message.message
            }
            return ''
        }
    }
}
</script>

<style scoped>
    .reply-box {
        display: flex;
        position: absolute;
        top: -45px;
        left: 0;
        right: 0;
        padding: 2px 3px 2px 7px;
        height: 45px;
        background-color: #ffffff;
        border-left: 4px solid #ff0000;
        z-index: 3;
    }

    .reply-box-message {
        width: 90%;
    }

    .reply-box-message-author {
        color: #ff0000;
    }

    .reply-box-message-text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .reply-box-icon {
        font-size: 34px;
    }
</style>