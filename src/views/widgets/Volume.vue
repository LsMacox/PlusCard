<template>
  <list-progress-frame
    title="Общий оборот"
    :data="listProgressData"
    class="w-volume"
  >
    <template v-slot:header-right>
      <p class="body-m-semibold wc-neutral">
        {{ volume }}
      </p>
    </template>
  </list-progress-frame>
</template>

<script>
  import ListProgressFrame from '@/views/widgets/frames/ListProgressFrame'

  export default {
    components: { ListProgressFrame },
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
      listProgressData () {
        const data = []

        const balance = isNaN(this.getProgress('balance')) ? 0 : this.getProgress('balance')
        const credit = isNaN(this.getProgress('credit')) ? 0 : this.getProgress('credit')
        const debit = isNaN(this.getProgress('debit')) ? 0 : this.getProgress('debit')

        data.push(
          { left: 'Баланс', right: this.balance, progress: balance },
          { left: 'Начислено', right: { color: 'success', value: this.credit }, progress: { color: 'success', value: credit } },
          { left: 'Списано', right: { color: 'error', value: this.debit }, progress: { color: 'error', value: debit } },
        )

        return data
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
