<template>
  <div>
    <div class="container-tab-btn">
      <div class="close-and-tab">
        <v-btn
          color="#B5B5C4"
          :text="true"
          :ripple="false"
        >
          <v-icon class="mro-6">
            $iconify_close-circle
          </v-icon> Отменить
        </v-btn>
        <div class="tab-main">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="#4776E6"
          >
            <v-tab
              v-for="item in items"
              :key="item"
              class="tabs-items-own"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
        </div>
      </div>
      <div class="save">
        <v-btn
          color="secondary"
          :text="true"
          :ripple="false"
          @click="back"
        >
          <v-icon class="mro-6">
            $iconify_bx-check-outlined
          </v-icon> Сохранить
        </v-btn>
      </div>
    </div>
    <div :class="tab === 0 || tab === 1 || tab === 4 ? 'container-tab-setting' : ''">
      <v-tabs-items v-model="tab">
        <keep-alive>
          <component
            :is="currentTabComponent"
          />
        </keep-alive>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
  import Organization from './tab/Organization/'
  import Balance from './tab/Balance'
  import Operations from './tab/Operations'
  import Accounts from './tab/Accounts'
  import Documents from './tab/Documents'
  export default {
    name: 'SettingRequisites',
    components: {
      Organization,
      Balance,
      Operations,
      Accounts,
      Documents,
    },
    data () {
      return {
        tab: null,
        items: [
          'Организация', 'Баланс', 'Операции', 'Счета', 'Документы',
        ],
      }
    },
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      currentTabComponent () {
        switch (this.tab) {
          case 0:
            return Organization
          case 1:
            return Balance
          case 2:
            return Operations
          case 3:
            return Accounts
          case 4:
            return Documents
        }
      },
    },
    methods: {
      back () {
        console.log(3123)
      },
    },
  }
</script>

<style scoped>
  .tabs-items-own {
    padding: 0;
    margin-right: 20px;
    min-width: 0;
    text-transform: none;
  }
  >>> .v-tabs-bar {
    height: 29px;
  }
  .container-tab-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 38px;
    margin-bottom: 68px;
    position: relative;
  }
  .container-tab-btn:after {
    display: block;
    position: absolute;
    width: calc(100% + 68px);
    height: 1px;
    bottom: 0;
    left: -34px;
    content:'';
    background-color: #F2F2F7;
  }
  .close-and-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 676px;
    flex: 0 0 100%;
  }
  .container-tab-setting {
    max-width: 676px;
    width: 100%;
    margin: 0 auto;
  }
  .mro-6 {
    margin-right: 6px;
  }
</style>
