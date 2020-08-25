<template>
  <div
    v-loading="loading"
    class="report-wrapper"
  >
    <!--    <div class="widgets">-->
    <!--      <statistics />-->
    <!--    </div>-->
    <!--    <div class="toolbar">-->
    <!--      <toolbar-->
    <!--        :p-search-text.sync="searchText"-->
    <!--        @load-data="loadData()"-->
    <!--      />-->
    <!--    </div>-->
    <div class="table">
      <table-report :p-search="searchText" />
    </div>
  </div>
</template>

<script>
    // import Statistics from "../../../widgets/Statistics";
  // import Toolbar from '../account/Toolbar'
  import TableReport from './report/TableReport'
  export default {
    name: 'LoyaltyReport',
    // components: { TableReport, Toolbar, Statistics },
    components: { TableReport },
    data () {
      return {
        searchText: '',
        loading: false,
      }
    },
    computed: {
      // loadingRequest () {
      //   return this.$store.getters['template/shared/loadingRequest']
      // },
      // loadingApp () {
      //   return this.$store.getters['template/shared/loadingApp']
      // },
      program () {
        return this.$store.getters['program/program']
      },
      startPeriod () {
        console.log('start', this.$store.getters['report/startPeriodFilter'])
        return this.$store.getters['report/startPeriodFilter']
      },
      endPeriod () {
        return this.$store.getters['report/endPeriodFilter']
      },
      filter () {
        return this.$store.getters['report/filter']
      },
    },
    watch: {
      program (v) {
        this.loadData()
      },
      startPeriod (v) {
        this.loadData()
      },
      endPeriod (v) {
        this.loadData()
      },
      filter (v) {
        this.loadData()
      },
    },
    created () {
      if (!this.loadingApp) {
        this.$store.dispatch('report/filter')
        this.$store.dispatch('report/filterPeriod')
        // this.$store.dispatch('widget/operators/operators', this.program.id)
        this.$store.dispatch('report/operators/operators', 100149)
        // this.loadData()
      }
    },
    methods: {
      async loadData () {
        if (this.program != null && this.program.id) {
          const widget = {
            // program_id: this.program.id,
            program_id: 100149,
            start_period: this.startPeriod,
            end_period: this.endPeriod,
            filter: this.filter,
          }
          console.log('load_data', widget)
          this.loading = true
          await this.$store.dispatch('report/bonusClients/widget', widget)
          await this.$store.dispatch('report/operations/widget', widget)
          await this.$store.dispatch('report/operators/widget', widget)
          await this.$store.dispatch('report/bonuses/widget', widget)
          await this.$store.dispatch('report/table/widget', widget)
          this.loading = false
        }
      },
    },
  }

</script>

<style lang="scss" scoped>
    .report-wrapper {
        padding: 10px;
        background: #fff;
    }

    .toolbar{
        margin-top: 20px;
    }

    .table {
        margin-top: 20px;
    }
</style>
