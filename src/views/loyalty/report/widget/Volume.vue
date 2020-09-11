<template>
  <div class="widget-box">
    <div class="widget-box-header">
      <div class="widget-box-header-left">
        Общий оборот
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        {{ volume }}
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
            <span class="volume-data balance">{{ balance }}</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="getProgress('balance')"
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
            <span class="volume-data accrued">{{ credit }}</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="getProgress('credit')"
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
            <span class="volume-data debited">{{ debit }}</span>
          </div>
          <div class="volume__item-bottom">
            <v-progress-linear
              :value="getProgress('debit')"
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
      widgetdata: {
        type: Array,
        default () {
          return [{
            name: null,
            is_main: false,
            debit: {
              count: null,
              sum: null,
            },
            credit: {
              count: null,
              sum: null,
            },
          }]
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      mainUnit () {
        const unit = this.widgetdata.find(item => item.is_main)
        if (unit) return unit
        return {}
      },
      credit () {
        if (this.mainUnit && this.mainUnit.credit) return Number(this.mainUnit.credit.sum)
        return 0
      },
      debit () {
        if (this.mainUnit && this.mainUnit.debit) return Number(this.mainUnit.debit.sum)
        return 0
      },
      volume () {
        return this.credit + this.debit
      },
      balance () {
        return this.credit + (-1 * this.debit)
      },
    },
    methods: {
      getProgress (indicator) {
        const max = this.volume
        if (indicator === 'balance') {
          return Math.round(this.balance / max * 100)
        }
        if (indicator === 'credit') {
          return Math.round(this.credit / max * 100)
        }
        if (indicator === 'debit') {
          return Math.round(this.debit / max * 100)
        }
      },
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
  height: 100%;
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
