<template>
  <div class="pls--page-header">
    <div class="pls--page-header-title title-m-bold">
      Шаблоны сообщений
    </div>
    <v-spacer />
    <v-btn
      class="pls--page-header-btn-right"
      color="primary"
      :to="{name: 'SendingsTemplatesForm', params: { id: 'new' }}"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Создать шаблон
    </v-btn>
  </div>
</template>

<script>
  export default {
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
