<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        style="width: 1024px"
      >
        <v-data-table
          :headers="headers"
          :items="tableData"
          :options="tableOptions"
          :single-expand="true"
          :expanded.sync="expanded"
          item-key="uuid"
          :show-expand="false"
          class="plus-table"
          hide-default-footer
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.bsid }}
            </td>
          </template>

          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <v-icon
              color="neutral-500"
              style="width: 16px;"
              @click="expand(!isExpanded)"
            >
              $iconify_ion-chatbox-outline
            </v-icon>
          </template>

          <template v-slot:item.operation="{ item }">
            <div class="cell-text">
              {{ item.title }}
            </div>
            <div
              class="cell-hint"
            >
              ID {{ item.bsid }}
            </div>
          </template>

          <template v-slot:item.date="{ item }">
            <div class="cell-text">
              {{ getDate(item.created_at) }}
            </div>
            <div
              class="cell-hint"
            >
              {{ getTime(item.created_at) }}
            </div>
          </template>

          <template v-slot:item.client="{ item }">
            <div style="display: flex;">
              <img
                class="table-cell_avatar"
                style="position: relative; top: -5px;"
                :src="`https://storage.yandexcloud.net/plusstorage/${item.client_avatar}`"
                @click.stop="userSidePanel(item)"
              >
              <div>
                <div
                  class="cell-text-bold"
                  style="cursor: pointer;"
                  @click.stop="userSidePanel(item)"
                >
                  {{ getFIO({id: item.client_id, name: item.client}) }}
                </div>
                <div
                  class="cell-hint"
                >
                  {{ getLastActivity(item.last_activity) }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.unit="{ item }">
            <div class="cell-text">
              {{ item.unit }}
            </div>
          </template>

          <template v-slot:item.amount="{ item }">
            <div
              class="cell-text-bold"
              style="text-align: right;"
              v-html="getValue(item.value)"
            />
          </template>

          <template v-slot:item.operator="{ item }">
            <div style="display: flex; align-items: center">
              <img
                class="table-cell_avatar"
                :style="`background-color: ${program.bgcolor1};`"
                :src="(item.operator_avatar === 'system' || item.operator_avatar === 'external')
                  ? program.logo_short
                  : `https://storage.yandexcloud.net/plusstorage/${item.operator_avatar}`"
              >
              <div class="cell-text">
                {{ item.operator }}
              </div>
            </div>
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
            :model.sync="tableOptions.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

          <div class="text-center">
            <v-pagination
              v-model="tableOptions.page"
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
  import FormatNumber from '@/mixins/formatNumber'
  import Routing from '@/mixins/routing'
  import User from '@/mixins/user'
  import SidePanelEditClient from '@/views/crm/client/components/SidePanelEditClient.vue'
  import ApiService from '@/api/api-client'

  export default {
    components: {
      SelectPageLimit,
      SidePanelEditClient,
    },
    mixins: [FormatNumber, Routing, User],
    data () {
      return {
        loadingList: false,
        tableOptions: {
          page: 1,
          itemsPerPage: 25,
        },
        sidePanelStatus: {
          active: false,
          mode: 'edit',
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
        expanded: [],
        headers: [
          {
            text: 'Операция',
            align: 'start',
            value: 'operation',
          },
          {
            text: 'Дата',
            value: 'date',
          },
          {
            text: 'Клиент',
            value: 'client',
          },
          {
            text: 'Валюта',
            value: 'unit',
          },
          {
            text: 'Сумма',
            value: 'amount',
          },
          {
            text: 'Оператор',
            value: 'operator',
          },
        // { text: '', value: 'data-table-expand' },
        ],
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['операция', 'операции', 'операций'],
      }
    },
    computed: {
      tableData () {
        return this.$store.getters['widget/table/widgetData']
      },
      totalCount () {
        return this.$store.getters['widget/table/count']
      },
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
        if (count) {
          if (this.tableOptions.page > count) {
            this.tableOptions.page = count
          }
          return count
        }
        this.tableOptions.page = 1
        return 1
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
      filter () {
        return this.$store.getters['widget/filter/filter']
      },
    },
    watch: {
      'program.id' (v) {
        if (v) {
          console.log('watch program.id')
          this.fetchData()
        }
      },
      filter (v) {
        if (v) this.fetchData()
      },
      period (v) {
        if (v) this.fetchData()
      },
      'tableOptions.page' (v) {
        if (v) this.fetchData()
      },
      'tableOptions.itemsPerPage' (v) {
        if (v) this.fetchData()
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      async userSidePanel (item) {
        console.log('user.....')
        console.log(item)
        console.log('user.....')

        if (item.client_id) {
          const result = await ApiService.get('/api-cabinet/widget/client', {
            params: {
              client_id: item.client_id,
              program_id: this.program.id,
            },
          })
          console.log(result)

          if (result.client && result.client.accounts) {
            item = result.client
            item.id = result.client.accounts[0].id
            this.sidePanelStatus.mode = 'edit'
            this.sidePanelStatus.data = item
            this.sidePanelStatus.active = true
          }
        }
      },
      getDate (date) {
        if (date) return this.$moment.utc(date).local().format(this.$config.date.DATE_FORMAT)
        return '-'
      },
      getTime (date) {
        if (date) {
          const d = this.$moment.utc(date).local().format('HH:mm')
          return 'в ' + d
        }
        return '-'
      },
      getLastActivity (date) {
        if (date) return 'Был(а) в сети ' + this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
        return 'Был(а) в сети - '
      },
      getValue (value) {
        value = Number(value)
        if (value >= 0) return `<span style="color: #00D15D;">+${this.formatNumberString(value)}</span>`
        return `<span style="color: #EA4C2A;">${this.formatNumberString(value)}</span>`
      },
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      fetchData () {
        this.loadingList = true
        const list = {
          program_id: this.program.id,
          start_period: this.period.start,
          end_period: this.period.end,
          filter: this.filter,
          offset: (this.tableOptions.page * this.tableOptions.itemsPerPage) - this.tableOptions.itemsPerPage,
          limit: this.tableOptions.itemsPerPage,
        }
        // console.log('table/list')
        // console.log(list)
        try {
          this.$store.dispatch('widget/table/widget', list)
        } finally {
          this.loadingList = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

.cell-text {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  color: #2A2A34;
}

.cell-text-bold {
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 17px;
  color: #2A2A34;
}

.cell-hint {
  margin-top: 4px;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  color: #9191A1;
}

.table-cell_avatar {
  margin-right: 8px;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  cursor: pointer;
}

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
