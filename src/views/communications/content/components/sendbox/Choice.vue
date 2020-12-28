<template>
  <div class="app--component-choice">
    <div
      class="choice-box"
    >
      <div class="choice-box-delete">
        <v-btn
          style="padding: 15px 5px !important;"
          class="choice-btn"
          text
          outlined
        >
          <iconify-icon
            class="icon-trash"
            icon="feather-trash"
            width="21"
          />
        </v-btn>
      </div>
      <div class="choice-box-message">
        <p class="body-s-semibold neutral-900--text mb-0">
          Выбрано {{ choiceMessageIds.length }} {{ declOfNum(choiceMessageIds.length, choiceText) }} <a
            href="#reset"
            @click="close"
          >Сбросить</a>
        </p>
      </div>
      <div class="choice-box-forward">
        <v-btn
          style="padding: 15px 5px !important;"
          class="choice-btn"
          text
          outlined
        >
          <iconify-icon
            class="icon-forward"
            icon="typcn-forward-outline"
            width="21"
          />
        </v-btn>
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
    data () {
      return {
        choiceText: ['сообщение', 'сообщения', 'сообщений'],
      }
    },
    computed: {
      choiceMessageIds () {
        return this.$store.getters['chat/sendbox/choiceMessageIds']
      },
    },
    methods: {
      close () {
        this.$store.commit('chat/sendbox/isChoice', false)
      },
    },
  }
</script>
