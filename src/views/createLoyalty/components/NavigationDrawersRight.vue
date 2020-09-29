<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="483px"
  >
    <div class="navigation-drawers-wrap">
      <div>
        <v-btn
          color="secondary"
          :text="true"
          :ripple="false"
          class="btn-with-img"
          @click="hideNavigationRigth"
        >
          <img src="@/icons/svg/arrowBack.svg">
          Назад
        </v-btn>
      </div>
      <div class="navigation-title">
        <h1>Новая бонусная валюта</h1>
      </div>
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
          <input
            v-model="nameBonuses"
            type="text"
            class="input-lg input-bonuses"
            placeholder="Например, бонусы"
          >
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
          <input
            v-model="bonusesFirst"
            type="text"
            placeholder="1 бонус"
            class="input-sm-x input-bonuses"
          >
          <input
            v-model="bonusesSecond"
            type="text"
            placeholder="2 бонуса"
            class="input-sm-x input-bonuses"
          >
          <input
            v-model="bonusesThird"
            type="text"
            placeholder="5 бонусов"
            class="input-sm-x input-bonuses"
          >
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
          <v-switch
            v-model="switch1"
            inset
            class="custom-switch"
          />
          Разрешить передавать валюту
        </div>
      </div>
      <div
        v-if="nameBonuses && bonusesFirst && bonusesSecond && bonusesThird"
        class="save-currency"
      >
        <v-btn
          small
          class="custom-gradient-bg"
          max-width="185px"
          width="100%"
          max-height="45px"
          height="100%"
          @click="setCreateBonuses"
        >
          <img
            src="@/icons/svg/checkmark-circle-outline.svg"
            class="img-circle"
          >
          Создать валюту
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'NavigationDrawersRight',
    data () {
      return {
        switch1: true,
        drawer: false,
        nameBonuses: '',
        bonusesFirst: '',
        bonusesSecond: '',
        bonusesThird: '',
        update: false,
        idUpdate: 0,
        allBonusesItems: [],
      }
    },
    computed: {
      ...mapGetters({
        getOpenNavigationCreateBonuses: 'createBonusesCurrency/create_bonuses_currency/getOpenNavigationCreateBonuses',
        getBonusesItems: 'createBonusesCurrency/create_bonuses_currency/getBonusesItems',
        getUpdateBonusesItem: 'createBonusesCurrency/create_bonuses_currency/getUpdateBonusesItem',
      }),
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
      hideNavigationRigth () {
        this.clearNavigationRight()
      },
    },
  }
</script>
<style scoped>
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
