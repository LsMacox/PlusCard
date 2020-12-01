<template>
  <div class="pls--page-header">
    <v-btn
      color="secondary"
      :text="true"
      :ripple="false"
      @click="$router.back()"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Назад
    </v-btn>
    <v-spacer />
    <v-btn
      color="secondary"
      :text="true"
      :ripple="false"
      @click=""
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Сохранить
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
