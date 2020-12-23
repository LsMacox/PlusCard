<template>
  <div class="app--component--edit">
    <div class="edit-box">
      <div class="edit-box-close">
        <iconify-icon
          class="icon"
          icon="ion-close-circle-outline"
          width="21"
          @click="close"
        />
      </div>
      <div class="edit-box-message">
        <p
          class="body-s-semibold neutral-900--text mb-0"
          :style="!getMessage(msgItem) || !getMessage(msgItem).length ? 'margin-top: 8px;' : ''"
        >
          Редактирования сообщения
        </p>
        <p
          class="body-s-regular neutral-neutral-900--text mb-0"
          v-html="formatMessage(getMessage(msgItem))"
        />
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
      isEditMessage: Boolean,
      msgItem: {
        type: [Object, Array],
        required: true,
      },
    },
    methods: {
      close () {
        this.$emit('update:isEditMessage', false)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
