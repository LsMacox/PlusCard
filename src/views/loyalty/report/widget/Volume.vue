<template>
  <div class="widget-box w-volume">
    <div class="widget-box-header w-volume__header">
      <div class="widget-box-header-left w-volume__header-left body-m-semibold">
        Общий оборот
      </div>
      <div class="widget-box-header-right w-volume__header-right body-s-semibold">
        {{ volume }}
      </div>
    </div>
    <div class="widget-box-body w-volume__body">
      <ul
        class="w-volume__list"
      >
        <li
          class="w-volume__item"
        >
          <div class="w-volume__item-top">
            <p class="w-volume__name body-s-medium">
              Баланс
            </p>
            <span class="w-volume__number body-s-semibold wc-base">{{ balance }}</span>
          </div>
          <div class="w-volume__item-bottom">
            <v-progress-linear
              :value="getProgress('balance')"
              style="height: 4px"
              rounded="rounded"
              class="w-volume__progress"
              background-color="#EBF1FF"
              color="primary"
            />
          </div>
        </li>
        <li
          class="w-volume__item"
        >
          <div class="w-volume__item-top">
            <p class="w-volume__name body-s-medium">
              Начислено
            </p>
            <span class="w-volume__number body-s-semibold wc-success">{{ credit }}</span>
          </div>
          <div class="w-volume__item-bottom">
            <v-progress-linear
              :value="getProgress('credit')"
              style="height: 4px"
              rounded="rounded"
              class="w-volume__progress"
              background-color="#EBF1FF"
              color="success"
            />
          </div>
        </li>
        <li
          class="w-volume__item"
        >
          <div class="w-volume__item-top">
            <p class="w-volume__name body-s-medium">
              Списано
            </p>
            <span class="w-volume__number body-s-semibold wc-error">{{ debit }}</span>
          </div>
          <div class="w-volume__item-bottom">
            <v-progress-linear
              :value="getProgress('debit')"
              style="height: 4px"
              rounded="rounded"
              class="w-volume__progress"
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

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_volume.scss";

</style>
