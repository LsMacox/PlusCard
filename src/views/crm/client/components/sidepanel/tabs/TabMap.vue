<template>
  <div class="tab-map">
    <div class="tab-map__info">
      <ul class="info-list">
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            ID карты
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">104396</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Номер карты
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">104396</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Штрих-код
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">1640000000104396</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Программа лояльности
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">Керхер Центр на Пролетарской</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Создана
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">23 июля, 2020 в 14:20</span>
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
          v-for="(mapRoute, index) in mapRoutes"
          :key="mapRoute.name + '-' + index"
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
              {{ mapRoute.name }}
            </p>
            <p class="body-xs-semibold neutral-600--text">
              {{ mapRoute.date }}
            </p>
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
        mapRoutes: [
          { name: 'Просмотр карты', date: '23 июля, 2020 в 14:20' },
          { name: 'Использование карты', date: '23 июля, 2020 в 14:20' },
          { name: 'Просмотр карты', date: '23 июля, 2020 в 14:20' },
          { name: 'Использование карты', date: '23 июля, 2020 в 14:20' },
          { name: 'Просмотр карты', date: '23 июля, 2020 в 14:20' },
          { name: 'Использование карты', date: '23 июля, 2020 в 14:20' },
        ],
      }
    },
    mounted () {},
    methods: {

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
