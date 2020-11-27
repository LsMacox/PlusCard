<template>
  <div class="app--component-reply">
    <div
      v-if="dialog"
      class="reply-box"
    >
      <div class="reply-box-close">
        <iconify-icon
          class="icon"
          icon="ion-close-circle-outline"
          width="21"
          @click="close"
        />
      </div>
      <div class="reply-box-message">
        <div class="reply-box-message-author">
          <p class="body-s-semibold neutral-900--text">
            {{ name }}
          </p>
        </div>
        <div class="reply-box-message-text">
          <p class="body-s-regular neutral-900--text">
            {{ getMessage(message) }}
          </p>
        </div>
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
      return {
      }
    },
    watch: {},
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
