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
          :options.sync="tableOptions"
          :single-expand="true"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          class="plus-table"
          hide-default-footer
          multi-sort
          :server-items-length="totalCount"
          @update:sort-by="fetchData()"
          @update:sort-desc="fetchData()"
        >
          <template v-slot:expanded-item="{ Headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.id }}
            </td>
          </template>

          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <v-icon
              color="neutral-500"
              style="width: 16px;"
              @click="expand(!isExpanded)"
            >
              fas fa-chevron-right
            </v-icon>
          </template>

          <template v-slot:item.created_at="{ item }">
            <div class="body-s-medium">
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
                v-if="item.account && item.account.user"
                class="cell-avatar"
                style="position: relative; top: -5px; cursor: pointer;"
                :src="item.account.user.avatar"
                @click.stop="userSidePanel(item.account)"
              >
              <div>
                <div
                  v-if="item && item.account && item.account.user"
                  class="body-s-medium"
                  style="cursor: pointer;"
                  @click.stop="userSidePanel(item.account)"
                >
                  {{ getFIO(item.account.user) }}
                </div>
                <div
                  v-else
                  class="body-s-medium"
                >
                  Анонимная продажа
                </div>
                <div
                  v-if="item && item.account && item.account.user"
                  class="cell-hint"
                >
                  {{ getLastActivity(item.account.user.last_activity) }}
                </div>
                <div
                  v-else
                  class="cell-hint"
                />
              </div>
            </div>
          </template>

          <template v-slot:item.contacts="{ item }">
            <div class="body-s-medium">
              {{ item.account && item.account.user.phone ? item.account.user.phone : '-' }}
            </div>
            <div
              class="cell-hint"
            >
              {{ item.account && item.account.user && item.account.user.email ? item.account.user.email : '' }}
            </div>
          </template>

          <template v-slot:item.operator="{ item }">
            <div style="display: flex; align-items: center">
              <img
                class="cell-avatar"
                :style="`background-color: ${program.bgcolor1};`"
                :src="item.user
                  ? item.user.avatar
                  : program.logo_short"
              >
              <div class="body-s-medium">
                {{ item && item.user ? (item.user.name ? item.user.name : '') + ' ' + (item.user.lastname ? item.user.lastname : '' ) : program.name }}
              </div>
            </div>
          </template>

          <template v-slot:item.value="{ item }">
            <div style="display: flex; align-items: center">
              <div class="body-s-medium">
                {{ formatNumberString(item.value / 100) }} &#8381
              </div>
            </div>
          </template>
          <template v-slot:item.bonuses="{ item }">
            <div style="display: flex; align-items: center">
              <div
                v-if="item.tran_group && item.tran_group.abst_view && item.tran_group.abst_view[0].value > 0"
                class="body-s-semibold cell-text-success"
              >
                {{ '+'+formatNumberString(bonusValue(item.tran_group.abst_view)) }}
              </div>
              <div
                v-else-if="item.tran_group && item.tran_group.abst_view && item.tran_group.abst_view[0].value < 0"
                class="body-s-semibold cell-text-error"
              >
                {{ formatNumberString(bonusValue(item.tran_group.abst_view)) }}
              </div>
              <div
                v-else
                class="body-s-semibold"
              >
                -
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
            Всего {{ totalCount }} {{ getWord(totalCount, wordOperations) }} на {{ pagesCount }} {{ getWord(pagesCount, wordPages) }}
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
  import DataTable from '@/mixins/dataTable'
  import User from '@/mixins/user.js'
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import FormatNumber from '@/mixins/formatNumber'
  import Routing from '@/mixins/routing'
  import SidePanelEditClient from '@/views/crm/client/components/SidePanelEditClient'

  export default {
    components: {
      SelectPageLimit,
      SidePanelEditClient,
    },
    mixins: [DataTable, FormatNumber, Routing, User],
    data () {
      return {
        loadingList: false,
        sidePanelStatus: {
          active: false,
          mode: 'edit',
          data: null,
        },
        tableOptions: {
          page: 1,
          itemsPerPage: 25,
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
            text: 'Дата',
            align: 'start',
            value: 'created_at',
          },
          {
            text: 'Клиент',
            value: 'client',
            sortable: false,
          },
          {
            text: 'Контакты',
            value: 'contacts',
            sortable: false,
          },
          {
            text: 'Оператор',
            value: 'operator',
            sortable: false,
          },
          {
            text: 'Чек',
            value: 'value',
          },
          {
            text: 'Бонусы',
            value: 'bonuses',
            sortable: false,
          },
          {
            text: '',
            value: 'data-table-expand',
          },
        ],
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['продажа', 'продажи', 'продаж'],
      }
    },
    computed: {
      tableData () {
        return this.$store.getters['selling/table/tableData']
      },
      totalCount () {
        return this.$store.getters['selling/table/totalCount']
      },
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
        console.log('COUNT')
        console.log(count)
        console.log('COUNT')
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
        return this.$store.getters['reference/date_selection/period']
      },
      filter () {
        return this.$store.getters['selling/filter/filter']
      },
    },
    watch: {
      program (v) {
        if (v) this.fetchData()
      },
      filter (v) {
        if (v) this.fetchData()
      },
      period (v) {
        if (v) this.fetchData()
      },
      'tableOptions.page' (v) {
        console.log(this.tableOptions)
        if (v) this.fetchData()
      },
      'tableOptions.itemsPerPage' (v) {
        console.log(this.tableOptions)
        if (v) this.fetchData()
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      bonusValue (data) {
        let sum = 0
        data.forEach(item => {
          sum += parseInt(item.value)
        })
        console.log('bonusValue')
        console.log(sum)
        console.log('bonusValue')
        return sum
      },
      userSidePanel (item) {
        const user = item.user
        user.id = item.id
        this.sidePanelStatus.mode = 'edit'
        this.sidePanelStatus.data = user
        this.sidePanelStatus.active = true
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
      async fetchData () {
        this.loadingList = true
        const list = {
          program_id: this.program.id,
          start_period: this.period.start,
          end_period: this.period.end,
          filter: this.filter,
          offset: this.getOffset(this.tableOptions.page, this.tableOptions.itemsPerPage),
          limit: this.tableOptions.itemsPerPage,
          sortable: this.getSortable(this.tableOptions.sortBy, this.tableOptions.sortDesc),
        }
        // console.log('table/list')
        // console.log(list)
        try {
          await this.$store.dispatch('selling/table/table', list)
        } finally {
          this.loadingList = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

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

.cell-avatar {
  margin-right: 8px;
  width: 25px;
  height: 25px;
  border-radius: 25px;
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
