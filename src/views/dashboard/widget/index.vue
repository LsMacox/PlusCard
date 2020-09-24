<template>
  <div class="widget-line">
    <v-row>
      <v-col
        style="max-width: 275px"
        :cols="3"
        :sm="3"
        :md="3"
      >
        <client-program />
      </v-col>
      <v-col
        style="min-width: 518px; max-width: 518px"
        :cols="3"
        :sm="3"
        :md="3"
      >
        <purchase />
      </v-col>
      <v-col
        style="max-width: 254px"
        :cols="3"
        :sm="3"
        :md="3"
      >
        <share-purchase />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        style="min-width: 794px;"
        :cols="2"
        :sm="2"
        :md="2"
      >
        <movement-bonuses />
      </v-col>
      <v-col
        style="max-width: 254px"
        :cols="2"
        :sm="2"
        :md="2"
      >
        <bonus-ratio />
      </v-col>
    </v-row>
    <v-row>
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
        <custom-actions />
      </v-col>
    </v-row>
  </div>
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
.widget-line {
  padding: 22px 0 0 0;
}
</style>
