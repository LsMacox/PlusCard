<template>
  <div
    class="loyalty-block"
  >
    <toolbar />
    <widget-line />
    <app-table v-show="tableData.length" />
    <div
      v-show="!tableData.length"
      class="dummy-screen"
    >
      <v-img
        class="dummy-screen-img"
        src="@//assets/png/loyalty-dummy.png"
      />
      <div class="dummy-screen-header title-s-bold">
        Здесь пока ничего нет :’(
      </div>
      <div class="dummy-screen-text body-m-regular">
        Здесь отобрается информация по операциям програмы лояльности. По текущим настройкам фильтра или периода данных нет.
      </div>
    </div>
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
      tableData () {
        return this.$store.getters['widget/table/widgetData']
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

.dummy-screen {
    margin: 100px 0;

    .dummy-screen-img {
      margin: 0 auto;
      width: 186px;
      height: 156px;
  }

    .dummy-screen-header {
      margin: 34px auto 0 auto;
      max-width: 500px;
      text-align: center;
  }

    .dummy-screen-text {
      margin: 12px auto 0 auto;
      max-width: 500px;
      text-align: center;
  }
}
</style>
