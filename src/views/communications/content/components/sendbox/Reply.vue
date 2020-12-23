<template>
  <div class="app--component-reply">
    <div
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
  // Mixins
  import MixinIndex from '@/views/communications/mixins/index.js'

  export default {
    mixins: [
      MixinIndex,
    ],
    props: {
      conversationId: {
        type: [Number, String],
        default: '',
      },
      isReplyMessage: Boolean,
      message: {
        type: [Object, Array],
        required: true,
      },
    },
    data () {
      return {
      }
    },
    computed: {
      payload () {
        return this.$store.getters['chat/data/payload'](this.conversationId)
      },
      // template
      name () {
        console.log('msgItem:', this.message)
        console.log('payload:', this.payload)
        return this.getAuthorName(this.message, this.payload)
      },
    },
    watch: {},
    methods: {
      close () {
        this.$emit('update:isReplyMessage', false)
      },
    },
  }
</script>
