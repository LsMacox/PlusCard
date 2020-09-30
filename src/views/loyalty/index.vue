<template>
  <div
    class="loyalty-block"
  >
    <toolbar />
    <widget-line />
    <app-table />
  </div>
</template>

<script>
  import Toolbar from '@/views/loyalty/report/Toolbar'
  import WidgetLine from '@/views/loyalty/report/widget/index'
  import AppTable from '@/views/loyalty/report/table/index'

  export default {
    components: {
      Toolbar,
      WidgetLine,
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
        return this.$store.getters['widget/filter/period']
      },
      filter () {
        return this.$store.getters['widget/filter/filter']
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
      await this.$store.dispatch('widget/operators/operators', this.program.id)
      await this.fetchData()
    },
    methods: {
      async fetchData () {
        console.log('fetchData ALL')
        try {
          this.loading = true
          const widget = {
            program_id: this.program.id,
            start_period: this.period.start,
            end_period: this.period.end,
            filter: this.filter,
            offset: 0,
            limit: 25,
          }
          // console.log('load_data', widget)
          // console.log('load_data', this.period)

          await this.$store.dispatch('company/bonus_resources/GetActiveShortList', this.program.id)
          await this.$store.dispatch('company/bonus_units/loadBonusUnits', this.program.id)
          //
          await this.$store.dispatch('widget/bonusClients/widget', widget)
          await this.$store.dispatch('widget/operations/widget', widget)
          await this.$store.dispatch('widget/operators/widget', widget)
          await this.$store.dispatch('widget/bonuses/widget', widget)
          await this.$store.dispatch('widget/table/widget', widget)
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
