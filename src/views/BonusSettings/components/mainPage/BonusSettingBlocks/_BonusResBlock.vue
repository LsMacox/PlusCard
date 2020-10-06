<template>
<div
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
                  :error-message=" isFilled(bonusRes.bonus_score.units_id) || 'Выберите валюту' "
                  :show-error="showErrors"
                  style="width:254px"
                  v-on="$listeners"
                />

                <div class="wrap-circle">
                  <v-btn
                    v-if="showDeleteAction"
                    icon
                    class="simple-circle mines-right"
                    :loading="bonusRes.deleteAction"
                    @click="deleteBonusRes(bonusRes)"
                  >
                    <img src="@/icons/svg/mines.svg">
                  </v-btn>
                  <div
                    v-if="showAddAction"
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
                  <base-switch
                    v-model="bonusRes.expire_days_unlimit"

                    :label="bonusRes.expire_days_unlimit ? 'Срок действия бонусов: без ограничений' : ' Срок действия бонусов:'"
                  />
                </v-col>
                <v-col v-if="!bonusRes.expire_days_unlimit">
                  <div class="container-input-count">
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.expire_days = bonusRes.rules.expire_days > 1 ? bonusRes.rules.expire_days - 1 : 1"
                    >
                      <img src="@/icons/svg/mines.svg">
                    </div>
                    <input
                      v-model="bonusRes.rules.expire_days"
                      class="input-bonuses input-sm-xl input-sm"
                      type="text"
                      @input="bonusRes.rules.expire_days = checkValidNum($event.target.value)"
                    >
                    <div
                      class="small-circle-input"
                      @click="bonusRes.rules.expire_days = bonusRes.rules.expire_days + 1"
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
                  <base-switch
                    v-model="bonusRes.can_app_usage"
                    :label="'Разрешить использование менеджером'"
                  />
                </v-col>
              </v-row>
            </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import Vue from 'vue'

  import { asMixin, isFilled, isNumber, isPosNumber, maxLen } from '@/utils/validate'

  export default {
    name: 'BonusResBlock',
    components: {
      BonusUnitSelect: () => import('../../BonusUnitSelect'),
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
          (v) => isNumber(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
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

          Vue.set(item, 'rules', Object.assign({
            expire_days: null,
          }, item.rules))

          Vue.set(item, 'expire_days_unlimit', item.rules && item.rules.expire_days === null)

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
          bonus_score: bonusRes.bonus_score,
          can_app_usage: bonusRes.can_app_usage,
          rules: bonusRes.rules,

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
.percent-field {
  max-width: 154px;
  width: 100%;
  margin-right: 12px;
}
//-----
  .time-bonuses {
    height: 46px;
  }
  .list-own-padding {
    padding: 0;
  }
  .save-currency {
    padding: 34px 88px;
    border-top: 1px solid #E8E8ED;
  }
  .tab-basic {
    margin-bottom: 12px;
    border: 1px solid #F2F2F7;
    box-sizing: border-box;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1);
  }
  .title-basic {
    display: flex;
    align-items: center;
    .img-bag {
      margin-right: 22px;
    }
  }
  .small-circle-input {
    width: 20px;
    height: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
  }
  .small-circle-input:first-child {
    // margin-left: 20px;
  }
  .container-input-count {
    display: flex;
    align-items: center;
  }
  .container-input-counter {
    display: flex;
    align-items: center;
  }
  .input-big-name {
    margin-top: 12px;
  }
  .mess-wrap {
    display: flex;
    padding: 34px 30px;
    border-bottom: 1px solid #E8E8ED;
  }
  .wrap-circle {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .simple-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #EBF1FF;
    border-radius: 16px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  .mines-right {
    margin-right: 12px;
  }
  .magazine-wrap {
    padding: 34px 30px;
    display: flex;
  }
  .step {
    margin-right: 30px;
    font-size: 15px;
    color: #4776E6;
    line-height: 21px;
    width: 50px;
    height: 30px;
    border-radius: 20px;
    border: 1px solid #EBF1FF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shopping-inp {
    margin-right: 12px;
  }
  .plus-circle {
    margin-right: 10px;
  }
  .select-input-wrap {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  .wrap-input {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  .disabled-block {
    pointer-events: none;
    opacity: 0.4;
  }
  .custom-drop-down {
    border: 1px solid #D7D7E0;
    max-width: 254px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-drop-down:focus {
    outline: none;
  }
  .hide-img {
    display: none;
  }
  .border-bottom-not-round {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .item-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .v-list-item:hover {
    background: #EBF1FF;
    color: #2A2A34;
  }
  .btn-inside-select {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px;
    border-top: 1px solid #E8E8ED;
    cursor: pointer;
    color: #4776E6;
  }
  .btn-inside-select img {
    margin-right: 6px;
  }
  .first-step-switch {
    display: flex;
    align-items: center;
  }
</style>
