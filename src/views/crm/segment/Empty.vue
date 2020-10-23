<template>
  <div class="crm__empty b-segment__empty">
    <empty
      sub-text="Сегментируйте ваших клиентов, чтобы эффективнее управлять
     их вовлечением в вашу программу лояльности."
    />
    <v-btn
      class="b-segment__btn-create"
      color="primary"
      @click="toggleSidePanel"
    >
      <iconify-icon
        class="icon-dashboard"
        icon="carbon-diagram"
        height="21"
      />
      Создать сегмент
    </v-btn>
  </div>
</template>

<script>
  import Empty from '@/components/base/Empty'

  export default {
    name: 'EmptySegment',
    components: { Empty },
    data () {
      return {}
    },
    mounted () {},
    methods: {
      toggleSidePanel () {
        this.$emit('update:sidePanelStatus', { mode: 'create', active: true })
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>
