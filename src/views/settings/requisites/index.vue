<template>
  <v-row
    no-gutters
    style="height: 100%;"
  >
    <v-col>
      <v-row class="container-tab-btn">
        <div class="close-and-tab">
          <v-btn
            color="#B5B5C4"
            :text="true"
            :ripple="false"
            @click="back"
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
                :key="item.id"
                class="tabs-items-own"
                :to="item.route"
              >
                {{ item.name }}
              </v-tab>
            </v-tabs>
          </div>
        </div>
        <div
          v-if="getTabIndex === 0"
          class="save"
        >
          <v-btn
            color="secondary"
            :text="true"
            :ripple="false"
            @click="save"
          >
            <v-icon class="mro-6">
              $iconify_bx-check-outlined
            </v-icon> Сохранить
          </v-btn>
        </div>
      </v-row>
      <v-row
        style="height: calc(100% - 67px);"
        no-gutters
      >
        <v-col :class="[0,1,4].includes(getTabIndex) ? 'container-tab-setting' : ''">
          <v-tabs-items
            :value="getTabIndex"
            style="height: 100%;"
          >
            <keep-alive>
              <component
                :is="currentTabComponent"
              />
            </keep-alive>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import Organization from './tab/Organization/'
  import Balance from './tab/Balance'
  import Operations from './tab/Operations'
  import Accounts from './tab/Orders'
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
    props: {
      startTab: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        tab: null,
        items: [
          { id: '#org', name: 'Организация', route: { hash: '#org' } },
          { id: '#balance', name: 'Баланс', route: { hash: '#balance' } },
          { id: '#operations', name: 'Операции', route: { hash: '#operations' } },
          { id: '#orders', name: 'Счета', route: { hash: '#orders' } },
          { id: '#docs', name: 'Документы', route: { hash: '#docs' } },
        ],
      }
    },
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      currentTabComponent () {
        switch (this.getTabIndex) {
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
      getTabIndex () {
        const index = this.items.findIndex(x => x.id === this.startTab)
        return (index >= 0 ? index : 0)
      },
      requisites () {
        return this.$store.getters['settings/organization/requisites']
      },
    },
    created () {
      // this.setItemById(this.startTab)
    },
    async mounted () {
      await this.$store.dispatch('settings/organization/details')
    },
    methods: {
      back () {
        this.$router.back()
      },
      async save () {
        try {
          await this.$store.dispatch('settings/organization/save', this.requisites)
          this.$notify({
            title: 'Настройка организации',
            text: 'Реквизиты обновлены успешно',
            type: 'success',
          })
        } catch (error) {
          console.error(error)
          throw error
        }
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
    /* margin-bottom: 68px; */
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
