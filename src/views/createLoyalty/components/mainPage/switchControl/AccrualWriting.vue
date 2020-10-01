<template>
  <div
    class="tab-basic"
  >
    <div
      class="create-mess-container"
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
            v-if="items.length === 0"
            class="select-input-wrap"
          >
            <input
              v-model="inputShow"
              type="text"
              class="input-bonuses shopping-inp input-sm"
              placeholder="% от покупки"
              @input="inputShow = checkMathRound($event.target.value)"
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
            v-for="(accrual, accrualIndex) in itemsAccrual"
            :key="accrual.id"
            class="select-input-accrual-bonuses"
          >
            <div class="wrap-input">
              <input
                v-model="accrual.countBy"
                type="text"
                class="input-bonuses shopping-inp input-sm"
                placeholder="% от покупки"
                @input="accrual.countBy = checkMathRound($event.target.value)"
              >
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <button
                    v-bind="attrs"
                    class="custom-drop-down"
                    :class="attrs['aria-expanded'] === 'true' ? 'border-bottom-not-round' : ''"
                    v-on="on"
                  >
                    <span :class="attrs['aria-expanded'] === 'true' ? '' : 'hide-img'">Выберите валюту</span>
                    <span :class="attrs['aria-expanded'] === 'false' ? '' : 'hide-img'">{{ accrual.selectName }}</span>
                    <img
                      :class="attrs['aria-expanded'] === 'false' ? '' : 'hide-img'"
                      src="@/icons/svg/triangle-down.svg"
                    >
                    <img
                      :class="attrs['aria-expanded'] === 'true' ? '' : 'hide-img'"
                      src="@/icons/svg/triangle-up.svg"
                    >
                  </button>
                </template>
                <v-list class="list-own-padding">
                  <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="selectBonuses(item, accrual, 'itemsAccrual')"
                    @mouseover="checkSelectAndHover(item, accrual, 'itemsAccrual')"
                    @mouseleave="checkSelectAndHoverLeave(item, accrual, 'itemsAccrual')"
                  >
                    <v-list-item-title>
                      <div class="item-select">
                        {{ item.nameBonuses }} <img
                          v-if="item.nameBonuses === accrual.selectName && !accrual.setting"
                          src="@/icons/svg/check.svg"
                        >
                        <img
                          v-if="item.nameBonuses === accrual.selectName && accrual.setting"
                          src="@/icons/svg/settings.svg"
                          @click="changeBonuses(item)"
                        >
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-list class="list-own-padding">
                  <div
                    class="btn-inside-select"
                    @click="createBonusesCurrency"
                  >
                    <img
                      src="@/icons/svg/plus-circle.svg"
                    >
                    Добавить новую валюту
                  </div>
                </v-list>
              </v-menu>
              <div class="wrap-circle">
                <div
                  v-if="(accrual.nameOperation === '' || accrual.nameOperation !== '') && accrual.id >= 2"
                  class="simple-circle mines-right"
                  @click="deleteAccrualOrMagazine(accrualIndex, 'itemsAccrual')"
                >
                  <img src="@/icons/svg/mines.svg">
                </div>
                <div
                  v-if="accrual.nameOperation === '' || accrual.nameOperation !== ''"
                  class="simple-circle mines-right"
                  @click="createNewAccrual(accrual.selectName)"
                >
                  <img src="@/icons/svg/plus.svg">
                </div>
              </div>
            </div>
            <div>
              <input
                v-if="accrual.nameOperation !== undefined"
                v-model="accrual.nameOperation"
                type="text"
                class="input-bonuses input-big-name input-lg-l"
                placeholder="Введите название операции, чтобы не запутаться"
              >
            </div>
            <div class="time-bonuses">
              <div class="first-step-switch">
                <v-switch
                  v-model="accrual.checkTimeLimit"
                  inset
                  class="custom-switch"
                />
                <div v-if="accrual.checkTimeLimit">
                  <h3 class="desc-15">
                    Срок действия бонусов: без ограничений
                  </h3>
                </div>
                <div
                  v-else
                  class="container-input-counter"
                >
                  <p class="desc-15">
                    Срок действия бонусов:
                  </p>
                  <div class="container-input-count">
                    <div
                      class="small-circle-input"
                      @click="minesCountDay(accrual.id, accrual.day)"
                    >
                      <img src="@/icons/svg/mines.svg">
                    </div>
                    <input
                      v-model="accrual.day"
                      class="input-bonuses input-sm-xl input-sm"
                      type="text"
                      @input="accrual.day = checkValidNum($event.target.value)"
                    >
                    <div
                      class="small-circle-input"
                      @click="plusCountDay(accrual.id, accrual.day)"
                    >
                      <img src="@/icons/svg/plus.svg">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="magazine-wrap"
        :class="[itemsMagazine.length === 0 ? 'disabled-block' : '']"
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
            v-if="itemsMagazine.length === 0"
            class="select-input-wrap"
          >
            <input
              type="text"
              class="input-bonuses shopping-inp input-sm"
              placeholder="% от покупки"
            >
            <v-select
              :items="items"
              label="Выберите бонусную валюту"
              dense
              outlined
              hide-details
              class="select-md"
            />
          </div>
          <template v-else>
            <div
              v-for="(magazine, magazineIndex) in itemsMagazine"
              :key="magazine.id"
              class="select-input-accrual-bonuses"
            >
              <div class="wrap-input">
                <input
                  v-model="magazine.countBy"
                  type="text"
                  class="input-bonuses shopping-inp input-sm"
                  placeholder="% от покупки"
                  @input="magazine.countBy = checkMathRound($event.target.value)"
                >
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <button
                      v-bind="attrs"
                      class="custom-drop-down"
                      :class="attrs['aria-expanded'] === 'true' ? 'border-bottom-not-round' : ''"
                      v-on="on"
                    >
                      <span :class="attrs['aria-expanded'] === 'true' ? '' : 'hide-img'">Выберите валюту</span>
                      <span :class="attrs['aria-expanded'] === 'false' ? '' : 'hide-img'">{{ magazine.selectName }}</span>
                      <img
                        :class="attrs['aria-expanded'] === 'false' ? '' : 'hide-img'"
                        src="@/icons/svg/triangle-down.svg"
                      >
                      <img
                        :class="attrs['aria-expanded'] === 'true' ? '' : 'hide-img'"
                        src="@/icons/svg/triangle-up.svg"
                      >
                    </button>
                  </template>
                  <v-list class="list-own-padding">
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="selectBonuses(item, magazine, 'itemsMagazine')"
                      @mouseover="checkSelectAndHover(item, magazine, 'itemsMagazine')"
                      @mouseleave="checkSelectAndHoverLeave(item, magazine, 'itemsMagazine')"
                    >
                      <v-list-item-title>
                        <div class="item-select">
                          {{ item.nameBonuses }} <img
                            v-if="item.nameBonuses === magazine.selectName && !magazine.setting"
                            src="@/icons/svg/check.svg"
                          >
                          <img
                            v-if="item.nameBonuses === magazine.selectName && magazine.setting"
                            src="@/icons/svg/settings.svg"
                            @click="changeBonuses(item)"
                          >
                        </div>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-list class="list-own-padding">
                    <div
                      class="btn-inside-select"
                      @click="createBonusesCurrency"
                    >
                      <img
                        src="@/icons/svg/plus-circle.svg"
                      >
                      Добавить новую валюту
                    </div>
                  </v-list>
                </v-menu>
                <div class="wrap-circle">
                  <div
                    v-if="(magazine.nameOperation === '' || magazine.nameOperation !== '') && magazine.id >= 2"
                    class="simple-circle mines-right"
                    @click="deleteAccrualOrMagazine(magazineIndex, 'itemsMagazine')"
                  >
                    <img src="@/icons/svg/mines.svg">
                  </div>
                  <div
                    v-if="magazine.nameOperation === '' || magazine.nameOperation !== ''"
                    class="simple-circle mines-right"
                    @click="createNewMagazine(magazine.selectName)"
                  >
                    <img src="@/icons/svg/plus.svg">
                  </div>
                </div>
              </div>
              <div>
                <input
                  v-if="magazine.nameOperation !== undefined"
                  v-model="magazine.nameOperation"
                  type="text"
                  class="input-bonuses input-big-name input-lg-l"
                  placeholder="Введите название операции, чтобы не запутаться"
                >
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="checkValidInput"
        class="save-currency"
      >
        <v-btn
          small
          class="custom-gradient-bg"
          max-width="305px"
          width="100%"
          max-height="45px"
          height="100%"
          @click="saveChange"
        >
          <img
            src="@/icons/svg/checkmark-circle-outline.svg"
            class="img-circle"
          >
          Сохранить настройки механики
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  export default {
    name: 'Basic',
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
      }
    },
    computed: {
      ...mapGetters({
        getBonusesItems: 'createBonusesCurrency/create_bonuses_currency/getBonusesItems',
        getAccrualBonuses: 'createBonusesCurrency/create_bonuses_currency/getAccrualBonuses',
        getMagazineBonuses: 'createBonusesCurrency/create_bonuses_currency/getMagazineBonuses',
        getWhatSelect: 'createBonusesCurrency/create_bonuses_currency/getWhatSelect',
      }),
      checkValidInput () {
        const notValid = this.itemsAccrual.filter(item => {
          return (item.nameOperation !== '' || item.nameOperation === undefined) && item.countBy !== ''
        })
        return (this.itemsAccrual.length === notValid.length) && (this.itemsAccrual.length >= 1)
      },
    },
    methods: {
      ...mapMutations(
        {
          openNavigationRight: 'createBonusesCurrency/create_bonuses_currency/openNavigationCreateBonuses',
          updateBonusesItem: 'createBonusesCurrency/create_bonuses_currency/updateBonusesItem',
          resetState: 'createBonusesCurrency/create_bonuses_currency/resetState',
        }),
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
        this.openNavigationRight(true)
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
        const numEl = item.match(/^-?\d*\.?\d*$/)
        if (numEl > 100) {
          return 100
        } else if (numEl === null) {
          return ''
        } else if (numEl[0] === '') {
          return ''
        } else {
          return numEl
        }
      },
      saveChange () {
        this.$emit('saveChangeAccrual', false)
        this.resetState()
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
  }
</script>

<style scoped lang="scss">
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
    margin-left: 20px;
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
