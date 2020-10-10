<template>
  <div v-if="desserts.length !== 0">
    <div class="wrap-title">
      <h2 class="title-h2 font-weight-bold">
        Настройка интеграций
      </h2>
      <v-btn
        color="primary"
        max-width="230"
        width="100%"
        @click="newIntegration"
      >
        <v-icon left>
          mdi-plus-circle-outline
        </v-icon>
        Добавить интеграцию
      </v-btn>
    </div>
    <div class="table-wrap">
      <v-data-table
        :headers="headers"
        :items="desserts"
        hide-default-footer
        class="elevation-0 custom-table"
      >
        <template v-slot:item.date="{ item }">
          <div>
            <div class="desc-13-text font-weight-500 color-text-dark">
              {{ item.date.time }}
            </div>
            <div class="desc-11 font-weight-600 text-light-grey">
              {{ item.date.inTime }}
            </div>
          </div>
        </template>
        <template v-slot:item.copy="{ item }">
          <div class="img-copy">
            <v-img src="@/icons/svg/copy.svg" />
            {{ item.copy }}
            <!--              <img :src="require(`${item.operator.img}`)">-->
          </div>
        </template>
        <template v-slot:item.updated="{ item }">
          <div>
            <div class="desc-13-text font-weight-500 color-text-dark">
              {{ item.date.time }}
            </div>
            <div class="desc-11 font-weight-600 text-light-grey">
              {{ item.date.inTime }}
            </div>
          </div>
        </template>
        <template v-slot:item.activeSelect="{ item }">
          <v-switch
            v-model="item.activeSelect"
            inset
            class="custom-switch"
          />
        </template>
        <template v-slot:item.change="{ item }">
          <div class="img-change" @click="updateConfiguringIntegrations(item)">
            <v-img src="@/icons/svg/chevron-right.svg" />
            {{ item.change }}
            <!--              <img :src="require(`${item.operator.img}`)">-->
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'SettingInfoTable',
    data () {
      return {
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
          },
          { text: 'Название', value: 'name' },
          { text: 'Ключ', value: 'key' },
          { text: '', value: 'copy', sortable: false },
          { text: 'Создано', value: 'date' },
          { text: 'Обновлено', value: 'updated' },
          { text: '', value: 'activeSelect', sortable: false },
          { text: '', value: 'change', sortable: false },
        ],
        desserts: [],
      }
    },
    computed: {
      ...mapGetters({
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
        getCheckUpdate: 'configuringIntegrations/configuring_integrations/getCheckUpdate',
      }),
    },
    watch: {
      getCreateConfiguringIntegrations (val) {
        this.desserts = val
      },
      getCheckUpdate (val) {
        this.desserts = []
        // console.log(this.getCreateConfiguringIntegrations)
        // this.$forceUpdate()
        // this.desserts = this.getCreateConfiguringIntegrations
        setTimeout(() => {
          this.desserts = this.getCreateConfiguringIntegrations
          this.checkUpdate(false)
        }, 100)
      },
    },
    methods: {
      ...mapMutations({
        setUpdateIntegration: 'configuringIntegrations/configuring_integrations/setUpdateIntegration',
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
        checkUpdate: 'configuringIntegrations/configuring_integrations/checkUpdate',
      }),
      updateConfiguringIntegrations (val) {
        this.setUpdateIntegration({})
        setTimeout(() => {
          this.openNavigationRight(true)
          this.setUpdateIntegration(val)
        }, 100)
      },
      newIntegration () {
        this.openNavigationRight(true)
      },
    },
  }
</script>

<style scoped>
  .table-wrap {
    max-width: 1024px;
    width: 100%;
    margin: auto;
  }
  .wrap-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 34px;
  }
  .img-copy {
    cursor: pointer;
    width: 15px;
  }
  .img-change {
    cursor: pointer;
    width: 15px;
  }
</style>
