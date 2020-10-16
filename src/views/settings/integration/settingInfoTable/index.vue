<template>
  <div>
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
        :items="integrationsDisplay"
        hide-default-footer
        class="elevation-0 custom-table"
      >
        <template v-slot:item.created_at="{ item }">
          <div>
            <div class="desc-13-text font-weight-500 color-text-dark">
              {{ getDate(item.created_at) }}
            </div>
            <div class="desc-11 font-weight-600 text-light-grey">
              {{ 'в\u00A0' + getTime(item.created_at) }}
            </div>
          </div>
        </template>
        <template v-slot:item.updated_at="{ item }">
          <div>
            <div class="desc-13-text font-weight-500 color-text-dark">
              {{ getDate(item.updated_at) }}
            </div>
            <div class="desc-11 font-weight-600 text-light-grey">
              {{ 'в\u00A0' + getTime(item.updated_at) }}
            </div>
          </div>
        </template>
        <template v-slot:item.copy="{ item }">
          <div
            class="img-copy"
            @click="copySecret(item)"
          >
            <v-img src="@/icons/svg/copy.svg" />
          </div>
        </template>
        <template v-slot:item.active="{ item }">
          <v-switch
            v-model="item.active"
            :loading="item.changeActiveAction"
            :disabled="item.changeActiveAction"
            inset
            class="custom-switch"
            @change="activeChange(item, $event)"
          />
        </template>
        <template v-slot:item.change="{ item }">
          <div
            class="img-change"
            @click="updateConfiguringIntegrations(item)"
          >
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
  import Vue from 'vue'
  import dateTimeFormat from '@/mixins/dateTimeFormat.js'

  export default {
    name: 'SettingInfoTable',
    mixins: [dateTimeFormat],
    data () {
      return {
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
            width: '5em',
          },
          { text: 'Название', value: 'name' },
          { text: 'Ключ', value: 'secret', width: 1 },
          { text: '', value: 'copy', sortable: false, width: 1 },
          { text: 'Создано', value: 'created_at', width: '9em' },
          { text: 'Обновлено', value: 'updated_at', width: '9em' },
          { text: '', value: 'active', sortable: false, width: 1 },
          { text: '', value: 'change', sortable: false, width: 1 },
        ],
        desserts: [],
      }
    },
    computed: {
      ...mapGetters({
        getCreateConfiguringIntegrations: 'configuringIntegrations/configuring_integrations/getCreateConfiguringIntegrations',
        getCheckUpdate: 'configuringIntegrations/configuring_integrations/getCheckUpdate',
      }),
      integrationsDisplay () {
        return this.getCreateConfiguringIntegrations.map(x => {
          Vue.set(x, 'active', !x.revoked)
          Vue.set(x, 'changeActiveAction', false)
          return x
        })
      },
    },
    watch: {
      // getCreateConfiguringIntegrations (val) {
      //   this.desserts = val
      // },
      // getCheckUpdate (val) {
      //   this.desserts = []
      //   // console.log(this.getCreateConfiguringIntegrations)
      //   // this.$forceUpdate()
      //   // this.desserts = this.getCreateConfiguringIntegrations
      //   setTimeout(() => {
      //     this.desserts = this.getCreateConfiguringIntegrations
      //     this.checkUpdate(false)
      //   }, 100)
      // },
    },
    methods: {
      ...mapMutations({
        setUpdateIntegration: 'configuringIntegrations/configuring_integrations/setUpdateIntegration',
        openNavigationRight: 'configuringIntegrations/configuring_integrations/openNavigationConfiguring',
        checkUpdate: 'configuringIntegrations/configuring_integrations/checkUpdate',
      }),
      async copySecret (item) {
        this.$copyText(item.secret).then((e) => {
          // setTimeout(() => {
          //   this.copyLinkComplite = true
          // }, 100)

          this.$notify({
            title: item.name,
            text: 'Ключ успешно скопирован!',
            type: 'success',
          })
        }).catch((e) => {
          console.error(e)
          this.$notify({
            title: item.name,
            text: 'Ошибка при копировании ключа!',
            type: 'error',
          })
        })
      },
      updateConfiguringIntegrations (val) {
        this.setUpdateIntegration({})
        setTimeout(() => {
          this.openNavigationRight(true)
          this.setUpdateIntegration(val)
        }, 100)
      },
      async activeChange (item, active) {
        try {
          console.log('activeChange', item, active)
          item.changeActiveAction = true
          // await this.$sleep()
          await this.$store.dispatch('configuringIntegrations/configuring_integrations/SetRevokedClient', {
            id: item.id,
            revoked: !active,
          })
        } catch (error) {
          item.revoked = !item.revoked
        } finally {
          item.changeActiveAction = false
        }
      },
      newIntegration () {
        this.openNavigationRight(true)
      },
    },
  }
</script>

<style scoped>
  .table-wrap {
    /* max-width: 1024px; */
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
