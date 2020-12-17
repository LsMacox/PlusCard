<template>
  <div class="toolbar-col toolbar-col-left">
    <div class="toolbar-name">
      Продажи
    </div>
    <div class="toolbar-period">
      <date-range-select
        min-width="250px"
        :items="periods"
        :model.sync="periodId"
        item-value="id"
        item-label="name"
      />
    </div>
  </div>
</template>

<script>
  import ApiService from '@/api/api-client'
  import DateRangeSelect from '@/components/dialogs/DateRangeSelect'

  export default {
    components: {
      DateRangeSelect,
    },
    props: {
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
      filter () {
        return this.$store.getters['selling/filter/filter']
      },
      periods () {
        return this.$store.getters['reference/date_selection/periods']
      },
      period () {
        return this.$store.getters['reference/date_selection/period']
      },
      periodId: {
        get () {
          return this.$store.getters['reference/date_selection/periodId']
        },
        set (v) {
          this.$store.commit('reference/date_selection/periodId', v)
        },
      },
    },
    methods: {
      async excelExport () {
        try {
          this.loading = true
          const widget = {
            program_id: this.program.id,
            start_period: this.period.start,
            end_period: this.period.end,
            filter: this.filter,
          }
          // console.log(widget)
          ApiService.downloadFile(
            '/api-cabinet/widget/excel',
            widget,
            `Отчет по бонусной программе компании №${this.program.id} от ${this.$moment().format(this.$config.date.DATE_FORMAT)}.xls`,
          )
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.toolbar-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0;

  .toolbar-name {
    max-width: calc(100% - 232px);
    padding-right: 12px;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: #2A2A34;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .toolbar-period {
    width: 220px;
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 22px;
    letter-spacing: 0.4px;
    color: #4776E6;
    cursor: pointer;

    .loyalty-toolbar-period-chevron {
      font-size: 24px;
      position: relative;
      top: 4px;
    }
  }
}

.toolbar-col-left {
  justify-content: flex-start;
  padding-top: 5px;
}

.toolbar-col-right {
  justify-content: flex-end;
  @media (max-width: 1263.98px) {
    justify-content: flex-start;
  }
}
</style>
