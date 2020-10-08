<template>
  <div>
    <div class="loyalty-wrap">
      <base-top-menu
        :show-action="hasChangesMain"
        :loading="saveAction"
        action-button-text="Сохранить программу"
        @cancelbutton="cancelEdit()"
        @actionbutton="globalSave()"
      >
        <template v-slot:header>
          <div class="body-l-semibold neutral-900--text ">
            Настройка программы лояльности{{ $IsDebugMode()? hasChangesMain : '' }}
          </div>
        </template>
        <div class="main-wrap">
          <v-skeleton-loader
            v-if="loadData"
            boilerplate
            type="card-avatar, article, actions"
            class="skeleton"
          />

          <bonus-settings-main
            v-else
            ref="BonusSettingsMain"
            :has-changes-global-output.sync="hasChangesMain"
            @bonus-unit-dialog="openBonusUnitDialog"
          />
        </div>
      </base-top-menu>
      <!-- <toolbar :has-changes="hasChanges" /> -->
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

  import BonusUnitDialog from '@/views/BonusSettings/components/BonusUnitDialog'
  import BonusSettingsMain from '@/views/BonusSettings/components/mainPage'
  // import SwitchControl from './components/mainPage/switchControl/index'
  export default {
    name: 'BonusSettings',
    components: {
      // SwitchControl,    
      BonusSettingsMain,
      BonusUnitDialog,
    },
    data () {
      return {
        editedBonusUnit: null,
        bonusDialog: false,
        loadData: false,
        saveAction: false,
        hasChangesMain: false,

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
      async cancelEdit () {
        try {
          if (this.hasChangesMain) {
            await this.$confirm(
              'Имеются не сохраненные изменения. Закрыть без сохранения?',
              'Настройка программы лояльности',
              {
                confirmButtonText: 'Закрыть',
                cancelButtonText: 'Отмена',
                type: 'warning',
              })
          }
          this.$router.back()
        } catch (error) {

        }
      },
      async globalSave () {
        console.log('globalSave')
        try {
          this.saveAction = true
          await this.$refs.BonusSettingsMain.save()
        } catch (e) {

        } finally {
          this.saveAction = false
        }
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
