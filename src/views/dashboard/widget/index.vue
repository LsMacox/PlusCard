<template>
  <v-row class="widget-line">
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <client-program />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="6"
    >
      <purchase />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="3"
    >
      <share-purchase />
    </v-col>
    <v-col
      :cols="6"
      :sm="9"
      :md="9"
    >
      <movement-bonuses />
    </v-col>
    <v-col
      :cols="6"
      :sm="3"
      :md="3"
    >
      <bonus-ratio />
    </v-col>
  </v-row>
</template>

<script>
  import Purchase from '@/views/widgets/Purchase'
  import SharePurchase from '@/views/widgets/SharePurchase'
  import ClientProgram from '@/views/widgets/ClientProgram'
  import MovementBonuses from '@/views/widgets/MovementBonuses'
  import BonusRatio from '@/views/widgets/BonusRatio'

  export default {
    components: {
      ClientProgram,
      Purchase,
      SharePurchase,
      MovementBonuses,
      BonusRatio,
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
