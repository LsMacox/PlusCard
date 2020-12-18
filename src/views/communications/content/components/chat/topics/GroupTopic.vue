<template>
  <div class="user-topic">
    <div class="user-topic__header">
      <p class="title-m-bold neutral-900--text">
        Темы чата «{{ conversationName }}»
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    computed: {
      conversation () {
        return this.$store.getters['chat/data/conversation'](this.conversationId)
      },
      conversationName () {
        return this.conversation.display_name && this.conversation.display_name.length
          ? this.conversation.display_name
          : 'Без названия'
      },
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
    },

  }
</script>
