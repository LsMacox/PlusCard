<template>
  <div>
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
        v-if="transactionsStore && transactionsStore.length"
      >
        <div
          v-for="group in transactions"
          :key="group.key"
        >
          <div class="pls--transaction-timeline neutral-500--text">
            {{ group.label }}
          </div>
          <div
            v-for="(item, i) in group.items"
            :key="i"
            class="pls--transaction-card"
          >
            <v-avatar
              size="32"
              class="pls--transaction-card-avatar"
            >
              <img
                :src="item.subject.avatar"
                alt="Иконка программы"
              >
            </v-avatar>
            <div>
              <div class="body-m-semibold">
                {{ item.subject.name }}
                <span class="body-m-regular neutral-500--text">в {{ getTime(item.created_at) }}</span>
              </div>
              <div
                class="body-m-semibold"
                :class="{ 'success-500--text': item.trans_type === 'CREDIT', 'error-500--text': item.trans_type === 'DEBIT' }"
              >
                {{ getTransactionValue(item.trans_type, item.value) }} {{ getUnitName(item.bonus_unit_id, item.value) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
      >
        Операций пока нет
      </div>
    </div>
  </div>
</template>

<script>
  import ConvertorMixin from '@/mixins/convertor'
  import DateTimeFormatMixin from '@/mixins/dateTimeFormat'

  export default {
    name: 'TabOperation',
    mixins: [ConvertorMixin, DateTimeFormatMixin],
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
      transactionsStore () {
        return this.$store.getters['crm/clientCard/transactions']
      },
      transactions () {
        const transactions = []
        this.$store.getters['crm/clientCard/transactions'].forEach(item => {
          const key = this.$moment.utc(item.created_at).local().format('YYYY-MM-DD')
          const label = this.$moment.utc(item.created_at).local().format('dd, DD MMM YYYY')
          const unixTime = this.$moment(key).unix()
          const group = transactions.find(item => item.key === key)
          if (!group) {
            transactions.push({
              key,
              label,
              unixTime,
              items: [],
            })
          }
          for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].key === key) {
              transactions[i].items.push(item)
            }
          }
        })
        return transactions.sort((a, b) => b.unix - a.unix)
      },
      bonusUnits () {
        return this.$store.getters['company/bonus_units/bonusUnits']
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      getUnitName (id, value) {
        const unit = this.bonusUnits.find(item => item.id === id)
        if (unit) {
          value = value.replace(/[+,-]/gi, '')
          value = Number(value)
          if (!isNaN(value) &&
            unit.unit_name_ending &&
            unit.unit_name_ending.first &&
            unit.unit_name_ending.second &&
            unit.unit_name_ending.third
          ) {
            const titles = [
              unit.unit_name_ending.first,
              unit.unit_name_ending.second,
              unit.unit_name_ending.third,
            ]
            return this.declOfNum(value, titles)
          }
          return unit.name
        }
        return '-'
      },
      getTransactionValue (type, value) {
        switch (type) {
          case 'CREDIT':
            if (value[0] === '+') return value
            return '+' + value
          case 'DEBIT':
            if (value[0] === '-') return value
            return '-' + value
        }
      },
      async fetchData () {
        try {
          this.loading = true
          const item = {
            id: this.accountClient.id,
          }
          await this.$store.dispatch('crm/clientCard/transactionsList', item)
          await this.$store.dispatch('company/bonus_units/loadBonusUnits', this.accountClient.program_id)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.pls--transaction-timeline {
  font-size: 14px;
  border-bottom: 1px solid $neutral-500;
  margin: 25px 0 10px 0;
  padding-bottom: 5px;
}

.pls--transaction-card {
  display: flex;
  margin: 15px 0;

  .pls--transaction-card-avatar {
    margin-right: 15px;
  }
}
</style>
