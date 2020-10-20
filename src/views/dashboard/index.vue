<template>
  <dashboard
    v-if="programs && programs.length"
  />
  <base-empty-block-page
    v-else
    title="Добавьте свою компанию в Plus!"
    action-icon="$iconify_ant-design-gift-outlined"
    action-text="Добавить компанию"
    action
    @action="$router.push('/master')"
  >
    <template v-slot:image>
      <v-img
        src="@/assets/png/Empty-Company.png"
        max-width="215px"
        max-height="175px"
      />
    </template>
    <template v-slot:description>
      <span>Создавайте и настраивайте программы и сертификаты,<br> отслеживайте показатели продаж и многое другое.</span>
    </template>
  </base-empty-block-page>
</template>

<script>
  import Dashboard from './Dashboard'
  import EmptyCompany from './EmptyCompany'
  export default {
    components: {
      Dashboard,
      EmptyCompany,
    },
    data () {
      return {}
    },
    computed: {
      programs () {
        return this.$store.getters['company/program/programs']
      },
    },
  }
</script>
