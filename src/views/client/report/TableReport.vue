
<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :single-expand="true"
    :expanded.sync="expanded"
    item-key="bsid"
    show-expand
    class="elevation-1"
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
  </v-data-table>
</template>

<script>
  const arraySort = require('array-sort')

  export default {
    name: 'TableReport',
    data () {
      return {
        headers: [
          {
            text: 'ID',
            align: 'start',
            sortable: false,
            value: 'bsid',
          },
          {
            text: 'Дата операции',
            value: 'created_at',
          },
          {
            text: 'Бонусная операция',
            value: 'titleValue',
          },
          {
            text: 'Валюта',
            value: 'unitValue',
          },
          {
            text: 'Клиент',
            value: 'clientInfo',
          },
          {
            text: 'Сумма',
            value: 'valueSum',
          },
          {
            text: 'Комментарий',
            value: 'comment',
          },
          {
            text: 'Оператор',
            value: 'operatorInfo',
          },
          { text: '', value: 'data-table-expand' },
        ],
        expanded: [],
        singleExpand: false,
        data: [
          {
            bsid: 100201,
            created_at: '2020-08-01',
            titleValue: 'Title111',
            unitValue: 'rub',
            clientInfo: 'John Doe',
            valueSum: 2000,
            comment: 'Comment #1',
            operatorInfo: 'Ivanov Ivan',
          },
          {
            bsid: 100202,
            created_at: '2020-08-01',
            titleValue: 'Title111',
            unitValue: 'rub',
            clientInfo: 'John Doe',
            valueSum: 2000,
            comment: 'Comment #1',
            operatorInfo: 'Ivanov Ivan',
          },
          {
            bsid: 100203,
            created_at: '2020-08-01',
            titleValue: 'Title111',
            unitValue: 'rub',
            clientInfo: 'John Doe',
            valueSum: 2000,
            comment: 'Comment #1',
            operatorInfo: 'Ivanov Ivan',
          },
          {
            bsid: 100204,
            created_at: '2020-08-01',
            titleValue: 'Title111',
            unitValue: 'rub',
            clientInfo: 'John Doe',
            valueSum: 2000,
            comment: 'Comment #1',
            operatorInfo: 'Ivanov Ivan',
          },
        ],
      }
    },
    computed: {
      optionsPerPage () {
        return [
          {
            value: 10,
            text: '10',
          },
          {
            value: 20,
            text: '20',
          },
          {
            value: 50,
            text: '50',
          },
          {
            value: 100,
            text: '100',
          },
          {
            value: this.transactions_sorted.length,
            text: 'Все',
          },
        ]
      },
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      programs () {
        return this.$store.getters['brand/program/programs']
      },
      merchant () {
        return this.$store.getters['auth/merchant/merchant']
      },
      transactions_data () {
        return this.$store.getters['report/table/widgetData']
      },
      transactions_sorted () {
        if (this.transactions_searched && this.transactions_searched.length > 0) {
          return arraySort(this.transactions_searched, this.sortOptions.prop, {
            reverse: this.sortOptions.order !== 'ascending',
          })
        } else {
          return []
        }
      },
      rows () {
        return this.transactions_sorted.length
      },
      transactions_table_data () {
        if (this.transactions_chunked.length >= this.listQuery.page) {
          return this.transactions_chunked[this.listQuery.page - 1]
        } else {
          return []
        }
      },
      transactions_chunked () {
        const chunkedList = []
        var i
        var j
        var temparray
        var chunk = this.listQuery.limit
        for (i = 0, j = this.transactions_sorted.length; i < j; i += chunk) {
          temparray = this.transactions_sorted.slice(i, i + chunk)
          chunkedList.push(temparray)
        }
        return chunkedList
      },
      transactionsSearcher () {
        return new FuzzySearch(
          this.transactions_filtered,
          ['client', 'comment', 'operator'],
          {
            caseSensitive: false,
          },
        )
      },
      transactions_searched () {
        // Поиск
        const search_text_trim = this.pSearch.trim().toLowerCase()
        // console.log('search_string in table', this.pSearch);

        if (search_text_trim && search_text_trim.length >= 3) {
          return this.transactions_filtered.filter(item => item.client.toLowerCase().includes(search_text_trim) || item.operator.toLowerCase().includes(search_text_trim))
        } else {
          return this.transactions_filtered
        }
      },
      transactions_filtered () {
        const res = this.transactions_data

        return res
      },
      filter () {
        return this.$store.getters['widget/filter']
      },
    },
    watch: {},
    methods: {
      splitNumber (val) {
        var int = String(Math.trunc(val))
        if (int.length <= 3) return int
        var space = 0
        var number = ''

        for (var i = int.length - 1; i >= 0; i--) {
          if (space === 3) {
            number = ' ' + number
            space = 0
          }
          number = int.charAt(i) + number
          space++
        }

        return number
      },
      changeFilter (field, value) {
        const currentFilter = Object.assign({}, this.filter)
        currentFilter[field].push(value)
        currentFilter.enable = true
        // console.log(currentFilter);
        this.$store.commit('widget/filter', this.localFilter)
        this.$store.commit('widget/filter', currentFilter)
      },
      ShowClientInfoDialog (row) {
        this.currentAccountId = row.account_id
        this.ClientInfoDialogData.userId = row.client_id
        this.ClientInfoDialogData.show = true
      },
      getColor (val) {
        if (parseInt(val) > 0) {
          return '#09CA5A'
        } else {
          return '#9A44AF'
        }
      },
      isActiveFilter (item) {
        return !this.isStorageFilter(item) && !this.isArchiveFilter(item)
      },
      isStorageFilter (item) {
        return item.user_id == null
      },
      isArchiveFilter (item) {
        return item.archived_at != null
      },
      isEmpty (obj) {
        if (obj) {
          if (typeof obj === 'object') {
            for (var prop in obj) {
              if (prop != 'enable' && !this.isEmpty(obj[prop])) {
                return false
              }
            }
          } else {
            return false
          }
        } else if (Array.isArray(obj) && obj.length) {
          return false
        }
        return true
      },
      sortChangeHandler (event) {
        if (event.order) {
          this.sortOptions.prop = event.prop
          this.sortOptions.order = event.order
        } else {
          this.sortOptions = Object.assign({}, this.defaultSortOption)
        }
      },
      handlePageChange () {
      },
      handleSizeChange (size) {
        localStorage.setItem(this.$route.path + ':table.itemsPerPage', size)
      // JSON.parse(localStorage.getItem("account/certificates/table/itemsPerPage"))
      },
    },
  }
</script>

<style scoped>

</style>
