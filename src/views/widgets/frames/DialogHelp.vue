<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    width="500"
    @click:outside="close"
    @keydown="close"
  >
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ header }}
      </v-card-title>

      <v-card-text
        style="padding: 20px 24px;"
        v-html="text"
      />

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          @click="close"
        >
          Понятно
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
      header: {
        type: String,
        default: 'Заголовок виджета',
      },
      text: {
        type: String,
        default: 'Текст помощи',
      },
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
