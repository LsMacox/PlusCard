<template>
  <div class="crm__empty b-client__empty">
    <empty
      sub-text="Здесь будет отображаться актуальная информация
      по базе ваших клиентов"
    />
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
        this.$emit('update:sidePanelNewClientStatus', true)
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>
