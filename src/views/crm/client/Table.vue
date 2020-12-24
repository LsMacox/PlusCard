<template>
  <div>
    <empty-client
      v-if="!clientsStore.length && false"
    />
    <div
      v-else
    >
      <div style="margin: 20px 0 15px 0;">
        <client-filter
          @apply-filter="applyFilter"
        />
      </div>
      <base-table
        v-if="clients.length"
        class-name="table-client"
        :headers="tableHeaders"
        :data="clients"
        :table-options="list"
        :total-count="totalClients"
        :word-operations="['клиент', 'клиента', 'клиентов']"
        :pagination-options="paginationOptions"
        :pagination="{
          sortBy: 'created_at',
          descending: 'descending',
        }"
        @click:row="editSidePanel"
      >
        <template v-slot:[`item.id`]="{ item }">
          <div class="body-s-semibold neutral-900--text">
            {{ item.id }}
          </div>
          <div
            class="body-xs-semibold neutral-600--text"
            style="margin-top: 4px;"
          >
            {{ item.barcode ? item.barcode : '-' }}
          </div>
        </template>

        <template v-slot:[`item.client`]="{ item }">
          <div class="table-cell_avatar">
            <img
              class="table-cell_avatar-img"
              :src="(item.user && item.user.avatar) ? item.user.avatar : ''"
            >
            <div class="table-cell_avatar-text">
              <div class="body-s-semibold neutral-900--text table-cell_avatar-text2">
                {{ getFIO(item.user) + ( (item.client_name && item.client_name != item.user.FIO) ? ` (${item.client_name})` : '' ) }}
              </div>
              <div
                class="body-xs-semibold neutral-600--text table-cell_avatar-text2"
                style="margin-top: 4px;"
              >
                {{ (item.user && item.user.last_activity) ? getLastActivity(item.user.last_activity) : '' }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:[`item.segments`]="{ item }">
          <v-row
            v-if="item.segments && item.segments.length"
          >
            <div
              v-for="(segment, i) in item.segments"
              :key="`segment${i}`"
              class="segment__name body-s-semibold "
              :style="segment.color != undefined ? `color: ${segment.color}; background: ${hexToRgbA(segment.color, '0.15')}` : ''"
            >
              <v-tooltip
                dark
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    style="max-width:20rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    v-on="on"
                  >
                    {{ segment.name }}
                  </span>
                </template>
                <div style="max-width:40rem; word-break: break-word;">
                  {{ segment.name }}
                </div>
              </v-tooltip>
            </div>
          </v-row>
          <div v-else>
            -
          </div>
        </template>

        <template v-slot:[`item.contacts`]="{ item }">
          <div class="body-s-semibold neutral-900--text">
            {{ (item.user && item.user.phone) ? item.user.phone : '-' }}
          </div>
          <div
            class="body-xs-semibold neutral-600--text"
            style="margin-top: 4px;"
          >
            {{ (item.user && item.user.email) ? item.user.email : '-' }}
          </div>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <div class="body-s-semibold neutral-900--text">
            {{ getDate(item.created_at) }}
          </div>
          <div
            class="body-xs-semibold neutral-600--text"
            style="margin-top: 4px;"
          >
            {{ getTime(item.created_at) }}
          </div>
        </template>

        <template v-slot:[`item.data-table-expand`]>
          <v-icon
            color="neutral-500"
            size="11"
          >
            fas fa-chevron-right
          </v-icon>
        </template>
      </base-table>
      <empty-client
        v-else
      />
    </div>
    <side-panel-edit-client
      v-if="sidePanelStatus.active"
      v-model="sidePanelStatus.active"
      :mode="sidePanelStatus.mode"
      :table-data="sidePanelStatus.data"
    />
  </div>
</template>

<script>
  import ClientFilter from './Filter'
  import EmptyClient from './Empty'
  import SidePanelEditClient from './components/SidePanelEditClient'
  import Convertor from '@/mixins/convertor'
  import User from '@/mixins/user.js'

  export default {
    components: {
      ClientFilter,
      EmptyClient,
      SidePanelEditClient,
    },
    mixins: [Convertor, User],
    data () {
      return {
        loadingList: false,
        sidePanelStatus: {
          mode: 'create',
          data: null,
        },
        paginationOptions: [
          { text: '25 на странице', value: 25 },
          { text: '50 на странице', value: 50 },
          { text: '100 на странице', value: 100 },
          { text: '150 на странице', value: 150 },
          { text: '250 на странице', value: 250 },
          { text: '500 на странице', value: 500 },
        ],
        tableHeaders: [
          { text: 'Карта клиента', align: 'start', value: 'id' },
          { text: 'Клиент', align: 'start', value: 'client', width: '20em' },
          { text: 'Сегмент', align: 'start', value: 'segments' },
          { text: 'Контакты', align: 'start', value: 'contacts' },
          { text: 'Создание', align: 'start', value: 'created_at' },
          { text: '', align: 'end', value: 'data-table-expand' },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      clientsStore () {
        return this.$store.getters['crm/client/clients']
      },
      clients () {
        const filteredClients = this.$store.getters['crm/client/filteredClients']
        if (filteredClients.length) return filteredClients
        return this.$store.getters['crm/client/clients']
      },
      totalClients () {
        const filteredClients = this.$store.getters['crm/client/filteredClients']
        if (filteredClients.length) return filteredClients.length
        return this.$store.getters['crm/client/total']
      },
      filter () {
        return this.$store.getters['crm/client/filter']
      },
      list: {
        get () {
          return this.$store.getters['crm/client/list']
        },
        set (v) {
          this.$store.commit('crm/client/SET_LIST', v)
        },
      },
      queryValue () {
        return this.$store.getters['crm/client/queryValue']
      },
    },
    watch: {
      program (v) {
        if (v) this.fetchData()
      },
      filter (v) {
        if (v) this.fetchData()
      },
      'list.page' (v) {
        if (v) this.fetchData()
      },
      'list.itemsPerPage' (v) {
        if (v) this.fetchData()
      },
    },
    created () {
    // this.segmentsData = this.$store.getters['crm/segment/segments']
    },
    async mounted () {
      await this.fetchData()
    },
    methods: {
      applyFilter () {
        console.log('FILTER APPLIED')
        this.fetchData()
      },
      createSidePanel (item) {
        this.sidePanelStatus.mode = 'create'
        this.sidePanelStatus.data = null
        this.sidePanelStatus.active = true
      },
      editSidePanel (item) {
        this.$set(this.sidePanelStatus, 'mode', 'edit')
        this.$set(this.sidePanelStatus, 'data', item)
        this.$set(this.sidePanelStatus, 'active', true)
      },
      getLastActivity (date) {
        if (date) return 'Был(а) в сети ' + this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
        return 'Был(а) в сети - '
      },
      getDate (date) {
        if (date) return this.$moment.utc(date).local().format(this.$config.date.DATE_FORMAT)
        return '-'
      },
      getTime (date) {
        if (date) return 'в ' + this.$moment.utc(date).local().format('HH:mm')
        return 'в -'
      },
      async fetchData () {
        try {
          this.loadingList = true
          const payload = {
            program_id: this.program.id,
            filter: this.queryValue,
            list: {
              page: this.list.page,
              limit: this.list.itemsPerPage,
            },
          }
          await this.$store.dispatch('crm/client/list', payload)
        } finally {
          this.loadingList = false
        }
      },

    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

</style>
