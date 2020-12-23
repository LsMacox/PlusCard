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
