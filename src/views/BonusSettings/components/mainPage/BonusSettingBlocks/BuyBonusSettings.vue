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
        <div class="mess-wrap">
          <div class="step">
            1
          </div>
          <div class="block-title-create">
            <div>
              <h3 class="title-h4">
                Начисление
              </h3>
              <p class="desc-15 color-text-grey">
                Какой процент от каждой покупки начислять клиенту? Если вам нужны несколько
                вариантов начисления - добавьте еще одну операцию.
              </p>
            </div>

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
              v-else
              v-for="(bonusRes, bonusResIndex) in buyBonusResSource"
              :key="bonusResIndex"
              class="select-input-accrual-bonuses"
            >
              <div class="wrap-input">
                <base-text-field
                  v-model.number="bonusRes.rules.percent"
                  :rules="percentRules"
                  :validation-placement="'top'"
                  placeholder="% от покупки"
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
                    v-if="buyBonusResSource.length > 1"
                    icon
                    class="simple-circle mines-right"
                    :loading="bonusRes.deleteAction"
                    @click="deleteBonusRes(bonusRes)"
                  >
                    <img src="@/icons/svg/mines.svg">
                  </v-btn>
                  <div
                    v-if="(bonusResIndex + 1) === buyBonusResSource.length"
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
                    <!-- <input
                      v-model="bonusRes.rules.expire_days"
                      class="input-bonuses input-sm-xl input-sm"
                      type="text"
                      @input="bonusRes.rules.expire_days = checkValidNum($event.target.value)"
                    > -->
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
              >
                <v-col>
                  <base-ext-switch
                    v-model="bonusRes.can_app_usage"
                    :label="'Разрешить использование менеджером'"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
        <div
          class="magazine-wrap"
          :class="[(dbBuyBonusRes.length === 0 && false) ? 'disabled-block' : '']"
        >
          <div class="step">
            2
          </div>
          <div
            class="block-title-create"
          >
            <div>
              <h3 class="title-h3">
                Списание
              </h3>
              <p class="desc-15 color-text-grey">
                Какую часть покупки можно оплатить бонусной валютой? Если вам нужны несколько вариантов
                оплаты покупки - добавьте операцию.
              </p>
            </div>
            <div
              v-if="(bonusUnits.length === 0)"
              class="select-input-wrap"
            >
              <base-text-field
                disabled
                placeholder="% от покупки"
                class="percent-field"
              />
              <bonus-unit-select
                disabled
                class="bonus-unit-select"
              />
            </div>
            <template v-else>
              <div
                v-for="(bonusRes, bonusResIndex) in buyBonusResTarget"
                :key="bonusResIndex"
                class="select-input-accrual-bonuses"
              >
                <div class="wrap-input">
                  <base-text-field
                    v-model.number="bonusRes.rules.percent"
                    :rules="percentRules"
                    :validation-placement="'top'"
                    placeholder="% от покупки"
                    class="percent-field"
                    validate-on-blur
                  />

                  <bonus-unit-select
                    v-model="bonusRes.bonus_score.units_id"
                    :disabled="!bonusRes.isNew"
                    :bonus-unit-list="bonusUnits"
                    :error-message=" isFilled(bonusRes.bonus_score.units_id) || 'Выберите валюту' "
                    :show-error="showErrors"
                    class="bonus-unit-select"
                    v-on="$listeners"
                  />

                  <div class="wrap-circle">
                    <v-btn
                      v-if="buyBonusResTarget.length > 1"
                      icon
                      class="simple-circle mines-right"
                      :loading="bonusRes.deleteAction"
                      @click="deleteBonusRes(bonusRes)"
                    >
                      <img src="@/icons/svg/mines.svg">
                    </v-btn>
                    <div
                      v-if="(bonusResIndex + 1) === buyBonusResTarget.length"
                      class="simple-circle mines-right"
                      @click="addNewBonusRes('TYPE_TARGET')"
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
                >
                  <v-col>
                    <base-ext-switch
                      v-model="bonusRes.can_app_usage"
                      :label="'Разрешить использование менеджером'"
                    />
                  </v-col>
                </v-row>
              </div>
            </template>
          </div>
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
        <!-- <v-row>
          this.dbBuyBonusRes.map(this.getEditedObject)= {{ dbBuyBonusRes.map(getEditedObject) }}
        </v-row>
        <v-row>
          this.buyBonusResInternal.map(this.getEditedObject)= {{ buyBonusResInternal.map(getEditedObject) }}
        </v-row> -->
      </v-form>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import Vue from 'vue'

  import { asMixin, isFilled, isNumber, isNumeric, isInteger, isPosNumber, maxLen } from '@/utils/validate'

  export default {
    name: 'Basic',
    components: {
      BonusUnitSelect: () => import('../../BonusUnitSelect'),
    },
     props:{
      globalActive: {
        type: Boolean,
        required: true,
      }
    },
    mixins: [asMixin(isFilled)],
    data () {
      return {
        inputShow: '',
        switch1: false,
        setting: false,
        select: {
          nameBonuses: '',
          id: '',
          hover: false,
        },
        items: [],
        itemsAccrual: [],
        itemsMagazine: [],
        nameSelectNeedGet: '',
        // -
        showErrors: false,
        formValid: false,
        buyBonusResInternal: [],
        saveChangesActive: false,
        percentRules: [
          (v) => isFilled(v) || 'Введите процент',
          (v) => isNumeric(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
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
        dbBuyBonusRes: 'company/bonus_resources/buyBonusRes',
      }),
      programId () {
        return this.$store.getters.programId
      },
      ...mapGetters({
        getBonusesItems: 'createBonusesCurrency/create_bonuses_currency/getBonusesItems',
        getAccrualBonuses: 'createBonusesCurrency/create_bonuses_currency/getAccrualBonuses',
        getMagazineBonuses: 'createBonusesCurrency/create_bonuses_currency/getMagazineBonuses',
        getWhatSelect: 'createBonusesCurrency/create_bonuses_currency/getWhatSelect',
      }),

      buyBonusRes () {
        return this.buyBonusResInternal.map(item => {
          Vue.set(item, 'deleteAction', false)

          Vue.set(item, 'expire_days_unlimit', item.rules && item.rules.expire_days == null)

          Vue.set(item, 'rules', Object.assign({
            expire_days: null,
          }, item.rules))

          return item
        })
      },
      buyBonusResSource () {
        return this.buyBonusRes.filter(this.isSourceFilter)
      },
      buyBonusResTarget () {
        return this.buyBonusRes.filter(this.isTargetFilter)
      },

      checkValidInput () {
        const notValid = this.itemsAccrual.filter(item => {
          return (item.nameOperation !== '' || item.nameOperation === undefined) && item.countBy !== ''
        })
        return (this.itemsAccrual.length === notValid.length) && (this.itemsAccrual.length >= 1)
      },
      hasChanges () {
        return JSON.stringify(this.dbBuyBonusRes.map(this.getEditedObject)) !==
          JSON.stringify(this.buyBonusResInternal.map(this.getEditedObject))
      },
      valid () {
        return true
      },
    },
    watch: {
      getBonusesItems (val) {
        this.items = val
      },
      getAccrualBonuses (val) {
        this.itemsAccrual = val
      },
      getMagazineBonuses (val) {
        this.itemsMagazine = val
      },
      getWhatSelect (val) {
        for (let i = 0; i < this.itemsAccrual.length; i++) {
          if (this.itemsAccrual[i].selectName === this.nameSelectNeedGet) {
            this.itemsAccrual[i].selectName = val.nameBonuses
          }
        }
        for (let i = 0; i < this.itemsMagazine.length; i++) {
          if (this.itemsMagazine[i].selectName === this.nameSelectNeedGet) {
            this.itemsMagazine[i].selectName = val.nameBonuses
          }
        }
      },
    },
    methods: {
      ...mapMutations(
        {
          openNavigationRight: 'createBonusesCurrency/create_bonuses_currency/openNavigationCreateBonuses',
          updateBonusesItem: 'createBonusesCurrency/create_bonuses_currency/updateBonusesItem',
          resetState: 'createBonusesCurrency/create_bonuses_currency/resetState',
        }),

      validate () {
        this.showErrors = true
        if (!this.$refs.form.validate()) return false

        const allBonusUnitFilled = this.buyBonusRes.every(item => item.bonus_score && !!item.bonus_score.units_id)
        if (!allBonusUnitFilled) return false

        return true
      },

      async deleteBonusRes (bonusRes) {
        try {
          bonusRes.deleteAction = true
          const index = this.buyBonusResInternal.findIndex(x => x.id === bonusRes.id)
          if (index >= 0) {
            const item = this.buyBonusResInternal[index]
            if (!item.isNew) {
              await this.$store.dispatch('company/bonus_resources/DeleteBonusRes', bonusRes.id)
            }
            this.buyBonusResInternal.splice(index, 1)
          }
        } catch (error) {
          console.error(error)
        } finally {
          bonusRes.deleteAction = false
        }
      },

      addNewBonusRes (type = 'TYPE_SOURCE') {
        console.log('addNewBonusRes')
        this.buyBonusResInternal.push({
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
          rules: {
            event: 'App\\Events\\AccountBuyEvent',
            percent: null,
            expire_days: null,
          },
        })
      },

      isSourceFilter (item) {
        return item.resource_type_enum === 'TYPE_SOURCE'
      },
      isTargetFilter (item) {
        return item.resource_type_enum === 'TYPE_TARGET'
      },
      selectBonuses (itemSelect, currentElement, setName) {
        const nameArr = setName
        let arr = []
        nameArr === 'itemsAccrual' ? arr = this.itemsAccrual : arr = this.itemsMagazine
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === currentElement.id) {
            arr[i].selectName = itemSelect.nameBonuses
          }
        }
      },
      checkSelectAndHover (itemSelect, currentElement, setName) {
        const nameArr = setName
        let arr = []
        nameArr === 'itemsAccrual' ? arr = this.itemsAccrual : arr = this.itemsMagazine
        this.changeSetting(arr, itemSelect, currentElement, true)
      },
      checkSelectAndHoverLeave (itemSelect, currentElement, setName) {
        const nameArr = setName
        let arr = []
        nameArr === 'itemsAccrual' ? arr = this.itemsAccrual : arr = this.itemsMagazine
        this.changeSetting(arr, itemSelect, currentElement, false)
      },
      changeSetting (arr, itemSelect, currentElement, changeBooleanSetting) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === currentElement.id && itemSelect.nameBonuses === currentElement.selectName) {
            arr[i].setting = changeBooleanSetting
          }
        }
      },
      changeBonuses (item) {
        const copyObj = Object.assign({}, item)
        this.updateBonusesItem(item)
        this.nameSelectNeedGet = copyObj.nameBonuses
        this.openNavigationRight(true)
      },
      createBonusesCurrency () {
        this.$emit('bonus-unit-dialog', null)
        // this.openNavigationRight(true)
      },
      createNewAccrual (nameSelect) {
        if (!('nameOperation' in this.itemsAccrual[0])) {
          this.itemsAccrual[0].nameOperation = ''
        }
        const obj = {
          setting: false,
          selectName: nameSelect,
          id: this.itemsAccrual.length + 1,
          countBy: '',
          nameOperation: '',
          checkTimeLimit: true,
          day: 365,
        }
        this.itemsAccrual.push(obj)
      },
      createNewMagazine (nameSelect) {
        if (!('nameOperation' in this.itemsMagazine[0])) {
          this.itemsMagazine[0].nameOperation = ''
        }
        const obj = {
          setting: false,
          selectName: nameSelect,
          id: this.itemsMagazine.length + 1,
          countBy: '',
          nameOperation: '',
        }
        this.itemsMagazine.push(obj)
      },
      deleteAccrualOrMagazine (indexItem, nameArr) {
        const checkName = nameArr
        let arr = []
        checkName === 'itemsAccrual' ? arr = this.itemsAccrual : arr = this.itemsMagazine
        if (arr.length === 2) {
          delete arr[0].nameOperation
        }
        arr.splice(indexItem, 1)
      },
      checkValidNum (val) {
        const numEl = val.match(/\d+/)
        return Math.round(numEl)
      },
      minesCountDay (id, itemCount) {
        const count = Number(itemCount)
        for (let i = 0; i < this.itemsAccrual.length; i++) {
          if (this.itemsAccrual[i].id === id) {
            if (count === 1) {
              this.itemsAccrual[i].day = 1
            } else {
              this.itemsAccrual[i].day = count - 1
            }
          }
        }
      },
      plusCountDay (id, itemCount) {
        const count = Number(itemCount)
        for (let i = 0; i < this.itemsAccrual.length; i++) {
          if (this.itemsAccrual[i].id === id) {
            this.itemsAccrual[i].day = count + 1
          }
        }
      },
      checkMathRound (item) {
        console.log('checkMathRound', item)
        // TODO
        // return (+item) || 0
        // const num = +item
        // return (num != NaN)

        // const numEl = item.match(/^-?\d*\.?\d*$/)
        // if (numEl > 100) {
        //   return 100
        // } else if (numEl === null) {
        //   return ''
        // } else if (numEl[0] === '') {
        //   return ''
        // } else {
        //   return numEl
        // }
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
            percent: bonusRes.rules.percent,
            expire_days: bonusRes.rules.expire_days || null,
          } : null,
          expire_days_unlimit: bonusRes.expire_days_unlimit || bonusRes.rules.expire_days == null,

        }
      },
      async saveChanges () {
        if (!this.validate()) return

        try {
          this.saveChangesActive = true

          for (let index = 0; index < this.buyBonusResInternal.length; index++) {
            const element = this.buyBonusResInternal[index]

            const originalIndex = this.dbBuyBonusRes.findIndex(x => x.id === element.id)
            if (originalIndex >= 0) {
              const originalItem = this.dbBuyBonusRes[originalIndex]
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
        this.buyBonusResInternal = Object.copy(this.dbBuyBonusRes)

        if (this.buyBonusRes.length === 0) {
          this.addNewBonusRes('TYPE_SOURCE')
          this.addNewBonusRes('TYPE_TARGET')
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
// @import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import '_BlockStyle.scss';

</style>
