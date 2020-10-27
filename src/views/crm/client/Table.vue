<template>
  <div>
    <empty-client
      v-if="!clientsStore.length"
    />
    <div
      v-else
    >
      <div style="margin: 20px 0 15px 0;">
        <client-filter />
      </div>
      <base-table
        v-if="clients.length"
        class-name="table-segment"
        :headers="tableHeaders"
        :data="clients"
        :options="list"
        :total-count="totalClients"
        :word-operations="['клиент', 'клиента', 'клиентов']"
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
                {{ (item.user && item.user.FIO) ? item.user.FIO : '-' }}
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
          <div v-if="item.segments && item.segments.length">
            <div
              v-for="(segment, i) in item.segments"
              :key="`segment${i}`"
              class="body-s-semibold mb-0"
              style="display: inline-block; padding: 4px 8px 4px 8px; border-radius: 4px;"
              :style="segment.color != undefined ? `color: ${segment.color}; background: ${hexToRgbA(segment.color, '0.15')}` : ''"
            >
              {{ segment.name }}
            </div>
          </div>
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
    {{ sidePanelStatus.active }}
    <side-panel-edit-client
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

  export default {
    components: {
      ClientFilter,
      EmptyClient,
      SidePanelEditClient,
    },
    mixins: [Convertor],
    data () {
      return {
        loadingList: false,
        sidePanelStatus: {
          mode: 'create',
          data: null,
        },
        tableHeaders: [
          { text: 'Карта клиента', align: 'start', value: 'id' },
          { text: 'Клиент', align: 'start', value: 'client' },
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
      await this.getSegments()
    },
    methods: {
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
            filter: { segments: this.filter.segments },
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
      async getSegments () {
        try {
          this.loadingList = true
          const payload = {
            program_id: this.program.id,
          }
          await this.$store.dispatch('crm/segment/segments', payload)
        } finally {
          this.loadingList = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

.table-cell_avatar {
  display: flex;
  max-width: 400px;

  .table-cell_avatar-img {
    display: block;
    margin-right: 8px;
    width: 25px;
    height: 25px;
    border-radius: 25px;
  }

  .table-cell_avatar-text {
    max-width: calc(400px - 33px);

    .table-cell_avatar-text2 {
      max-width: calc(400px - 33px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
