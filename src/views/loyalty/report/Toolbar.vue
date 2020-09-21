<template>
  <v-row no-gutters>
    <v-col
      :cols="12"
      :sm="12"
      :md="12"
      :lg="8"
    >
      <div class="toolbar-col toolbar-col-left">
        <div class="toolbar-name">
          {{ program.name }}
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
    </v-col>
    <v-col
      :cols="12"
      :sm="12"
      :md="12"
      :lg="4"
    >
      <div class="toolbar-col toolbar-col-right">
        <v-btn
          color="secondary"
          :text="true"
          :ripple="false"
          style="margin-right: 16px;"
          :loading="loading"
          @click="excelExport()"
        >
          <v-icon style="position: relative; top: -2px; width: 18px; height: 18px; margin-right: 8px;">
            $iconify_ion-document-outline
          </v-icon>
          Экспорт в XLS
        </v-btn>
        <v-btn
          color="secondary"
          small
        >
          <v-icon style="width: 15px; height: 15px; margin-right: 8px;">
            $iconify_feather-settings
          </v-icon>
          Настроить программу лояльности
        </v-btn>
      </div>
    </v-col>
  </v-row>
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
        periodId: null,
        periods: [
          { id: 1, name: 'за сегодня', start: new Date(Date.now()).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 2, name: 'за вчера', start: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0] },
          { id: 3, name: 'за последние 7 дней', start: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 4, name: 'за последние 30 дней', start: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 5, name: 'за последние 90 дней', start: new Date(Date.now() - 89 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 6, name: 'за последние 180 дней', start: new Date(Date.now() - 179 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 7, name: 'за последние 365 дней', start: new Date(Date.now() - 364 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          // { id: 7, name: 'собственный диапазон', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      period: {
        get () {
          return this.$store.getters['widget/filter/period']
        },
        set (v) {
          this.$store.commit('widget/filter/period', v)
        },
      },
      filter () {
        return this.$store.getters['widget/filter/filter']
      },
    },
    watch: {
      periodId (v) {
        if (v !== this.period.id) {
          const period = this.periods.find(item => item.id === v)
          if (period) {
            this.period = period
          }
        }
      },
    },
    created () {
      if (this.period) this.periodId = this.period.id
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
