<template>
  <div>
    <div class="loyalty-wrap">
      <base-top-menu
        v-model="currentPage"
        :menu="pageList"
        :loading="saveAction"
        :show-action="hasChangesMain"
        action-button-text="Сохранить программу"
        @cancelbutton="cancelEdit()"
        @actionbutton="globalSave()"
      >
        <div class="main-wrap">
          <v-skeleton-loader
            :loading="loadData"
            boilerplate
            type="card-avatar, article, actions"
            class="skeleton"
          >
            <v-tabs-items
              v-model="currentPage"
            >
              <v-tab-item
                :value="0"
                eager
              >
                <bonus-operation
                  ref="BonusOperation"
                />
              </v-tab-item>
              <v-tab-item
                :value="1"
                eager
              >
                <bonus-currency />
              </v-tab-item>
            </v-tabs-items>
          </v-skeleton-loader>
        </div>
      </base-top-menu>
      <!-- <toolbar :has-changes="hasChanges" /> -->
    </div>
  </div>
</template>

<script>
  import BonusOperation from '@/views/BonusSettings/BonusOperation'
  import BonusCurrency from '@/views/BonusSettings/BonusCurrency'

  export default {
    name: 'BonusSettings',
    components: {
      BonusOperation,
      BonusCurrency,
    },
    data () {
      return {
        currentPage: 0,
        pageList: [
          { id: '#operation', name: 'Настройка программы лояльности', route: { hash: '#operation' } }, // `/program/certificate/${this.certId}/main`
          { id: '#currency', name: 'Настройки бонусных валют', route: { hash: '#currency' } },
        ],
        editedBonusUnit: null,
        bonusDialog: false,
        loadData: false,
        saveAction: false,
      }
    },
    computed: {
      programId () {
        return this.$store.getters.programId
      },
      hasChangesMain: {
        get () {
          return this.$store.getters['company/program/hasChangesMain']
        },
        set (v) {
          return this.$store.commit('company/program/SET_HAS_CHANGES_MAIN', v)
        },
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
        await this.$store.dispatch('company/bonus_units/getBonusUnitIcons') // список иконок
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
            this.hasChangesMain = false
          }
          this.$router.back()
        } catch (error) {

        }
      },
      async globalSave () {
        console.log('globalSave')
        try {
          this.saveAction = true
          await this.$refs.BonusOperation.globalSave()
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
    margin-top: 25px;
  }
</style>
