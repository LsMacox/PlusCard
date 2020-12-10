<template>
  <div>
    <sending-page-header />
    <sending-table />
  </div>
</template>

<script>
  import SendingPageHeader from './SendingPageHeader'
  import SendingTable from './SendingTable'

  export default {
    components: {
      SendingPageHeader,
      SendingTable,
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
          await this.$store.dispatch('company/sendings/list', { program_id: this.program.id })
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
