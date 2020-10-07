<template>
  <div>
    <div
      v-if="getCreateConfiguringIntegrations && getCreateConfiguringIntegrations.length === 0"
      class="no-data"
    >
      <div class="img-no-data">
        <v-img
          src="@/assets/png/settings-dummy.png"
          max-width="187"
        />
      </div>
      <div class="text-info-no-data">
        <h3 class="font-size-20">
          Здесь пока ничего нет :’(
        </h3>
        <p class="desc-15">
          Вы не добавили еще ни одной интеграции с сторонними сервисмами и приложениями
        </p>
      </div>
      <div>
        <v-btn
          color="primary"
          style="width: 210px"
          @click="newIntegration"
        >
          <v-icon left>
            mdi-plus-circle-outline
          </v-icon>
          Новая интеграция
        </v-btn>
      </div>
    </div>
    <setting-info-table />
    <navigation-drawers-right-setting />
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import navigationDrawersRightSetting from './navigationDrawers/navigationDrawersRightSetting'
  import settingInfoTable from './settingInfoTable'
  export default {
    name: 'Setting',
    components: {
      navigationDrawersRightSetting,
      settingInfoTable,
    },
    data () {
      return {}
    },
    methods: {
      ...mapMutations({
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
      }),
      newIntegration () {
        this.openNavigationRight(true)
      },
    },
    computed: {
      ...mapGetters({
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
      }),
    },
  }
</script>

<style scoped>
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    margin: 0 auto 60px;
    height: 70vh;
  }
  .text-info-no-data {
    text-align: center;
    margin: 34px 0;
  }
</style>
