<template>
  <div>
    <sending-page-header />
  </div>
</template>

<script>
  import SendingPageHeader from './SendingPageHeader'

  export default {
    components: {
      SendingPageHeader,
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
