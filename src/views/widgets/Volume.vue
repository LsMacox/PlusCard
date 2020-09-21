<template>
  <widget-template style-name="w-volume">
    <template v-slot:header-left>
      <p
        class="body-m-semibold"
      >
        Общий оборот
      </p>
    </template>

    <template v-slot:header-right>
      <p class="body-m-semibold">
        {{ formatNumberString(volume) }}
      </p>
    </template>

    <template v-slot:body>
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
            <span class="w-volume__number body-s-semibold wc-base">{{ formatNumberString(balance) }}</span>
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
            <span class="w-volume__number body-s-semibold wc-success">{{ formatNumberString(credit) }}</span>
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
            <span class="w-volume__number body-s-semibold wc-error">{{ formatNumberString(debit) }}</span>
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
    </template>
  </widget-template>
</template>

<script>
  import FormatNumber from '@/mixins/formatNumber'
  import WidgetTemplate from '@/views/widgets/components/WidgetTemplate'

  export default {
    components: { WidgetTemplate },
    mixins: [FormatNumber],
    props: {
      widgetData: {
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
        const unit = this.widgetData.find(item => item.is_main)
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
