<template>
  <div class="main-mechanic">
    <div>
      <h2 class="title-h2">
        Какие механики вам нужны?
      </h2>
      <p class="desc-15 color-text-grey">
        Выберите и настройте те механики, которые вам нужны. Базовые механики доступны бесплатно.
        Комбинируйте их с продвинутыми для создания идеальной программы лояльности. Платите только за то, что вам нужно.
        Отменить подписку можно в любое время.
      </p>
    </div>
    <div class="tab-main">
      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="primary"
      >
        <v-tab
          v-for="item in items"
          :key="item"
          class="tabs-items-own body-m-medium"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <keep-alive>
          <component
            :is="currentTabComponent"
            ref="tabComp"
            v-on="$listeners"
          />
        </keep-alive>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
  import Basic from './tab/Basic'
  import Advanced from './tab/Advanced'
  export default {
    name: 'BonusSettingsMain',
    components: {
      Basic,
      Advanced,
    },
    data () {
      return {
        tab: null,
        items: [
          'Базовые', 'Продвинутые',
        ],
      }
    },
    computed: {
      currentTabComponent () {
        if (this.tab === 0) {
          return Basic
        } else {
          return Advanced
        }
      },

    },

    methods: {
      openBonusUnitDialog (bonusUnit) {
        this.$emit('bonus-unit-dialog', bonusUnit)
      },
      async save () {
        await this.$refs.tabComp.save()
      },
    },

  }
</script>

<style scoped>
  .main-mechanic {
    margin-top: 100px;
  }
  .tab-main {
    margin-top: 50px;
  }
  .tabs-items-own {
    padding: 0;
    margin-right: 20px;
    min-width: 0;
    text-transform: none;
  }
</style>
