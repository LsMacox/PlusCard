<template>
  <div class="widget-box">
    <div class="widget-box-header">
      <div class="widget-box-header-left">
        Общий оборот
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        386 045
      </div>
    </div>
    <div class="widget-box-body">
      <ul
        class="volume__list"
      >
        <li
          class="volume__item"
        >
          <div class="volume__item-top">
            <p class="volume-name">
              Баланс
            </p>
            <span class="volume-data balance">155 107</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="58"
              style="height: 4px"
              rounded="rounded"
              class="volume-progress"
              background-color="#EBF1FF"
              color="primary"
            />
          </div>
        </li>
        <li
          class="volume__item"
        >
          <div class="volume__item-top">
            <p class="volume-name">
              Начислено
            </p>
            <span class="volume-data accrued">270 576</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="80"
              style="height: 4px"
              rounded="rounded"
              class="volume-progress"
              background-color="#EBF1FF"
              color="success"
            />
          </div>
        </li>
        <li
          class="volume__item"
        >
          <div class="volume__item-top">
            <p class="volume-name">
              Списано
            </p>
            <span class="volume-data debited">115 469</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="48"
              style="height: 4px"
              rounded="rounded"
              class="volume-progress"
              background-color="#EBF1FF"
              color="error"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {}
    },
    computed: {

    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.balance {
  color: $primary-base;
}

.accrued {
  color: $success-500;
}

.debited {
  color: $error-500;
}

.widget-box {
  padding: 20px;
  border: 1px solid $neutral-250;
  box-sizing: border-box;
  border-radius: 12px;

  .widget-box-header {
      display: flex;
      align-items: center;

      .widget-box-header-left {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $neutral-900;
      }
      .widget-box-header-right {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $neutral-500;
      }
    }

    .widget-box-body {
        width: 100%;
        display: flex;
        justify-content: center;
        .volume__list {
          list-style: none;
          width: 100%;
          padding: 0;
          .volume__item {
            margin-top: 11px;
            .volume__item-top {
              margin-bottom: -2px;
              .volume-name {
                float: left;
                font-family: Gilroy;
                font-style: normal;
                font-weight: 500;
                font-size: 13px;
                margin-bottom: 0;
                color: $neutral-600;
              }
              .volume-data {
                float: right;
                font-family: Gilroy;
                font-style: normal;
                font-weight: 600;
                font-size: 13px;
              }
            }
          }
        }
      }
  }
</style>
