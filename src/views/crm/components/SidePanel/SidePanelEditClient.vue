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
          @click="mode = true"
        >
          Расширенный
        </v-btn>
      </div>
      <div class="panel-crm_edit_client__contacts">
        <div class="contacts__block-right">
          <div class="contacts-full_name">
            <p class="title-m-bold">
              {{ tableData ? tableData.name || '-' : '' }}
            </p>
            <p class="title-m-bold">
              {{ tableData ? tableData.lastname || '-' : '' }}
            </p>
          </div>
          <div class="contacts-online">
            <p class="body-s-semibold neutral-600--text">
              {{ tableData ? getLastActivity(tableData.last_activity) : '' }}
            </p>
          </div>
        </div>
        <div class="contacts__block-left">
          <img
            :src="[tableData ? tableData.avatar || '' : '']"
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
  // Mode
  import ModeUsual from './components/EditClientModeUsual'
  import ModeExtended from './components/EditClientModeExtended'

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
          return {
            id: '103112',
            gender: true,
            birthday: '10.03.1990',
            city: 'Новокузнецк',
            name: 'Константин',
            lastname: 'Константинопольский',
            last_activity: '02.08.2020 04:32',
            phone: '79832525202',
            email: 'rs.bikeev@yandex.ru',
            barcode: '1640000000145437',
            card: '432156',
            avatar: require('@/assets/png/custom/beardedman.png'),
          }
        },
      },
    },
    data () {
      return {
        mode: false, // false = usual, true = extended
        state: this.active,
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
    computed: {},
    watch: {
      active () {
        this.state = this.active
      },
      state () {
        this.$emit('changeState', this.state)
      },
    },
    created () {},
    mounted () {
      this.$refs['panel-crm_edit_client'].$el.querySelector('.v-navigation-drawer__content').addEventListener('scroll', (e) => {
        if (e.srcElement.scrollTop > 10) {
          this.$refs['panel-crm_edit_client__header'].style.boxShadow = '0px 7px 20px rgba(88, 93, 106, 0.1)'
        } else {
          this.$refs['panel-crm_edit_client__header'].style.boxShadow = 'none'
        }
      })
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
    },
  }
</script>
