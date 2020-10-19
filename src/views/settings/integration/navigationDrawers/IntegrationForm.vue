<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="500px"
    permanent
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <div class="navigation-drawers-setting-wrap">
        <div>
          <v-btn
            color="secondary"
            :text="true"
            :ripple="false"
            class="btn-with-img"
            @click="clearNavigationRight"
          >
            <v-icon class="icon-size-setting">
              mdi-arrow-left
            </v-icon>
            Назад
          </v-btn>
        </div>
        <div class="title-mg-title">
          <h2 class="title-h2 font-weight-bold">
            {{ id ? 'Редактирование интеграции' : 'Новая интеграция' }}
          </h2>
        </div>
        <div class="mbb-20">
          <h3 class="title-h3 font-weight-600 mgb-6">
            Название
          </h3>
          <p class="desc-15 color-text-grey">
            Введите название интеграции, которое отображаетее суть, чтобы в будущем вы не запутались.
          </p>
        </div>
        <div>
          <base-text-field
            v-model="nameIntegration"
            :validate-on-blur="false"
            :validation-placement="'bottom'"
            :rules="nameRules"
            placeholder="Введите название интеграции"
            outlined
            dense
          />
        </div>
        <div class="mbb-20">
          <h3 class="title-h3 font-weight-600">
            Права
          </h3>
          <p class="desc-15 color-text-grey">
            Выберите с какими методами будет взаимодействовать новая интеграция.
          </p>
        </div>
        <v-skeleton-loader
          :loading="GetScopesAction"
          type="image"
        >
          <div>
            <div class="tag-wrap-select">
              <div
                v-for="item in scopes"
                :key="item.id"
                class="tag-simple"
                :class="selectedScopes.includes(item.id) ? 'active-tag' : ''"
                @click="setSelectedScopes(item.id)"
              >
                {{ item.description }}
              </div>
            </div>
          </div>
        </v-skeleton-loader>
        <div v-if="secret">
          <h3 class="title-h3 font-weight-600">
            Ключ
          </h3>
          <p class="desc-15 color-text-grey">
            Используется для получения токена авторизации API-Plus.
          </p>
          <div class="wrap-copy-input">
            <input
              v-model="secret"
              type="text"
              class="copy-input input-bonuses"
              readonly
            >
            <img
              class="copy-img"
              src="@/icons/svg/copy.svg"
              @click="copyClipboard(secret)"
            >
          </div>
        </div>
        <div>
          <h3 class="title-h3 font-weight-600">
            Операции с валютой
          </h3>
          <p class="desc-15 color-text-grey">
            Выберите бонусные операции начисления и списания для каждой из существующих валют.
          </p>
        </div>
        <v-skeleton-loader
          :loading="GetBonusUnitsAction"
          type="image"
        >
          <div v-if="bonusUnits.length>0">
            <div
              v-for="item in bonusUnitsRes"
              :key="item.unit_id"
              class="wrap-select-operation mbt-20"
            >
              <h3 class="title-h3 font-weight-600 mbb-12">
                {{ item.name }}
              </h3>
              <v-select
                v-model="item.source_program_bonus_resource_id"
                :loading="GetBonusResListAction"
                :items="filterBonusResources(item.unit_id, 'TYPE_SOURCE')"
                item-text="title"
                item-value="id"
                persistent-hint
                clearable
                solo
                hide-details
                label="Операция начисления"
                class="select-grey-custom mb-select"
                no-data-text="Отсуствуют доступные бонусные операции"
              />
              <v-select
                v-model="item.target_program_bonus_resource_id"
                :loading="GetBonusResListAction"
                :items="filterBonusResources(item.unit_id, 'TYPE_TARGET')"
                item-text="title"
                item-value="id"
                persistent-hint
                clearable
                hide-details
                solo
                label="Операция списания"
                no-data-text="Отсуствуют доступные бонусные операции"
                class="select-grey-custom mb-select"
              />
            </div>
          </div>
          <v-row v-else>
            <v-col>
              <v-btn
                color="secondary"
                full-width
                to="/loyalty/setting"
              >
                <v-icon left>
                  $iconify_feather-settings
                </v-icon>
                Настроить программу лояльности
              </v-btn>
            </v-col>
          </v-row>
        </v-skeleton-loader>

        <div
          v-if="!!id"
          class="save-change btt-48"
        >
          <v-btn
            v-show="valid"
            :loading="confirmAction"
            color="primary"
            max-width="148"
            width="100%"
            @click="updateIntegrationClick"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Сохранить
          </v-btn>
          <v-btn
            text
            class="trash-btn"
            :loading="deleteAction"
            @click="deleteIntegration"
          >
            <img src="@/icons/svg/trash.svg">
            Удалить интеграцию
          </v-btn>
        </div>
        <div
          v-else
          class="btt-48"
        >
          <v-btn
            v-show="valid"
            :loading="confirmAction"
            color="primary"
            max-width="230"
            width="100%"
            @click="createIntegrationClick"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Добавить интеграцию
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import copyClipboard from '@/mixins/copyClipboard.js'
  import { EVENTS_ENUM } from '@/models/enums'

  export default {
    name: 'NavigationDrawersRightSetting',
    mixins: [copyClipboard],
    data () {
      return {
        valid: false,
        drawer: false,
        id: null,
        program_id: null,
        nameIntegration: '',
        selectedScopes: [],
        secret: null,
        bonusUnitsRes: [],
        GetScopesAction: false,
        GetBonusUnitsAction: false,
        GetBonusResListAction: false,
        confirmAction: false,
        deleteAction: false,

        nameRules: [
          v => !!v || 'Введите название интеграции',
          v => v.length <= 255 || 'Название не должно превышать 255 символов',
        ],
      }
    },
    computed: {
      ...mapGetters({
        checkOpenNavigationRight: 'configuringIntegrations/configuring_integrations/getOpenNavigationConfiguring',
        getCurrentIntegrationUpdate: 'configuringIntegrations/configuring_integrations/getCurrentIntegrationUpdate',
        // getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
        scopes: 'configuringIntegrations/configuring_integrations/scopes',
        bonusUnits: 'company/bonus_units/activeBonusUnits',
        bonusResources: 'company/bonus_resources/bonusResources',
        programId: 'programId',
      }),
      integrationData () {
        return {
          id: this.id,
          name: this.nameIntegration,
          program_id: this.program_id || this.programId,
          scopes: this.selectedScopes,
          bonus_units_res: this.bonusUnitsRes,
        }
      },

    },
    watch: {
      checkOpenNavigationRight (val) {
        console.log('update:checkOpenNavigationRight', val)
        this.drawer = val
      },
      drawer (val) {
        console.log('update:drawer', val)
        if (!val) {
          this.clearNavigationRight()
        }
      },

    },
    created () {
      this.init()
    },
    methods: {
      ...mapMutations({
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
        setUpdateIntegration: 'configuringIntegrations/configuring_integrations/setUpdateIntegration',
        updateCurrentIntegration: 'configuringIntegrations/configuring_integrations/updateCurrentIntegration',
      }),
      ...mapActions({
        CreateIntegration: 'configuringIntegrations/configuring_integrations/CreateIntegration',
        UpdateIntegration: 'configuringIntegrations/configuring_integrations/UpdateIntegration',
        RemoveIntegration: 'configuringIntegrations/configuring_integrations/RemoveIntegration',
        GetScopes: 'configuringIntegrations/configuring_integrations/GetScopes',
        GetBonusUnits: 'company/bonus_units/loadBonusUnits',
        GetBonusResList: 'company/bonus_resources/GetList',
      }),

      LoadData () {
        if (this.getCurrentIntegrationUpdate) {
          console.log('getCurrentIntegrationUpdate', this.getCurrentIntegrationUpdate)
          this.id = this.getCurrentIntegrationUpdate.id
          this.program_id = this.getCurrentIntegrationUpdate.program_id
          this.nameIntegration = this.getCurrentIntegrationUpdate.name
          this.secret = this.getCurrentIntegrationUpdate.secret
          this.selectedScopes = JSON.parse(this.getCurrentIntegrationUpdate.scopes) || []
          this.bonusUnitsRes = this.getCurrentIntegrationUpdate.bonus_units_res
        }
      },

      async LoadScopes () {
        this.GetScopesAction = true
        this.GetScopes({
          cacheTTL: null,
        }).finally(() => {
          this.GetScopesAction = false
        })
      },
      async LoadGetBonusUnits () {
        this.GetBonusUnitsAction = true
        this.GetBonusUnits(this.programId).then(x => {
          if (this.id == null) {
            this.bonusUnitsRes = this.bonusUnits.map(x => {
              return {
                unit_id: x.id,
                name: x.name,
                source_program_bonus_resource_id: null,
                target_program_bonus_resource_id: null,
              }
            })
          }
        }).finally(() => {
          this.GetBonusUnitsAction = false
        })
      },
      async LoadGetBonusResList () {
        this.GetBonusResListAction = true
        this.GetBonusResList(this.programId).finally(() => {
          this.GetBonusResListAction = false
        })
      },
      async init () {
        this.LoadData()
        this.LoadScopes()
        this.LoadGetBonusUnits()
        this.LoadGetBonusResList()
      },
      filterBonusResources (unitId, type) {
        return this.bonusResources.filter(
          item =>
            item.resource_type_enum === type &&
            item.bonus_score &&
            item.bonus_score.units_id === unitId &&
            (!item.rules ||
              (item.rules && (item.rules.event === null || item.rules.event === EVENTS_ENUM.AccountBuyEvent))),
        )
      },
      clearNavigationRight () {
        this.openNavigationRight(false)
      },
      async deleteIntegration () {
        if (!this.id) return
        try {
          this.deleteAction = true
          await this.RemoveIntegration({
            programId: this.programId,
            clientId: this.id,
          })
          this.clearNavigationRight()
        } catch (error) {
          console.error(error)
        } finally {
          this.deleteAction = false
        }
      },
      setSelectedScopes (id) {
        const index = this.selectedScopes.findIndex(x => x === id)
        if (index >= 0) {
          this.selectedScopes.splice(index, 1)
        } else {
          this.selectedScopes.push(id)
        }
      },
      async createIntegrationClick () {
        try {
          this.confirmAction = true
          await this.CreateIntegration(this.integrationData)
          this.clearNavigationRight()
        } catch (error) {
          console.error(error)
        } finally {
          this.confirmAction = false
        }
      },
      async updateIntegrationClick () {
        if (!this.id || !this.valid) return
        try {
          this.confirmAction = true
          await this.UpdateIntegration(this.integrationData)
          this.clearNavigationRight()
        } catch (error) {
          console.error(error)
        } finally {
          this.confirmAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>

  .navigation-drawers-setting-wrap {
    padding: 34px;
  }
  .icon-size-setting {
    font-size: 16px;
    margin-right: 6px;
  }
  .title-mg-title {
    margin: 50px 0 34px;
  }
  .mgb-6 {
    margin-bottom: 6px;
  }
  .mbb-20 {
    margin-top: 34px;
    margin-bottom: 20px;
  }
  .mbb-12 {
    margin-bottom: 12px;
  }
  .btt-48 {
    margin-top: 48px;
  }
  .tag-simple {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F7F7FC;
    border-radius: 6px;
    min-width: 172px;
    margin-bottom: 8px;
    color: #9191A1;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  .tag-wrap-select {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 34px;
  }
  .mb-select {
    margin-bottom: 12px;
  }
  .mbt-20 {
    margin-top: 20px;
  }
  .save-change {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .trash-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #EA4C2A;
    max-width: 162px;
    width: 100%;
    outline: none;
  }
  .copy-input {
    height: 45px;
    width: 415px;
    color: #B5B5C4;
    background: #F2F2F7;
  }
  .active-tag {
    background: #EBF1FF;
    color: #4776E6;
  }
  .wrap-copy-input {
    margin: 20px 0 34px;
    position: relative;
  }
  .copy-img {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
</style>
