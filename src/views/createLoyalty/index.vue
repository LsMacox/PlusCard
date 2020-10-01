<template>
  <div>
    <div class="loyalty-wrap">
      <toolbar />
      <div class="main-wrap">
        <create-loyalty-main @bonus-unit-dialog="openBonusUnitDialog" />
        <!--        <switch-control />-->
      </div>
    </div>
    <bonus-unit-dialog
      v-if="bonusDialog"
      v-model="bonusDialog"
      :bonus-unit="editedBonusUnit"
    />
  </div>
</template>

<script>
  import Toolbar from '@/views/createLoyalty/components/Toolbar'
  import BonusUnitDialog from '@/views/createLoyalty/components/BonusUnitDialog'
  import createLoyaltyMain from '@/views/createLoyalty/components/mainPage'
  // import SwitchControl from './components/mainPage/switchControl/index'
  export default {
    name: 'CreateLoyalty',
    components: {
      // SwitchControl,
      Toolbar,
      createLoyaltyMain,
      BonusUnitDialog,
    },
    data () {
      return {
        editedBonusUnit: null,
        bonusDialog: false,

      }
    },
    computed: {
      programId () {
        return this.$store.getters.programId
      },
    },
    watch: {
      programId (v) {
        if (v) this.init()
      },
    },
    created () {
      this.init()
    },
    methods: {
      async init () {
        await this.$store.dispatch('company/bonus_units/loadBonusUnits', this.programId)
        await this.$store.dispatch('company/bonus_resources/GetList', this.programId)
      },
      openBonusUnitDialog (bonusUnit) {
        this.bonusDialog = true
      },
    },
  }
</script>

<style scoped>
  .main-wrap {
    max-width: 676px;
    width: 100%;
    margin: 0 auto;
  }
</style>
