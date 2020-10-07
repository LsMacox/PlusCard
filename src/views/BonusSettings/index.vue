<template>
  <div>
    <div class="loyalty-wrap">
      <toolbar />
      <div class="main-wrap">
        <v-skeleton-loader
          v-if="loadData"
          boilerplate
          type="card-avatar, article, actions"
          class="skeleton"
        />
        <bonus-settings-main
          v-else
          @bonus-unit-dialog="openBonusUnitDialog"
        />
        <!--        <switch-control />-->
      </div>
    </div>
    <bonus-unit-dialog
      v-if="bonusDialog"
      v-model="bonusDialog"
      :bonus-unit="editedBonusUnit"
      :program-id="programId"
    />
  </div>
</template>

<script>
  import Toolbar from '@/views/BonusSettings/components/Toolbar'
  import BonusUnitDialog from '@/views/BonusSettings/components/BonusUnitDialog'
  import BonusSettingsMain from '@/views/BonusSettings/components/mainPage'
  // import SwitchControl from './components/mainPage/switchControl/index'
  export default {
    name: 'BonusSettings',
    components: {
      // SwitchControl,
      Toolbar,
      BonusSettingsMain,
      BonusUnitDialog,
    },
    data () {
      return {
        editedBonusUnit: null,
        bonusDialog: false,
        loadData: false,

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
        this.loadData = true
        await this.$store.dispatch('company/bonus_units/loadBonusUnits', this.programId)
        await this.$store.dispatch('company/bonus_resources/GetList', this.programId)
        this.loadData = false
      },
      openBonusUnitDialog (bonusUnit) {
        this.bonusDialog = true
        this.editedBonusUnit = bonusUnit
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
  .skeleton {
    margin-top: 100px;
  }
</style>
