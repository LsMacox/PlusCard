<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="483px"
    permanent
  >
    <div class="navigation-drawers-wrap">
      <div>
        <v-btn
          color="secondary"
          :text="true"
          :ripple="false"
          class="btn-with-img"
          @click="close"
        >
          <img src="@/icons/svg/arrowBack.svg">
          Назад
        </v-btn>
      </div>
      <div class="navigation-title">
        <h1>{{ isNew ? 'Новая бонусная валюта': 'Редактирование бонусной валюты' }} </h1>
      </div>
      <v-form
        ref="form"
        v-model="valid"
      >
        <div class="name-currency">
          <div class="title-currency">
            <h3 class="title-h3">
              Название валюты
            </h3>
            <p class="desc-15">
              Это название будет видно всем пользователям приложения Plus Cards.
            </p>
          </div>
          <div>
            <base-text-field
              v-model="bonusUnitInternal.name"
              :rules="nameRules"
              :validation-placement="'bottom'"
              class="input-lg input-bonuses"
              placeholder="Например, бонусы"

              counter
              minlength="1"
              maxlength="45"

              validate-on-blur
            />
            <!-- :attach="'.navigation-drawers-wrap'" -->
          </div>
        </div>
        <div class="declines-currency">
          <div class="title-currency">
            <h3 class="title-h3">
              Склонения валюты
            </h3>
            <p class="desc-15">
              Введите название валюты в разных склонениях. Багодаря этому достигается корректное отображение баланса.
            </p>
          </div>
          <div class="input-box">
            <base-text-field
              v-model="bonusUnitInternal.unit_name_ending_first"
              :rules="nameEndingRules"
              :validation-placement="'bottom'"
              class="name-ending-input"
              placeholder="1 бонус"
              maxlength="45"
              validate-on-blur
            />
            <base-text-field
              v-model="bonusUnitInternal.unit_name_ending_second"
              :rules="nameEndingRules"
              :validation-placement="'bottom'"
              class="name-ending-input"
              placeholder="2 бонуса"
              maxlength="45"
              validate-on-blur
            />
            <base-text-field
              v-model="bonusUnitInternal.unit_name_ending_third"
              :rules="nameEndingRules"
              class="name-ending-input"
              :validation-placement="'bottom'"
              placeholder="5 бонусов"
              maxlength="45"
              validate-on-blur
            />
            <!-- <input
              v-model="bonusUnitInternal.unit_name_ending_first"
              type="text"
              placeholder="1 бонус"
              class="input-sm-x input-bonuses"
            > -->

            <!-- <input
              v-model="bonusUnitInternal.unit_name_ending_second"
              type="text"
              placeholder="2 бонуса"
              class="input-sm-x input-bonuses"
            >
            <input
              v-model="bonusUnitInternal.unit_name_ending_third"
              type="text"
              placeholder="5 бонусов"
              class="input-sm-x input-bonuses"
            > -->
          </div>
        </div>
        <div class="transfer-currency">
          <div class="title-currency">
            <h3 class="title-h3">
              Передача валюты
            </h3>
            <p class="desc-15">
              Даете ли вы возможность делиться и передавать друг другу валюту?
            </p>
          </div>
          <div class="allow-transfer-currency">
            <base-switch
              v-model="bonusUnitInternal.can_transfer"
              label="Разрешить передавать валюту"
            />
          </div>
        </div>
        <div class="transfer-currency">
          <div class="title-currency">
            <h3 class="title-h3">
              Основная валюта
            </h3>
            <p class="desc-15">
              Основная валюта отображается на карте в приложении, используется для построения всех графиков и диаграмм.
            </p>
          </div>
          <div class="allow-transfer-currency">
            <base-switch
              v-model="bonusUnitInternal.is_main"
              label="Использовать как основную"
            />
          </div>
          <v-row v-if="isMainUpdate">
            <v-col>
              <span class="error--text body-m-regular">
                У вас уже есть основная валюта <span class="body-m-semibold">«{{ mainBonusUnit.name }}»</span>. Если вы хотите использовать валюту <span class="body-m-semibold">«{{ bonusUnitInternal.name }}»</span> как основную, оставьте переключатель включенным.

              </span>
            </v-col>
          </v-row>
        </div>
      </v-form>
      <v-row
        class="save-currency"
      >
        <v-btn
          small
          :disabled="!valid"
          color="primary"
          :loading="confirmAction"
          @click="confirmClick"
        >
          <v-icon left>
            $iconify_ion-checkmark-circle-outline
          </v-icon>

          <!-- <img
            src="@/icons/svg/checkmark-circle-outline.svg"
            class="img-circle"
          > -->
          {{ isNew ? 'Создать валюту' : 'Сохранить' }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="!isNew"
          text
          color="error"
          :loading="deleteAction"
          @click="deleteClick"
        >
          <v-icon left>
            $iconify_feather-trash
          </v-icon>
          <span>Удалить валюту</span>
        </v-btn>
      </v-row>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { isFilled, maxLen } from '@/utils/validate'

  export default {
    name: 'BonusUnitDialog',
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      value: Boolean,
      bonusUnit: {
        type: Object,
        default: undefined,
      },
      programId: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {

        nameBonuses: '',
        bonusesFirst: '',
        bonusesSecond: '',
        bonusesThird: '',
        update: false,
        idUpdate: 0,
        allBonusesItems: [],
        // --
        valid: false,
        confirmAction: false,
        deleteAction: false,
        bonusUnitInternal: {
          name: '',
          type_enum: 'INTEGER',
          max_value: null,
          unit_name_ending_first: '',
          unit_name_ending_second: '',
          unit_name_ending_third: '',
          can_transfer: false,
          cert_pay_available: false,
          is_main: false,
        },
        nameRules: [
          (v) => isFilled(v) || 'Введите название валюты',
          (v) => maxLen(v, 45) || 'Не более 45 символов',
        ],
        nameEndingRules: [
          (v) => maxLen(v, 45) || 'Не более 45 символов',
        ],

      }
    },
    computed: {

      ...mapGetters({
        bonusUnits: 'company/bonus_units/bonusUnits',
        mainBonusUnit: 'company/bonus_units/mainBonusUnit',

        getOpenNavigationCreateBonuses: 'createBonusesCurrency/create_bonuses_currency/getOpenNavigationCreateBonuses',
        getBonusesItems: 'createBonusesCurrency/create_bonuses_currency/getBonusesItems',
        getUpdateBonusesItem: 'createBonusesCurrency/create_bonuses_currency/getUpdateBonusesItem',
      }),

      isNew () {
        return !this.bonusUnit
      },
      // valid () {
      //   return this.bonusUnitInternal.name &&
      //     this.bonusUnitInternal.unit_name_ending_first &&
      //     this.bonusUnitInternal.unit_name_ending_second &&
      //     this.bonusUnitInternal.unit_name_ending_third
      // },
      drawer: {
        get () {
          return this.value
        },
        set (val) {
          if (val === this.value) return
          this.$emit('change', val)
        },
      },
      isMainUpdate () {
        return this.bonusUnitInternal.is_main && this.mainBonusUnit && this.mainBonusUnit.id !== this.bonusUnitInternal.id
      },

    },
    watch: {
      getOpenNavigationCreateBonuses (val) {
        this.drawer = val
      },
      drawer (val) {
        if (!val) {
          this.clearNavigationRight()
        }
      },
      getUpdateBonusesItem (val) {
        if (Object.keys(val).length !== 0) {
          this.nameBonuses = val.nameBonuses
          this.bonusesFirst = val.bonusesFirst
          this.bonusesSecond = val.bonusesSecond
          this.bonusesThird = val.bonusesThird
          this.idUpdate = val.id
          this.update = true
        }
      },
      getBonusesItems (val) {
        this.allBonusesItems = val
      },

    },

    methods: {
      ...mapMutations({
        openNavigationRight: 'createBonusesCurrency/create_bonuses_currency/openNavigationCreateBonuses',
        createBonusesItem: 'createBonusesCurrency/create_bonuses_currency/createBonusesItem',
        createAccrualBonuses: 'createBonusesCurrency/create_bonuses_currency/createAccrualBonuses',
        createMagazineBonuses: 'createBonusesCurrency/create_bonuses_currency/createMagazineBonuses',
        updateBonusesItem: 'createBonusesCurrency/create_bonuses_currency/updateBonusesItem',
        getWhatSelect: 'createBonusesCurrency/create_bonuses_currency/getWhatSelect',
        updateWhatSelect: 'createBonusesCurrency/create_bonuses_currency/updateWhatSelect',
      }),   

      setCreateBonuses () {
        if (this.update) {
          const copyObj = Object.assign({}, this.createUpdateObjBonuses())
          for (let i = 0; i < this.allBonusesItems.length; i++) {
            if (this.allBonusesItems[i].id === this.idUpdate) {
              this.allBonusesItems[i] = copyObj
              this.updateWhatSelect(copyObj)
            }
            this.drawer = false
          }
        } else {
          if (this.getBonusesItems.length === 0) {
            this.createMagazineBonuses(this.createObjMagazineBonuses())
            this.createAccrualBonuses(this.createObjAccrualBonuses())
            this.createBonusesItem(this.createObjNameBonuses())
            this.drawer = false
          } else {
            this.createBonusesItem(this.createObjNameBonuses())
            this.drawer = false
          }
        }
      },
      createObjNameBonuses () {
        return {
          nameBonuses: this.nameBonuses,
          bonusesFirst: this.bonusesFirst,
          bonusesSecond: this.bonusesSecond,
          bonusesThird: this.bonusesThird,
          id: this.getBonusesItems.length + 1,
        }
      },
      createObjAccrualBonuses () {
        return {
          setting: false,
          selectName: this.nameBonuses,
          id: this.getBonusesItems.length + 1,
          countBy: '',
          checkTimeLimit: true,
          day: 365,
          confusedNameSelect: '',
        }
      },
      createObjMagazineBonuses () {
        return {
          setting: false,
          selectName: this.nameBonuses,
          id: this.getBonusesItems.length + 1,
          countBy: '',
        }
      },
      createUpdateObjBonuses () {
        return {
          nameBonuses: this.nameBonuses,
          bonusesFirst: this.bonusesFirst,
          bonusesSecond: this.bonusesSecond,
          bonusesThird: this.bonusesThird,
          id: this.idUpdate,
        }
      },
      clearNavigationRight () {
        this.openNavigationRight(false)
        this.nameBonuses = ''
        this.bonusesFirst = ''
        this.bonusesSecond = ''
        this.bonusesThird = ''
        if (Object.keys(this.getUpdateBonusesItem).length !== 0) {
          this.update = false
          this.updateBonusesItem({})
        }
      },
      // ---
      async deleteClick () {
        try {
          this.deleteAction = true
          await this.$store.dispatch('company/bonus_units/deleteBonusUnit', this.bonusUnit.id)
          this.close()
        } catch (error) {
          console.error(error)
        } finally {
          this.deleteAction = false
        }
      },

      async confirmClick () {
        try {
          this.confirmAction = true

          const postData = {
            program_id: this.programId,
            max_value: this.bonusUnitInternal.max_value,
            name: this.bonusUnitInternal.name,
            type_enum: this.bonusUnitInternal.type_enum,
            unit_name_ending: {
              first: this.bonusUnitInternal.unit_name_ending_first,
              second: this.bonusUnitInternal.unit_name_ending_second,
              third: this.bonusUnitInternal.unit_name_ending_third,
            },
            cert_pay_available: this.bonusUnitInternal.cert_pay_available,
            can_transfer: this.bonusUnitInternal.can_transfer,
            is_main: this.bonusUnitInternal.is_main,
          }

          if (this.isNew) {
            await this.$store.dispatch('company/bonus_units/createBonusUnit', postData)
          } else {
            postData.id = this.bonusUnit.id
            await this.$store.dispatch('company/bonus_units/updateBonusUnit', postData)
          }
          this.close()
        } catch (error) {
          console.error(error)
        } finally {
          this.confirmAction = false
        }
      },
      close () {
        this.drawer = false
      },
      init (bonusUnit) {
        console.log('init', bonusUnit)
        this.bonusUnitInternal = Object.assign(this.bonusUnitInternal, bonusUnit)
        if (bonusUnit.unit_name_ending) {
          this.bonusUnitInternal.unit_name_ending_first = bonusUnit.unit_name_ending.first
          this.bonusUnitInternal.unit_name_ending_second = bonusUnit.unit_name_ending.second
          this.bonusUnitInternal.unit_name_ending_third = bonusUnit.unit_name_ending.third
        }
      },
    },
    created () {
      if (this.bonusUnit) this.init(this.bonusUnit)
    },
  }
</script>
<style scoped>
  .name-ending-input {
    margin: 0px 6px;
  }
  .navigation-drawers-wrap {
    padding: 34px;
  }
  .navigation-title {
    margin: 50px 0 34px;
  }
  .title-currency {
    margin-bottom: 20px;
  }
  .name-currency {
    margin-bottom: 34px;
  }
  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0px -6px;
  }
  .declines-currency {
    margin-bottom: 34px;
  }
  .allow-transfer-currency {
    display: flex;
    align-items: center;
  }
  .transfer-currency {
    margin-bottom: 48px;
  }
</style>
