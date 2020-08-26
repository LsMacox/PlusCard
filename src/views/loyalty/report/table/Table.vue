<template>
  <v-container>
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
          item-key="bsid"
          show-expand
          class="plus-table"
          hide-default-footer
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.bsid }}
            </td>
          </template>

          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <span
              class="iconify"
              data-icon="bi:chevron-right"
              data-inline="false"
              @click="expand(!isExpanded)"
            />
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
                class="cell-avatar"
                style="position: relative; top: -5px;"
                :src="`https://storage.yandexcloud.net/plusstorage/${item.client_avatar}`"
              >
              <div>
                <div class="cell-text">
                  {{ item.client }}
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
              class="cell-text"
              v-html="getValue(item.value)"
            />
          </template>

          <template v-slot:item.operator="{ item }">
            <div style="display: flex; align-items: center">
              <img
                class="cell-avatar"
                src="https://storage.yandexcloud.net/plusstorage/users/avatars/1db311620af449cf9aa354491e5310d4.jpg"
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
      <v-col class="pagination-total">
        <span>Всего {{ totalCount }}1 239 операций на 124 страницах</span>
      </v-col>

      <v-col cols="8">
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
      </v-col>

      <v-col class="pagination-per-page">
        <v-select
          v-model="tableOptions.itemsPerPage"
          class="pagination-select"
          :items="paginationOptions"
          item-text="text"
          item-value="value"
          append-icon="fas fa-chevron-down"
          dense
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
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
          { text: '', value: 'data-table-expand' },
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
        if (count) return count
        return 1
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      startPeriod () {
        console.log('start', this.$store.getters['widget/filter/startPeriodFilter'])
        return this.$store.getters['widget/filter/startPeriodFilter']
      },
      endPeriod () {
        return this.$store.getters['widget/filter/endPeriodFilter']
      },
      filter () {
        return this.$store.getters['widget/filter/filter']
      },
    },
    watch: {
      program (v) {
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
      getDate (date) {
        return this.$moment(date).format('L')
      },
      getTime (date) {
        // eslint-disable-next-line no-undef
        const d = new Date(date).toISOString().split('T')[1]
        return 'в ' + d.split(':')[0] + ':' + d.split(':')[1]
      },
      getLastActivity (date) {
        return 'Был(а) в сети ' + this.getDate(date) + ' ' + this.getTime(date)
      },
      getValue (value) {
        value = Number(value)
        if (value >= 0) return `<span style="color: #00D15D;">+${value}</span>`
        return `<span style="color: #EA4C2A;">-${value}</span>`
      },
      fetchData () {
        this.loadingList = true
        const list = {
          program_id: this.program.id,
          start_period: this.startPeriod,
          end_period: this.endPeriod,
          filter: this.filter,
          offset: (this.tableOptions.page * this.tableOptions.itemsPerPage) - this.tableOptions.itemsPerPage,
          limit: this.tableOptions.itemsPerPage,
        }
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

<style lang="sass" scoped>
.cell-text
  font-style: normal
  font-weight: 600
  font-size: 13px
  line-height: 17px
  color: #2A2A34

.cell-hint
  margin-top: 4px
  font-style: normal
  font-weight: 600
  font-size: 11px
  line-height: 14px
  color: #9191A1

.cell-avatar
  margin-right: 8px
  width: 25px
  height: 25px
  border-radius: 25px
</style>
