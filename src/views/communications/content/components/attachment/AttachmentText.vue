<template>
  <div
    class="attachment-text"
  >
    <p class="body-s-regular neutral-900--text mb-0">
      {{ formatMessage(content) }}
    </p>
  </div>
</template>

<script>
  import MixinIndex from '@/views/communications/mixins/index.js'

  export default {
    mixins: [MixinIndex],
    props: {
      content: {
        type: String,
        default: '',
      },
    },
  }
</script>
