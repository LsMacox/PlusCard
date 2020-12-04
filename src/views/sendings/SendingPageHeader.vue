<template>
  <div class="pls--page-header">
    <div class="pls--page-header-title title-m-bold">
      Рассылки
    </div>
    <v-spacer />
    <v-btn
      class="pls--page-header-btn-right"
      color="secondary"
      :to="{name:'SendingsTemplates'}"
    >
      <v-icon left>
        $iconify_feather-settings
      </v-icon>Настроить шаблоны
    </v-btn>
    <v-btn
      class="pls--page-header-btn-right"
      color="primary"
      @click=""
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon> Создать рассылку
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
