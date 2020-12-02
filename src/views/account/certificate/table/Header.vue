<template>
<!--  <div class="loyalty-toolbar">-->
<!--    <div class="loyalty-toolbar-name">-->
<!--      {{ program.name }}-->
<!--    </div>-->
<!--    <div class="toolbar-period">-->
<!--      <date-range-select-->
<!--          min-width="250px"-->
<!--          :items="periods"-->
<!--          :model.sync="periodId"-->
<!--          item-value="id"-->
<!--          item-label="name"-->
<!--      />-->
<!--    </div>-->
<!--    <v-menu-->
<!--      v-model="chevronUp"-->
<!--      class="certificate-toolbar-select"-->
<!--      :rounded="false"-->
<!--      offset-y-->
<!--    >-->
<!--      <template v-slot:activator="{ on, attrs }">-->
<!--        <v-btn-->
<!--          text-->
<!--          color="primary"-->
<!--          dark-->
<!--          v-bind="attrs"-->
<!--          class="archive-status-btn"-->
<!--          v-on="on"-->
<!--        >-->
<!--          {{ archiveStatus.text }}-->
<!--          <v-icon class="archive-status-chevron">-->
<!--            {{ !chevronUp ? 'fas fa-chevron-down' : 'fas fa-chevron-up' }}-->
<!--          </v-icon>-->
<!--        </v-btn>-->
<!--      </template>-->
<!--      <v-list>-->
<!--        <v-list-item-->
<!--          v-for="(item, index) in archiveStatuses"-->
<!--          :key="index"-->
<!--          class="archive-status-menu-item"-->
<!--          @click="archiveStatusHandler(item)"-->
<!--        >-->
<!--          <v-list-item-title>-->
<!--            {{ item.text }}-->
<!--            <div-->
<!--              v-if="archiveStatus.id === item.id"-->
<!--              class="archive-status-check-icon"-->
<!--            >-->
<!--              <span-->
<!--                class="iconify"-->
<!--                data-icon="bx:bx-check"-->
<!--                data-inline="false"-->
<!--              />-->
<!--            </div>-->
<!--          </v-list-item-title>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-menu>-->
<!--    <div class="app__spacer" />-->
    <!--      <div-->
    <!--        style="display: flex;"-->
    <!--      >-->
    <!--        <div-->
    <!--          class="loyalty-toolbar-text-btn"-->
    <!--          @click=""-->
    <!--        >-->
    <!--          <span-->
    <!--            class="iconify loyalty-toolbar-text-btn-icon"-->
    <!--            style="margin-right: 2px;"-->
    <!--            data-icon="ion:document-outline"-->
    <!--            data-inline="false"-->
    <!--          />-->
    <!--          Экспорт в XLS-->
    <!--        </div>-->
    <!--      </div>-->
<!--    <div-->
<!--      style="display: flex; margin-left: 16px;"-->
<!--    >-->
<!--      <v-btn-->
<!--        color="secondary"-->
<!--        :to="{name:'ProgramCertificateList'}"-->
<!--      >-->
<!--        <v-icon left>-->
<!--          $iconify_feather-settings-->
<!--        </v-icon> Настроить сертификаты-->
<!--      </v-btn>-->
<!--    </div>-->
<!--    <div-->
<!--      style="display: flex; margin-left: 16px;"-->
<!--    >-->
<!--      <v-btn-->
<!--        color="primary"-->
<!--        :to="{name: 'ProgramCertificateMaster' }"-->
<!--      >-->
<!--        <v-icon left>-->
<!--          $iconify_plus-circle-outlined-->
<!--        </v-icon> Создать новый сертификат-->
<!--      </v-btn>-->
<!--    </div>-->
<!--  </div>-->
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
              :to="{name:'ProgramCertificateList'}"
              style="margin-right: 16px;"
            >
              <v-icon left>
                $iconify_feather-settings
              </v-icon> Настроить сертификаты
            </v-btn>
            <v-btn
              color="primary"
              :to="{name: 'ProgramCertificateMaster' }"
            >
              <v-icon left>
                $iconify_plus-circle-outlined
              </v-icon> Создать новый сертификат
            </v-btn>
      </div>
    </v-col>
  </v-row>
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
        chevronUp: false,
        // filter: null,
        archiveStatuses: [
          { id: 'work', text: 'в работе' },
          { id: 'archive', text: 'в архиве' },
        ],
        periodId: null,
        periods: [
          { id: 1, name: 'за сегодня', start: new Date(Date.now()).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 2, name: 'за вчера', start: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0] },
          { id: 3, name: 'за последние 7 дней', start: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 4, name: 'за последние 30 дней', start: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 5, name: 'за последние 90 дней', start: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 6, name: 'за последние 180 дней', start: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          { id: 7, name: 'за последние 365 дней', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
          // { id: 7, name: 'собственный диапазон', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
        ],
      }
    },
    computed: {
      filter () {
        return this.$store.getters['account/certificate/filter/filter']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      archiveStatus: {
        get () {
          return this.$store.getters['account/certificate/filter/archiveStatus']
        },
        set (v) {
          this.$store.commit('account/certificate/filter/archiveStatus', v)
        },
      },
      period: {
        get () {
          return this.$store.getters['widget/filter/period']
        },
        set (v) {
          this.$store.commit('widget/filter/period', v)
        },
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
      // archiveStatusHandler (item) {
      //   this.chevronUp = !this.chevronUp
      //   this.$store.commit('account/certificate/filter/archiveStatus', item)
      // },
      statusSelectIcon () {
        if (this.chevronUp) {
          return 'fas fa-chevron-down'
        } else {
          return 'fas fa-chevron-down'
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.archive-status-chevron {
  font-size: 14px;
  padding-left: 7px;
}

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

.archive-status-btn {
  text-transform: lowercase;
  font-family: Gilroy;
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 22px;
  &::before {
    background-color: transparent!important;
  }
}

.archive-status-menu-item {
  .v-list-item__title {
    font-family: Gilroy;
    font-style: normal;
    font-size: 15px;
    line-height: 21px;
    color: rgb(145, 145, 161) !important;

    svg {
      font-size: 26px;
    }
  }
}

.archive-status-check-icon {
  float: right;
  position: relative;
  top: -6px;
  color: #4776e6!important;
}

@media (max-width: 1415px) {
  .loyalty-toolbar {
    flex-wrap: wrap;
  }
}

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
