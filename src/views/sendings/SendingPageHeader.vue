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
      @click="openCreate()"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon> Создать рассылку
    </v-btn>
    <sending-create
      v-if="dialogCreate"
      v-model="dialogCreate"
    />
  </div>
</template>

<script>
  import SendingCreate from './SendingCreate'

  export default {
    components: {
      SendingCreate,
    },
    data () {
      return {
        dialogCreate: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    methods: {
      openCreate () {
        this.dialogCreate = true
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
