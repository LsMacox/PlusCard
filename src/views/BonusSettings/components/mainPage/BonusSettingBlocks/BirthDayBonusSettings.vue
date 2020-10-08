<template>
  <div
    class="tab-basic"
  >
    <div
      class="create-mess-container"
    >
      <v-form
        ref="form"
        v-model="formValid"
        lazy-validation
      >
        <div class="single-mess-wrap">
          <v-col class="ma-0">
            <div
              v-if="bonusUnits.length === 0"
              class="select-input-wrap"
            >
              <v-btn
                color="secondary"
                small
                max-width="283px"
                width="100%"
                max-height="45px"
                height="100%"
                type="button"
                @click="createBonusesCurrency"
              >
                <img
                  src="@/icons/svg/plus-circle.svg"
                  class="plus-circle"
                >
                Создайте бонусную валюту
              </v-btn>
            </div>
            <div
              v-for="(bonusRes, bonusResIndex) in bonusResMapedSource"
              v-else
              :key="bonusResIndex"
              class="select-input-accrual-bonuses"
            >
              <div class="wrap-input">
                <base-text-field
                  v-model.number="bonusRes.rules.value"
                  :rules="valueRules"
                  :validation-placement="'top'"
                  placeholder="Сумма"
                  class="percent-field"
                  validate-on-blur
                />

                <bonus-unit-select
                  v-model="bonusRes.bonus_score.units_id"
                  :disabled="!bonusRes.isNew"
                  :bonus-unit-list="bonusUnits"
                  :error-message=" !!bonusRes.bonus_score.units_id || 'Выберите валюту' "
                  :show-error="showErrors"
                  class="bonus-unit-select"
                  v-on="$listeners"
                />

                <div class="wrap-circle">
                  <v-btn
                    v-if="bonusResMapedSource.length > 1"
                    icon
                    class="simple-circle mines-right"
                    :loading="bonusRes.deleteAction"
                    @click="deleteBonusRes(bonusRes)"
                  >
                    <img src="@/icons/svg/mines.svg">
                  </v-btn>
                  <div
                    v-if="(bonusResIndex + 1) === bonusResMapedSource.length"
                    class="simple-circle mines-right"
                    @click="addNewBonusRes('TYPE_SOURCE')"
                  >
                    <img src="@/icons/svg/plus.svg">
                  </div>
                </div>
              </div>
              <v-row>
                <v-col>
                  <base-text-field
                    v-model="bonusRes.title"
                    :rules="titleRules"
                    :validation-placement="'top'"
                    placeholder="Введите название операции, чтобы не запутаться"
                    class="title-field input-lg-l"
                    validate-on-blur
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                style="min-height:calc(45px + 20px)"
              >
                <v-col cols="auto">
                  <base-ext-switch
                    v-model="bonusRes.expire_days_unlimit"
                    :label="bonusRes.expire_days_unlimit ? 'Срок действия бонусов: без ограничений' : ' Срок действия бонусов:'"

                    @change="(v)=>{ if (v) bonusRes.rules.expire_days = null }"
                  />
                </v-col>
                <v-col v-if="!bonusRes.expire_days_unlimit">
                  <div class="container-input-count">
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.expire_days = bonusRes.rules.expire_days > 1 ? +bonusRes.rules.expire_days - 1 : 1"
                    >
                      <img src="@/icons/svg/mines.svg">
                    </div>
                    <base-text-field
                      v-model.number="bonusRes.rules.expire_days"
                      :rules="daysRules"
                      :validation-placement="'top'"
                      placeholder="X дней"
                      class="days-field"
                      validate-on-blur
                    />
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.expire_days = +bonusRes.rules.expire_days + 1"
                    >
                      <img src="@/icons/svg/plus.svg">
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row
                align="center"
                style="min-height:calc(45px + 20px)"
              >
                <v-col cols="auto">
                  <base-ext-switch
                    v-model="bonusRes.delay_days_unlimit"
                    :label="bonusRes.delay_days_unlimit ? 'Начислять бонусы: в день рождения' : 'Начислять бонусы за:'"

                    @change="(v)=>{ if (v) bonusRes.rules.delay_days = null }"
                  />
                </v-col>
                <v-col v-if="!bonusRes.delay_days_unlimit">
                  <div class="container-input-count">
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.delay_days = bonusRes.rules.delay_days > 1 ? +bonusRes.rules.delay_days - 1 : 1"
                    >
                      <img src="@/icons/svg/mines.svg">
                    </div>
                    <base-text-field
                      v-model.number="bonusRes.rules.delay_days"
                      :rules="daysRules"
                      :validation-placement="'top'"
                      placeholder="X дней"
                      class="days-field"
                      validate-on-blur
                    />
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.delay_days = +bonusRes.rules.delay_days + 1"
                    >
                      <img src="@/icons/svg/plus.svg">
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </div>

        <div
          v-if="hasChanges && bonusUnits.length > 0"
          class="save-currency"
        >
          <v-btn
            color="primary"
            :loading="saveChangesActive"
            @click="saveChanges"
          >
            <v-icon left>
              $iconify_ion-checkmark-circle-outline
            </v-icon>
            Сохранить настройки механики
          </v-btn>
        </div>
        <v-row v-if="false">
          {{ dbBonusRes.map(getEditedObject) }}
          <v-divider />
          {{ bonusResInternal.map(getEditedObject) }}
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Vue from 'vue'

  import { asMixin, isFilled, isNumber, isNumeric, isInteger, isPosNumber, maxLen } from '@/utils/validate'
  import { EVENTS_ENUM, RESOURCE_TYPE_ENUM } from '@/models/enums'

  export default {
    name: 'Basic',
    components: {
      BonusUnitSelect: () => import('../../BonusUnitSelect'),
    },
    mixins: [asMixin(isFilled)],
    props: {
      globalActive: {
        type: Boolean,
        required: true,
      },
    },    
    data () {
      return {

        showErrors: false,
        formValid: false,
        bonusResInternal: [],
        saveChangesActive: false,
        valueRules: [
          (v) => isFilled(v) || 'Введите сумму',
          (v) => isNumeric(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
          (v) => v <= this.$config.MAX_TRAN_VALUE || `Не более ${this.$config.MAX_TRAN_VALUE}`,
        ],
        daysRules: [
          (v) => isFilled(v) || 'Введите дни',
          (v) => isInteger(v) || 'Должно быть целым числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
          (v) => v <= this.$config.MAX_DAYS || `Не более ${this.$config.MAX_DAYS}`,
        ],
        titleRules: [
          (v) => isFilled(v) || 'Введите название',
          (v) => maxLen(v, 255) || 'Не более 255 символов',
        ],
      }
    },

    computed: {
      ...mapGetters({
        bonusUnits: 'company/bonus_units/bonusUnits',
        dbBonusRes: 'company/bonus_resources/birthDayBonusRes',
      }),

      programId () {
        return this.$store.getters.programId
      },

      bonusResMaped () {
        return this.bonusResInternal.map(item => {
          Vue.set(item, 'deleteAction', false)

          Vue.set(item, 'expire_days_unlimit', item.rules && item.rules.expire_days == null)
          Vue.set(item, 'delay_days_unlimit', item.rules && item.rules.delay_days == null)

          Vue.set(item, 'rules', Object.assign({
            expire_days: null,
            delay_days: null,
          }, item.rules))

          return item
        })
      },
      bonusResMapedSource () {
        return this.bonusResMaped.filter(this.isSourceFilter)
      },

      bonusResMapedTarget () {
        return this.bonusResMaped.filter(this.isTargetFilter)
      },

      hasChanges () {
        return JSON.stringify(this.dbBonusRes.map(this.getEditedObject)) !==
          JSON.stringify(this.bonusResInternal.map(this.getEditedObject))
      },

    },
    watch: {

    },
    methods: {

      validate () {
        this.showErrors = true
        if (!this.$refs.form.validate()) return false

        const allBonusUnitFilled = this.bonusResMaped.every(item => item.bonus_score && !!item.bonus_score.units_id)
        if (!allBonusUnitFilled) return false

        return true
      },

      async deleteBonusRes (bonusRes) {
        try {
          bonusRes.deleteAction = true
          const index = this.bonusResInternal.findIndex(x => x.id === bonusRes.id)
          if (index >= 0) {
            const item = this.bonusResInternal[index]
            if (!item.isNew) {
              await this.$store.dispatch('company/bonus_resources/DeleteBonusRes', bonusRes.id)
            }
            this.bonusResInternal.splice(index, 1)
          }
        } catch (error) {
          console.error(error)
        } finally {
          bonusRes.deleteAction = false
        }
      },

      addNewBonusRes (type = 'TYPE_SOURCE') {
        console.log('addNewBonusRes')
        this.bonusResInternal.push({
          id: this.$uuid(),
          isNew: true,
          program_id: this.programId,
          title: '',
          description: '',
          resource_type_enum: type,
          bonus_score: {
            units_id: null,
          },
          can_app_usage: false,
          expire_days_unlimit: true,
          delay_days_unlimit: true,
          rules: {
            event: EVENTS_ENUM.AccountClientBirthDayEvent,
            value: null,
            expire_days: null,
            delay_days: null,
          },
        })
      },

      isSourceFilter (item) {
        return item.resource_type_enum === RESOURCE_TYPE_ENUM.SOURCE
      },
      isTargetFilter (item) {
        return item.resource_type_enum === RESOURCE_TYPE_ENUM.TARGET
      },

      createBonusesCurrency () {
        this.$emit('bonus-unit-dialog', null)
      },

      checkValidNum (val) {
        const numEl = val.match(/\d+/)
        return Math.round(numEl)
      },

      getEditedObject (bonusRes) {
        return {
          id: bonusRes.id,
          title: bonusRes.title,
          description: bonusRes.description,
          bonus_score: {
            id: bonusRes.bonus_score.id,
            units_id: bonusRes.bonus_score.units_id,
            active: bonusRes.bonus_score.active,
          },
          can_app_usage: bonusRes.can_app_usage,
          rules: bonusRes.rules ? {
            event: bonusRes.rules.event,
            value: bonusRes.rules.value,
            expire_days: bonusRes.rules.expire_days || null,
            delay_days: bonusRes.rules.delay_days || null,
          } : null,
          expire_days_unlimit: bonusRes.expire_days_unlimit || bonusRes.rules.expire_days == null,
          delay_days_unlimit: bonusRes.delay_days_unlimit || bonusRes.rules.delay_days == null,

        }
      },
      async saveChanges () {
        if (!this.validate()) return

        try {
          this.saveChangesActive = true

          for (let index = 0; index < this.bonusResInternal.length; index++) {
            const element = this.bonusResInternal[index]

            const originalIndex = this.dbBonusRes.findIndex(x => x.id === element.id)
            if (originalIndex >= 0) {
              const originalItem = this.dbBonusRes[originalIndex]
              console.log('element', this.getEditedObject(element))
              console.log('originalItem', this.getEditedObject(originalItem))
              if (JSON.stringify(this.getEditedObject(element)) === JSON.stringify(this.getEditedObject(originalItem))) continue
            }

            const bonusRes = {
              program_id: this.programId,
              resource_type_enum: element.resource_type_enum,
              title: element.title,
              description: element.description,
              units_id: element.bonus_score.units_id,
              can_app_usage: element.can_app_usage,
              active: this.globalActive,
              // max_value: element.max_value,
              // expire_at: element.expire_date,
              rules: element.rules,
            }

            if (element.isNew) {
              // Create

              await this.$store.dispatch('company/bonus_resources/CreateBonusRes', {
                bonusRes,
                silent: false,
              })
            } else {
              // Update
              bonusRes.id = element.id

              await this.$store.dispatch('company/bonus_resources/UpdateBonusRes', {
                bonusRes,
                silent: false,
              })
            }
          }

          this.$notify({
            title: 'Настройка бонусной системы',
            text: 'Бонусные операции начисления/списния обновлены',
            type: 'success',
          })

          this.init()
        } catch (error) {
          console.log(error)
        } finally {
          this.saveChangesActive = false
        }
      },
      init () {
        this.bonusResInternal = Object.copy(this.dbBonusRes)

        if (this.bonusResMaped.length === 0) {
          this.addNewBonusRes(RESOURCE_TYPE_ENUM.SOURCE)
        }
      },
    },

    // eslint-disable-next-line vue/order-in-components
    created () {
      this.init()
      // this.isFilled = isFilled
    },

  }
</script>

<style scoped lang="scss">

@import '_BlockStyle.scss';

</style>
