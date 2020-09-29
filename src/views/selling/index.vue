<template>
  <div
    class="loyalty-block"
  >
    <toolbar />
    <app-table />
  </div>
</template>

<script>
  import Toolbar from '@/views/selling/report/Toolbar'
  import AppTable from '@/views/selling/report/table/index'

  export default {
    components: {
      Toolbar,
      AppTable,
    },
    data () {
      return {
        searchText: '',
        loading: false,
      }
    },
    computed: {
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      loadingApp () {
        return this.$store.getters['template/shared/loadingApp']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      period () {
        return this.$store.getters['selling/filter/period']
      },
      filter () {
        return this.$store.getters['selling/filter/filter']
      },
    },
    watch: {
      program (v) {
        if (v) {
          this.fetchData()
        }
      },
      filter (v) {
        if (v) {
          this.fetchData()
        }
      },
      period (v) {
        if (v) {
          this.fetchData()
        }
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      async fetchData () {
        console.log('fetchData dfsdfsdf')
        try {
          this.loading = true
          const list = {
            program_id: this.program.id,
            start_period: this.period.start,
            end_period: this.period.end,
            filter: this.filter,
          }
          await this.$store.dispatch('selling/table/table', list)
          // await this.$store.dispatch('widget/table/widget', widget)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/loyalty-report";
</style>
