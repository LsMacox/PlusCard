<template>
  <div>
    <template-page-header />
    <template-table />
  </div>
</template>

<script>
  import TemplatePageHeader from './TemplatePageHeader'
  import TemplateTable from './TemplateTable'

  export default {
    components: {
      TemplatePageHeader,
      TemplateTable,
    },
    data () {
      return {
        loading: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    watch: {
      program: {
        async handler (v) {
          if (v && v.id) await this.fetchData()
        },
        deep: true,
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      async fetchData () {
        try {
          this.loading = true
          await this.$store.dispatch('company/notifications/list', { program_id: this.program.id })
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
