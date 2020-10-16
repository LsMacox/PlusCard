<template>
  <v-navigation-drawer
    v-model="drawer"
    
    fixed
    temporary
    right
    width="500px"
    permanent
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
          Новая интеграция {{drawer}} {{checkOpenNavigationRight}}
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
          :validate-on-blur="true"
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
      <div class="tag-wrap-select">
        <div
          v-for="item in tag"
          :key="item.id"
        >
          <div
            class="tag-simple"
            :class="selectTag.includes(item) ? 'active-tag' : ''"
            @click="setSelectTag(item, item.id)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div v-if="update">
        <h3 class="title-h3 font-weight-600">
          Ключ
        </h3>
        <p class="desc-15 color-text-grey">
          Используется для получения токена авторизации API-Plus.
        </p>
        <div class="wrap-copy-input">
          <input
            v-model="copyKeyInput"
            type="text"
            class="copy-input input-bonuses"
            disabled
          >
          <img
            class="copy-img"
            src="@/icons/svg/copy.svg"
            @click="copyText"
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
      <div class="wrap-select-operation mbt-20">
        <h3 class="title-h3 font-weight-600 mbb-12">
          Бонусные рубли
        </h3>
        <v-select
          v-model="bonusSelect1"
          :items="items"
          item-text="title"
          item-value="value"
          persistent-hint
          return-object
          solo
          hide-details
          label="Операция начисления"
          class="select-grey-custom mb-select"
        />
        <v-select
          v-model="bonusSelect2"
          :items="items"
          item-text="title"
          item-value="value"
          persistent-hint
          return-object
          hide-details
          solo
          label="Операция начисления"
          class="select-grey-custom mb-select"
        />
      </div>
      <div class="wrap-select-operation mbt-20">
        <h3 class="title-h3 mbb-12">
          Шекели
        </h3>
        <v-select
          v-model="shekels1"
          :items="items"
          item-text="title"
          item-value="value"
          persistent-hint
          return-object
          solo
          hide-details
          label="Операция начисления"
          class="select-grey-custom mb-select"
        />
        <v-select
          v-model="shekels2"
          :items="items"
          item-text="title"
          item-value="value"
          persistent-hint
          return-object
          hide-details
          solo
          label="Операция начисления"
          class="select-grey-custom mb-select"
        />
      </div>
      <div
        v-if="update == false"
        class="btt-48"
      >
        <v-btn
          v-if="nameIntegration !== ''"
          color="primary"
          max-width="230"
          width="100%"
          @click="createIntegration"
        >
          <v-icon left>
            mdi-plus-circle-outline
          </v-icon>
          Добавить интеграцию
        </v-btn>
      </div>
      <div
        v-if="update"
        class="save-change btt-48"
      >
        <v-btn
          color="primary"
          max-width="148"
          width="100%"
          @click="saveNewUpdate"
        >
          <v-icon left>
            mdi-plus-circle-outline
          </v-icon>
          Сохранить
        </v-btn>
        <button
          class="trash-btn"
          @click="deleteIntegration"
        >
          <img src="@/icons/svg/trash.svg">
          Удалить интеграцию
        </button>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'NavigationDrawersRightSetting',
    data () {
      return {
        drawer: false,
        nameIntegration: '',
        bonusSelect1: '',
        bonusSelect2: '',
        shekels1: '',
        shekels2: '',
        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        copyKeyInput: '',
        key: '',
        id: '',
        date: {},
        updated: {},
        selectTag: [],
        update: false,
        allConfiguringIntegrations: [],
        tag: [
          {
            title: 'Методы работы с чатом',
            id: 1,
          },
          {
            title: 'API-методы работы с бонусами',
            id: 2,
          },
          {
            title: 'API-методы работы с компанией',
            id: 3,
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        checkOpenNavigationRight: 'configuringIntegrations/configuring_integrations/getOpenNavigationConfiguring',
        getCurrentIntegrationUpdate: 'configuringIntegrations/configuring_integrations/getCurrentIntegrationUpdate',
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
      }),
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
      getCreateConfiguringIntegrations (val) {
        this.allConfiguringIntegrations = val
      },
      getCurrentIntegrationUpdate (val) {
        this.nameIntegration = val.name
        this.selectTag = val.tag
        this.bonusSelect1 = val.bonusSelect1
        this.bonusSelect2 = val.bonusSelect2
        this.shekels1 = val.shekels1
        this.shekels2 = val.shekels2
        this.activeSelect = val.activeSelect
        this.id = val.id
        this.date = val.date
        this.updated = val.updated
        this.copyKeyInput = val.key
        this.update = true
      },
    },
    methods: {
      ...mapMutations({
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
        createConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/createConfiguringIntegrations',
        setUpdateIntegration: 'configuringIntegrations/configuring_integrations/setUpdateIntegration',
        updateCurrentIntegration: 'configuringIntegrations/configuring_integrations/updateCurrentIntegration',
        checkUpdate: 'configuringIntegrations/configuring_integrations/checkUpdate',
      }),
      copyText () {
        // this.copyKeyInput.select()
        // document.execCommand('copy')
      },
      clearNavigationRight () {
        this.openNavigationRight(false)
        this.nameIntegration = ''
        this.selectTag = []
        this.bonusSelect1 = ''
        this.bonusSelect2 = ''
        this.shekels1 = ''
        this.shekels2 = ''
        this.activeSelect = ''
        this.id = ''
        this.date = {}
        this.updated = {}
        this.copyKeyInput = ''
        if (this.update) {
          this.update = false
        }
      },
      saveNewUpdate () {
        for (let i = 0; i < this.allConfiguringIntegrations.length; i++) {
          if (this.allConfiguringIntegrations[i].id === this.id) {
            this.allConfiguringIntegrations[i] = this.updateObjIntegration()
            this.checkUpdate(true)
            this.updateCurrentIntegration(this.allConfiguringIntegrations)
            this.clearNavigationRight()
          }
        }
      },
      deleteIntegration () {
        for (let i = 0; i < this.allConfiguringIntegrations.length; i++) {
          if (this.allConfiguringIntegrations[i].id === this.id) {
            this.allConfiguringIntegrations.splice(i, 1)
            this.checkUpdate(true)
            this.updateCurrentIntegration(this.allConfiguringIntegrations)
            this.clearNavigationRight()
          }
        }
      },
      setSelectTag (item, id) {
        if (this.selectTag.includes(item)) {
          this.selectTag = this.selectTag.filter((e) => e.id !== id)
        } else {
          this.selectTag.push(item)
        }
      },
      createIntegration () {
        this.createConfiguringIntegrations(this.newObjIntegration())
        this.clearNavigationRight()
      },
      updateObjIntegration () {
        return {
          name: this.nameIntegration,
          tag: this.selectTag,
          bonusSelect1: this.bonusSelect1,
          bonusSelect2: this.bonusSelect2,
          shekels1: this.shekels1,
          shekels2: this.shekels2,
          activeSelect: true,
          id: this.id,
          key: this.copyKeyInput,
          date: this.date,
          updated: this.update,
        }
      },
      newObjIntegration () {
        const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        return {
          name: this.nameIntegration,
          tag: this.selectTag,
          bonusSelect1: this.bonusSelect1,
          bonusSelect2: this.bonusSelect2,
          shekels1: this.shekels1,
          shekels2: this.shekels2,
          activeSelect: true,
          id: btoa(Math.random()).substring(0, 12),
          key: randLetter + Date.now(),
          date: {
            time: '20.08.2020',
            inTime: 'в 14:02',
          },
          updated: {
            time: '20.08.2020',
            inTime: 'в 14:02',
          },
        }
      },
    },
  }
</script>

<style scoped>
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
