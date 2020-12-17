<template>
  <div>
    <bonus-settings-main
      ref="BonusSettingsMain"
      :has-changes-global-output.sync="hasChangesMain"
      @bonus-unit-dialog="openBonusUnitDialog"
    />
    <!-- <toolbar :has-changes="hasChanges" /> -->
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

  export default {
    name: 'BonusSettings',
    components: {
      BonusSettingsMain,
      BonusUnitDialog,
    },
    data () {
      return {
        editedBonusUnit: null,
        bonusDialog: false,
        saveAction: false,
        hasChangesMain: false,
      }
    },
    computed: {
      programId () {
        return this.$store.getters.programId
      },
    },
    methods: {
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
