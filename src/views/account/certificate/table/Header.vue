<template>
  <div class="loyalty-toolbar">
    <div class="loyalty-toolbar-name">
      {{ program.name }}
    </div>
    <div class="loyalty-toolbar-period">
      <date-range-select
        min-width="250px"
        :items="periods"
        :model.sync="periodId"
        item-value="id"
        item-label="name"
      />
    </div>
    <div class="app__spacer" />
    <div
      style="display: inline-grid;"
    >
      <div
        class="loyalty-toolbar-text-btn"
      >
        <span
          class="iconify loyalty-toolbar-text-btn-icon"
          style="margin-right: 2px;"
          data-icon="ion:document-outline"
          data-inline="false"
        />
        Экспорт в XLS
      </div>
    </div>
    <div
      style="display: inline-grid; margin-left: 16px;"
    >
      <v-btn
        color="secondary"
        @click="onMasterCreateCert"
      >
        <v-icon left>
          $iconify_feather-settings
        </v-icon> Настроить сертификаты
      </v-btn>
    </div>
    <div
      style="display: inline-grid; margin-left: 16px;"
    >
      <v-btn
        color="primary"
      >
        <v-icon left>
          $iconify_plus-circle-outlined
        </v-icon> Создать новый сертификат
      </v-btn>
    </div>
  </div>
</template>

<script>
  import DateRangeSelect from '@/components/dialogs/DateRangeSelect'

  export default {
    components: {
      DateRangeSelect,
    },
    props: {
    },
    data () {
      return {
        periodId: null,
        periods: [
          { id: 1, name: 'за сегодня', start: new Date(Date.now()).toISOString(), end: new Date(Date.now()).toISOString() },
          { id: 2, name: 'за последние 7 дней', start: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
          { id: 3, name: 'за последние 30 дней', start: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
          { id: 4, name: 'за последние 90 дней', start: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
          { id: 5, name: 'за последние 180 дней', start: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
          { id: 6, name: 'за последние 365 дней', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
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
          return this.$store.getters['account/certificate/filter/period']
        },
        set (v) {
          this.$store.commit('account/certificate/filter/period', v)
        },
      },
    },
    watch: {
      periodId (v) {
        if (v) {
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
      formatRange (range) {
        const start = range.split(' - ')[0]
        const end = range.split(' - ')[1]
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
          return this.$moment(start).format('ll') + ' - ' + this.$moment(end).format('ll')
        }
        return ' - '
      },
      onMasterCreateCert () {
        this.$router.push({ name: 'ProgramCertificateMaster' })
      },
    },
  }
</script>

<style lang="scss" scoped>
.loyalty-toolbar {
  display: flex;
  align-items: center;
  margin: 0;

  .loyalty-toolbar-name {
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: #2A2A34;
    max-width: 35%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .loyalty-toolbar-period {
    display: flex;
    align-items: flex-end;
    margin-left: 12px;
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

  .loyalty-toolbar-text-btn {
    position: relative;
    top: -2px;
    margin-right: 2px;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 17px;
    color: #4776E6;
    cursor: pointer;

    .loyalty-toolbar-text-btn-icon {
      position: relative;
      top: 4px;
      font-size: 18px;
    }
  }
}
</style>
