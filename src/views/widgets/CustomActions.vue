<template>
  <tab-list-frame
    class="custom-actions"
    :tabs="['Активность', 'Покупки']"
  >
    <template v-slot:tab-1>
      <ul class="custom-actions__list">
        <li
          v-for="item in widgetData['activity']"
          :key="item.id"
          class="custom-actions__item"
        >
          <div class="custom-actions__item-img">
            <img
              style="width: 24px; border-radius: 50%;"
              :src="item.avatar"
              @click.stop="userSidePanel(item)"
            >
          </div>
          <div class="custom-actions__item-text">
            <p
                class="body-s-semibold"
                @click.stop="userSidePanel(item)"
            >
              {{ item.name }} {{ item.lastname }}
            </p>
            <span class="body-s-medium wc-neutral">Действий: {{ item.action_count }}</span>
          </div>
        </li>
      </ul>
      <side-panel-edit-client
          v-if="sidePanelStatus.active"
          v-model="sidePanelStatus.active"
          :mode="sidePanelStatus.mode"
          :table-data="sidePanelStatus.data"
      />
    </template>
    <template v-slot:tab-2>
      <ul class="custom-actions__list">
        <li
          v-for="item in widgetData['purchases']"
          :key="item.id"
          class="custom-actions__item"
        >
          <div class="custom-actions__item-img">
            <img
              style="width: 24px; border-radius: 50%;"
              :src="item.avatar"
            >
          </div>
          <div class="custom-actions__item-text">
            <p class="body-s-semibold">
              {{ item.name }} {{ item.lastname }}
            </p>
            <span class="body-s-medium wc-neutral">Покупки: {{ item.purchase_count }}</span>
          </div>
        </li>
      </ul>
    </template>
  </tab-list-frame>
</template>

<script>
  import TabListFrame from '@/views/widgets/frames/TabListFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import SidePanelEditClient from '@/views/crm/client/components/SidePanelEditClient.vue'
  import ApiService from '@/api/api-client'

  export default {
    components: {
      TabListFrame,
      SidePanelEditClient,
    },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Object,
        default () {
          return {
            activity: [],
            purchases: [],
          }
        },
      },
    },
    data () {
      return {
        sidePanelStatus: {
          active: false,
          mode: 'edit',
          data: null,
        },
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    methods: {
      async userSidePanel (item) {
        console.log('user.....')
        console.log(item)
        console.log('user.....')

        if (item.id) {
          const result = await ApiService.get('/api-cabinet/widget/client', {
            params: {
              client_id: item.id,
              program_id: this.program.id,
            },
          })
          console.log(result)

          if (result.client && result.client.accounts) {
            console.log('OK>>>')
            item = result.client
            item.id = result.client.accounts[0].id
            this.sidePanelStatus.mode = 'edit'
            this.sidePanelStatus.data = item
            this.sidePanelStatus.active = true
          }
        }
      },
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/vuetify-preset-plus/light_theme/widgets/_custom-actions.scss";
  @import "~@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

  .contacts-info__item {
    p {
      margin-bottom: 16px!important;
    }
  }
  .custom-actions__item-text:hover {
    cursor: pointer;
  }
  .custom-actions__item-img:hover {
    cursor: pointer;
  }
</style>
