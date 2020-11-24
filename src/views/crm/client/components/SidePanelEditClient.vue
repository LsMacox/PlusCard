<template>
  <side-panel
    ref="panel-crm_edit_client"
    v-model="state"
    :width="483"
    class="panel-crm panel-crm_edit_client"
  >
    <div
      ref="panel-crm_edit_client__header"
      class="panel-crm__header panel-crm_edit_client__header"
      :class="{usual: !mode, extended: mode}"
    >
      <div class="panel-crm_edit_client__tabs">
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          :class="{active: !mode}"
          color="primary-100"
          @click="mode = false"
        >
          Обычный
        </v-btn>
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          :class="{active: mode}"
          color="primary-100"
          :disabled="clientCardLoading"
          @click="mode = true"
        >
          Расширенный
        </v-btn>
      </div>
      <div class="panel-crm_edit_client__contacts">
        <div class="contacts__block-right">
          <div class="contacts-full_name">
            <p class="title-m-bold">
              {{ (accountClient.user && accountClient.user.name) ? accountClient.user.name : '-' }}
              {{ (accountClient.user && accountClient.user.lastname) ? accountClient.user.lastname : '-' }}
            </p>
          </div>
          <div class="contacts-online">
            <p class="body-s-semibold neutral-600--text">
              {{ (accountClient.user && accountClient.user.last_activity) ? getLastActivity(accountClient.user.last_activity) : '-' }}
            </p>
          </div>
        </div>
        <div class="contacts__block-left">
          <v-skeleton-loader
            v-if="clientCardLoading"
            v-bind="attrs"
            type="avatar"
          />
          <img
            v-else
            :src="[(accountClient.user && accountClient.user.avatar) ? accountClient.user.avatar : '']"
          >
        </div>
      </div>
      <div
        v-if="mode"
        ref="panel-crm_edit_client__sub-tabs"
        class="panel-crm_edit_client__sub-tabs"
      >
        <ul
          class="tab-list"
        >
          <li
            v-for="(tab, index) in extendedTabs"
            :key="'tab-' + tab.id"
            class="tab-item"
            :class="[tab.icon ? 'd-flex' : '', {active: tab.active}]"
          >
            <p
              class="body-m-medium neutral-500--text"
              @click="changeExtendedTab($event, index)"
            >
              {{ tab.title }}
            </p>
            <iconify-icon
              v-if="tab.icon"
              :icon="tab.icon"
              :class="tab.iconClass"
              width="18"
            />
          </li>
        </ul>
      </div>
    </div>
    <div
      :class="{usual: !mode, extended: mode}"
      class="panel-crm__body panel-crm_edit_client__body"
    >
      <mode-usual
        v-if="!mode && tableData"
        :client-data="tableData"
      />
      <mode-extended
        v-if="mode && tableData"
        :client-data="tableData"
        :tabs="extendedTabs"
      />
    </div>
  </side-panel>
</template>

<script>
  import Convertor from '@/mixins/convertor.js'
  import SidePanel from '@/components/base/SidePanel'
  // Modes
  import ModeUsual from './sidepanel/EditClientModeUsual'
  import ModeExtended from './sidepanel/EditClientModeExtended'

  export default {
    components: {
      SidePanel,
      ModeUsual,
      ModeExtended,
    },
    mixins: [Convertor],
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      active: {
        type: Boolean,
      },
      tableData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data () {
      return {
        mode: false, // false = usual, true = extended
        state: this.active,
        attrs: {
          class: 'mb-0',
          boilerplate: true,
          elevation: 0,
        },
        extendedTabs: [
          {
            id: 1,
            title: 'Клиент',
            active: true,
            componentName: 'TabClient',
          },
          {
            id: 2,
            title: 'Карта',
            active: false,
            componentName: 'TabMap',
          },
          {
            id: 3,
            title: 'Документы',
            active: false,
            componentName: 'TabDocument',
          },
          {
            id: 4,
            title: 'Операции',
            active: false,
            icon: 'tabler-external-link',
            iconClass: 'icon-external-link neutral-500--text',
            componentName: 'TabOperation',
          },
        ],
      }
    },
    computed: {
      clientCardLoading () {
        return this.$store.getters['crm/clientCard/loading']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      accountClient () {
        return this.$store.getters['crm/clientCard/client']
      },
    },
    watch: {
      active () {
        this.state = this.active
        this.getData()
      },
      state () {
        this.$emit('changeState', this.state)
      },
    },
    async created () {},
    async mounted () {
      await this.fetchData()
      this.shadowHeaderAtScroll()
    },
    methods: {
      getLastActivity (date) {
        if (date) return 'Был(а) в сети ' + this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
        return 'Был(а) в сети - '
      },
      changeExtendedTab (event, tabIndex) {
        this.extendedTabs.map((tab) => {
          tab.active = false
          return tab
        })

        this.extendedTabs[tabIndex].active = true
      },
      shadowHeaderAtScroll () {
        this.$refs['panel-crm_edit_client'].$el.querySelector('.v-navigation-drawer__content').addEventListener('scroll', (e) => {
          if (e.srcElement.scrollTop > 5) {
            this.$refs['panel-crm_edit_client__header'].style.boxShadow = '0px 7px 20px rgba(88, 93, 106, 0.1)'
          } else {
            this.$refs['panel-crm_edit_client__header'].style.boxShadow = 'none'
          }
        })
      },
      async getData () {
        // обнуляем пользователя карты
        this.$store.commit('crm/clientCard/SET_CLIENT', {})
        if (this.tableData) {
          await this.fetchData()
        }
      },
      async fetchData () {
        try {
          this.$store.commit('crm/clientCard/SET_LOADING', true)
          await this.$store.dispatch('company/bonus_resources/GetList', this.program.id) // бонусные операции
          await this.$store.dispatch('crm/segment/segments', { program_id: this.program.id }) // сегменты программы
          await this.$store.dispatch('crm/clientCard/getAccountBalances', this.tableData) // бонусные балансы
          await this.$store.dispatch('crm/clientCard/getAccountClient', this.tableData) // пользователь карты
        } finally {
          this.$store.commit('crm/clientCard/SET_LOADING', false)
        }
      },
    },
  }
</script>
