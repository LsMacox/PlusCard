<template>
  <v-row class="widget-line">
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <client-program :widget-data="programClients" />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="6"
    >
      <purchase :widget-data="purchases" />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <share-purchase :widget-data="purchases" />
    </v-col>
    <v-col
      :cols="6"
      :sm="9"
      :md="9"
    >
      <movement-bonuses :widget-data="bonuses" />
    </v-col>
    <v-col
      :cols="6"
      :sm="3"
      :md="3"
    >
      <bonus-ratio :widget-data="bonuses" />
    </v-col>

    <v-col
      style="min-width: 554px; max-width: 600px"
      :cols="2"
      :sm="2"
      :md="2"
    >
      <customer-segment />
    </v-col>
    <v-col
      style="min-width: 241px; max-width: 241px"
      :cols="2"
      :sm="2"
      :md="2"
    >
      <custom-actions :widget-data="customActions" />
    </v-col>
  </v-row>
</template>

<script>
  import Purchase from '@/views/widgets/Purchase'
  import SharePurchase from '@/views/widgets/SharePurchase'
  import ClientProgram from '@/views/widgets/ClientProgram'
  import MovementBonuses from '@/views/widgets/MovementBonuses'
  import BonusRatio from '@/views/widgets/BonusRatio'
  import CustomerSegment from '@/views/widgets/CustomerSegment'
  import CustomActions from '@/views/widgets/CustomActions'

  export default {
    components: {
      ClientProgram,
      Purchase,
      SharePurchase,
      MovementBonuses,
      BonusRatio,
      CustomerSegment,
      CustomActions,
    },
    props: {
    },
    data () {
      return {
        start_period: null,
        end_period: null,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      period () {
        return this.$store.getters['reference/date_selection/period']
      },
      programClients () {
        return this.$store.getters['dashboard/clients/widgetData']
      },
      purchases () {
        return this.$store.getters['dashboard/purchase/widgetData']
      },
      bonuses () {
        return this.$store.getters['dashboard/bonuses/widgetData']
      },
      customActions () {
        return this.$store.getters['dashboard/customActions/widgetData']
      },
    },
    watch: {
      period (v) {
        this.$store.dispatch('dashboard/clients/widget', {
          program_id: this.program.id,
          start_period: v.start,
          end_period: v.end,
        })

        this.$store.dispatch('dashboard/purchase/widget', {
          program_id: this.program.id,
          start_period: v.start,
          end_period: v.end,
        })

        this.$store.dispatch('dashboard/bonuses/widget', {
          program_id: this.program.id,
          start_period: v.start,
          end_period: v.end,
        })

        this.$store.dispatch('dashboard/customActions/widget', {
          program_id: this.program.id,
          start_period: v.start,
          end_period: v.end,
        })
      },
      program (v) {
        this.$store.dispatch('dashboard/clients/widget', {
          program_id: v.id,
          start_period: this.period.start,
          end_period: this.period.end,
        })

        this.$store.dispatch('dashboard/purchase/widget', {
          program_id: v.id,
          start_period: this.period.start,
          end_period: this.period.end,
        })

        this.$store.dispatch('dashboard/bonuses/widget', {
          program_id: v.id,
          start_period: this.period.start,
          end_period: this.period.end,
        })

        this.$store.dispatch('dashboard/customActions/widget', {
          program_id: v.id,
          start_period: this.period.start,
          end_period: this.period.end,
        })
      },
    },
    mounted () {
      this.start_period = this.period.start
      this.end_period = this.period.end

      this.$store.dispatch('dashboard/clients/widget', {
        program_id: this.program.id,
        start_period: this.start_period,
        end_period: this.end_period,
      })

      this.$store.dispatch('dashboard/purchase/widget', {
        program_id: this.program.id,
        start_period: this.start_period,
        end_period: this.end_period,
      })

      this.$store.dispatch('dashboard/bonuses/widget', {
        program_id: this.program.id,
        start_period: this.start_period,
        end_period: this.end_period,
      })

      this.$store.dispatch('dashboard/customActions/widget', {
        program_id: this.program.id,
        start_period: this.start_period,
        end_period: this.end_period,
      })
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
.widget-line {
  padding: 22px 0 0 0;
}
</style>
