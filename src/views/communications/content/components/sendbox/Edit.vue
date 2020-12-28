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
          :style="!getShortMessage(msgItem) || !getShortMessage(msgItem).length ? 'margin-top: 8px;' : ''"
        >
          Редактирования сообщения
        </p>
        <p
          class="body-s-regular neutral-neutral-900--text mb-0"
          v-html="removeCarry(formatMessage(getShortMessage(msgItem)))"
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
      msgItem: {
        type: [Object, Array],
        required: true,
      },
    },
    methods: {
      close () {
        this.$store.commit('chat/sendbox/isEdit', false)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
