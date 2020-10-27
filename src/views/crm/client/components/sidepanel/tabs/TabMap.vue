<template>
  <div class="tab-map">
    <div class="tab-map__info">
      <ul class="info-list">
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            ID карты
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ accountClient.id || '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Номер карты
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ accountClient.number || '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Штрих-код
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ accountClient.barcode || '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Программа лояльности
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ accountClient.program_name || '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Создана
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ accountClient.created_at ? $moment(accountClient.created_at).local().format($config.date.DATETIME_FORMAT_MIN2) : '-' }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="tab-map__action">
      <div class="action__header">
        <p class="body-l-semibold">
          Действия с картой
        </p>
      </div>
      <div class="action__route">
        <div
          v-if="loading"
        >
          <v-skeleton-loader
            v-bind="attrs"
            type="heading"
          />
          <v-skeleton-loader
            v-bind="attrs"
            type="heading"
          />
          <v-skeleton-loader
            v-bind="attrs"
            type="heading"
          />
        </div>
        <div
          v-else
        >
          <div
            v-for="(item, i) in goals"
            :key="i"
            class="route__block"
          >
            <div class="route__icon">
              <iconify-icon
                class="icon-clock"
                icon="feather-clock"
                width="15"
              />
            </div>
            <div class="route__info">
              <p class="body-s-semibold">
                {{ getGoal(item.goal_type_enum) }}
              </p>
              <p class="body-xs-semibold neutral-600--text">
                {{ item.created_at ? $moment(item.created_at).local().format($config.date.DATETIME_FORMAT_MIN2) : '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabMap',
    props: {
      clientData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data () {
      return {
        loading: false,
        attrs: {
          class: 'mb-1',
          boilerplate: true,
          elevation: 0,
        },
      }
    },
    computed: {
      accountClient () {
        return this.$store.getters['crm/clientCard/client']
      },
      goals () {
        return this.$store.getters['crm/clientCard/goals']
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      getGoal (type) {
        switch (type) {
          case 'ACCOUNT_VIEW':
            return 'Просмотр карты'
          case 'ACCOUNT_BARCODE':
            return 'Использование карты'
          default:
            return '-'
        }
      },
      async fetchData () {
        try {
          this.loading = true
          const item = {
            account_id: this.accountClient.id,
            page: 1,
            limit: 20,
          }
          await this.$store.dispatch('crm/clientCard/getGoals', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.tab-map {
  margin-top: calc(270px + 10px);
  .tab-map__info {
    .info-item {
      margin-bottom: 12px;
      .right-text {
        width: 56%;
      }
    }
  }
  .tab-map__action {
    margin-top: 22px;
    p {
      margin-bottom: 0;
    }
    .action__route {
      margin-top: 20px;
      .route__block {
        margin-bottom: 20px;
        display: flex;
        .route__icon {
          position: relative;
          margin-right: 9px;
          .icon-clock {
            color: $primary-base;
          }
        }
        &:not(:last-child) {
          .route__icon {
            &:before {
              content: '';
            position: absolute;
            width: 1px;
            height: 30px;
            background: $neutral-250;
            border-radius: 20px;
            top: calc(50% + 2px);
            left: 7px;
            }
          }
        }
        .route__info {
          p {
            &:nth-child(2) {
              margin-top: 3px;
            }
          }
        }
      }
    }
  }
}
</style>
