<template>
  <div class="app--component-reply">
    <div
      v-if="dialog"
      class="reply-box"
    >
      <div class="reply-box-message">
        <div class="reply-box-message-author">
          {{ name }}
        </div>
        <div class="reply-box-message-text">
          {{ getMessage(message) }}
        </div>
      </div>

      <v-spacer />

      <div style="margin: 3px">
        <v-icon
          color="blue"
          class="reply-box-icon"
          @click="close()"
        >
          clear
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      dialog: Boolean,
      name: {
        type: String,
        default: '',
      },
      message: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {}
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      getMessage (item) {
        const message = item
        if (message) {
          // console.log(message)
          if (message && message.attachments.length) {
            if (message.attachments[0].type === 'message/text') {
              return message.attachments[0].content
            }
            if (message.attachments[0].type === 'plus/account') return 'карта'
            if (message.attachments[0].type === 'media/image') {
              return 'изображение'
            }
            if (message.attachments[0].type === 'media/audio') {
              return 'аудиосообщение'
            }
            if (message.attachments[0].type === 'media/video') return 'видео'
            if (message.attachments[0].type === 'media/file') return 'файл'
          }
          return message.message
        }
        return ''
      },
    },
  }
</script>
