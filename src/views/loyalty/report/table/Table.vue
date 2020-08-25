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
            <div class="td-padding-wrapper">
              <div class="td-content-main">
                {{ item.title }}
              </div>
              <div
                class="hint cell-hint"
              >
                ID {{ item.bsid }}
              </div>
            </div>
          </template>

          <template v-slot:item.date="{ item }">
            <div class="td-padding-wrapper">
              <div class="td-content-main">
                {{ getDate(item.created_at) }}
              </div>
              <div
                class="hint cell-hint"
              >
                в {{ getTime(item.created_at) }}
              </div>
            </div>
          </template>

          <template v-slot:item.client="{ item }">
            <div class="avatar">
              <img :src="`https://storage.yandexcloud.net/plusstorage/${item.client_avatar}`">
            </div>
            <div class="td-content-wrapper">
              <div class="td-content-main">
                {{ item.client }}
              </div>
              <div
                class="hint cell-hint"
              >
                Был(а) в сети 02.08.2020 в 04:32 {{ item.last_activity }}
              </div>
            </div>
          </template>

          <template v-slot:item.unit="{ item }">
            {{ item.unit }}
          </template>

          <template v-slot:item.amount="{ item }">
            {{ item.value }}
          </template>

          <template v-slot:item.operator="{ item }">
            <div class="avatar">
              <img src="https://storage.yandexcloud.net/plusstorage/users/avatars/1db311620af449cf9aa354491e5310d4.jpg">
            </div>
            <div class="td-content-wrapper">
              <div class="td-content-main">
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
        <span>Всего {{ total }}</span>
      </v-col>

      <v-col cols="8">
        <div class="text-center">
          <v-pagination
            v-model="page"
            next-icon="fas fa-chevron-right"
            prev-icon="fas fa-chevron-left"
            :length="20"
            :total-visible="7"
            circle
          />
        </div>
      </v-col>

      <v-col class="pagination-per-page">
        <v-select
          v-model="perPage"
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
        page: 0,
        total: 150,
        perPage: 10,
        paginationOptions: [
          { text: '5 на странице', value: 5 },
          { text: '10 на странице', value: 10 },
          { text: '15 на странице', value: 15 },
          { text: 'Показать все', value: 0 },
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
      }
    },
    computed: {
      tableData () {
        return this.$store.getters['widget/table/widgetData']
      },
    },
    methods: {
      getDate (date) {
        // eslint-disable-next-line no-undef
        return moment(date).format('L')
      },
      getTime (date) {
        // eslint-disable-next-line no-undef
        const d = new Date(date).toISOString().split('T')[1]
        return d.split(':')[0] + ':' + d.split(':')[1]
      },
      paymentStatusIcon (status) {
        switch (status) {
          case 'waiting': return require('@/icons/svg/' + status + '.svg'); break
          case 'cashier': return require('@/icons/svg/cashier.svg'); break
          case 'card': return '@/icons/svg/card.svg'; break
          default: return '@/icons/svg/another.svg'
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
.cell-hint
  font-style: normal
  font-weight: 600
  font-size: 11px
  line-height: 14px
  color: #9191A1
</style>
