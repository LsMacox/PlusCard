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
      <v-row>
        <v-col
          cols="12"
          style="width: 1024px"
        >
          <v-data-table
            :headers="tableHeaders"
            :items="clients"
            :options.sync="tableSettings"
            :show-expand="false"
            class="plus-table"
            hide-default-footer
            :server-items-length="totalCount"
            @update:sort-by="fetchData()"
            @update:sort-desc="fetchData()"
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

            <template v-slot:[`item.user.FIO`]="{ item }">
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

            <template v-slot:[`item.user.phone`]="{ item }">
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
          </v-data-table>
        </v-col>
      </v-row>

      <v-row
        align="center"
        class="pagination"
      >
        <v-col>
          <div class="table-pagination-block">
            <div
              style="margin-right: 20px;"
            >
              Всего {{ totalCount }} {{ getWord(totalCount, wordOperations) }} на {{ pagesCount }}
              {{ getWord(pagesCount, wordPages) }}
            </div>

            <select-page-limit
              min-width="200px"
              :items="paginationOptions"
              :model.sync="tableSettings.itemsPerPage"
              item-value="value"
              item-label="text"
            />

            <div class="app__spacer" />

            <div class="text-center">
              <v-pagination
                v-model="tableSettings.page"
                next-icon="fas fa-chevron-right"
                prev-icon="fas fa-chevron-left"
                :length="pagesCount"
                :total-visible="7"
                circle
              />
            </div>
          </div>
        </v-col>
      </v-row>
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
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import ClientFilter from './Filter'
  import EmptyClient from './Empty'
  import SidePanelEditClient from './components/SidePanelEditClient'
  import Convertor from '@/mixins/convertor'
  import User from '@/mixins/user.js'
  import DataTableMixin from '@/mixins/dataTable'

  export default {
    components: {
      SelectPageLimit,
      ClientFilter,
      EmptyClient,
      SidePanelEditClient,
    },
    mixins: [DataTableMixin, Convertor, User],
    data () {
      return {
        loadingList: false,
        tableKey: 'CRMClientTable',
        sidePanelStatus: {
          mode: 'create',
          data: null,
        },
        tableHeaders: [
          { text: 'Карта клиента', align: 'start', value: 'id' },
          { text: 'Клиент', align: 'start', value: 'user.FIO', width: '20em', sortable: false },
          { text: 'Сегмент', align: 'start', value: 'segments', sortable: false },
          { text: 'Контакты', align: 'start', value: 'user.phone', sortable: false },
          { text: 'Создание', align: 'start', value: 'created_at' },
          { text: '', align: 'end', value: 'data-table-expand' },
        ],
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['клиент', 'клиента', 'клиентов'],
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
      totalCount () {
        const filteredClients = this.$store.getters['crm/client/filteredClients']
        if (filteredClients.length) return filteredClients.length
        return this.$store.getters['crm/client/total']
      },
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableSettings.itemsPerPage)
        if (count) {
          if (this.tableSettings.page > count) {
            this.tableSettings.page = count
          }
          return count
        }
        this.tableSettings.page = 1
        return 1
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
      'program.id' (v) {
        if (v) {
          this.fetchData()
        }
      },
      filter (v) {
        if (v) this.fetchData()
      },
      'tableSettings.page' (v) {
        if (v) this.fetchData()
      },
      'tableSettings.itemsPerPage' (v) {
        if (v) this.fetchData()
      },
      tableSettings: {
        handler (v) {
          this.setDataTableSetting(this.tableKey, v)
        },
        deep: true,
      },
    },
    async mounted () {
      // переопределяем настройки таблицы по-умолчанию
      this.tableSettings.multiSort = true
      this.tableSettings = this.getDataTableSetting(this.tableKey, this.tableSettings)
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
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      async fetchData () {
        try {
          this.loadingList = true
          const payload = {
            program_id: this.program.id,
            // filter: this.queryValue,
            filter: { segments: this.filter.segments },
            list: {
              page: this.tableSettings.page,
              limit: this.tableSettings.itemsPerPage,
            },
            sortable: this.getSortable(this.tableSettings.sortBy, this.tableSettings.sortDesc),
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

.table-pagination-block {
  display: flex;
  align-items: center;

  .table-pagination-block-select {
    position: relative;
    top: 6px;
    left: 20px;
    width: 250px;
  }
}

</style>
