<template>
  <v-row class="widget-line">
    <v-col
      style="max-width: 275px"
      :cols="6"
      :sm="6"
      :md="6"
    >
      <client-program />
    </v-col>
    <v-col
      style="max-width: 518px"
      :cols="6"
      :sm="6"
      :md="6"
    >
      <purchase />
    </v-col>
    <v-col
      style="max-width: 250px"
      :cols="6"
      :sm="6"
      :md="6"
    >
      <share-purchase />
    </v-col>
    <v-col
      :cols="6"
      :sm="6"
      :md="6"
    >
      <movement-bonuses />
    </v-col>
  </v-row>
</template>

<script>
  import Purchase from '@/views/widgets/Purchase'
  import SharePurchase from '@/views/widgets/SharePurchase'
  import ClientProgram from '@/views/widgets/ClientProgram'
  import MovementBonuses from '@/views/widgets/MovementBonuses'

  export default {
    components: {
      ClientProgram,
      Purchase,
      SharePurchase,
      MovementBonuses,
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
