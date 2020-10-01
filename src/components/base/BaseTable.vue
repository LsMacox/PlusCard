<template>
  <div style="width: 100%">
    <v-row>
      <v-col
        cols="12"
      >
        <v-data-table
          v-bind="$attrs"
          :headers="headers"
          :items="data"
          :options="tableOptions"
          item-key="uuid"
          :class="className"
          class="plus-table"
          :show-expand="Boolean(expanded.length)"
          :expanded.sync="expanded"
          :sort-by="pagination.sortBy"
          :sort-desc="pagination.descending === 'descending' ? true : false"
          hide-default-footer
          hide-default-header
          v-on="inputListeners"
        >
          <template v-slot:[`header`]="{ props }">
            <thead class="v-data-table-header">
              <tr>
                <th
                  v-for="(header, i) in props.headers"
                  :key="header.text"
                  role="columnheader"
                  scope="col"
                  :class="['sortable', header.value === pagination.sortBy ? pagination.descending === 'ascending' ? 'ask' : 'desc' : '', header.value === pagination.sortBy ? 'active' : '', i >= 2 ? 'text-end' : '']"
                  :aria-sort="header.value === pagination.sortBy ? pagination.descending : 'none'"
                  @click="changeSort(header.value)"
                >
                  <span class="body-s-medium neutral-600--text">{{ header.text }}</span>
                  <iconify-icon
                    v-if="Boolean(header.text.length)"
                    class="icon"
                    icon="ls-sort"
                    width="11"
                    height="11"
                  />
                </th>
              </tr>
            </thead>
          </template>

          <template v-slot:expanded-item="{ item }">
            <td>
              More info about {{ item.bsid }}
            </td>
          </template>

          <template
            v-slot:[`item.data-table-expand`]="{ expand, isExpanded }"
          >
            <slot
              :expand="expand"
              :isExpand="isExpanded"
              name="item.data-table-expand"
            />
          </template>

          <template
            v-for="hItem in headers"
            v-slot:[`item.${hItem.value}`]="{ item }"
          >
            <slot
              :item="item"
              :name="`item.${hItem.value}`"
            />
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
            Всего {{ totalCount | spacesBetweenNumbers }} {{ declOfNum(totalCount, wordOperations) }} на {{ pagesCount }} {{ declOfNum(pagesCount, wordPages) }}
          </div>

          <select-page-limit
            min-width="200px"
            :items="paginationOptions"
            :model.sync="options.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

          <div class="text-center">
            <v-pagination
              v-model="options.page"
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
</template>

<script>
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import Convertor from '@/mixins/convertor.js'

  export default {
    components: {
      SelectPageLimit,
    },
    mixins: [Convertor],
    inheritAttrs: false,
    props: {
      className: {
        type: String,
        default: '',
      },
      headers: {
        type: Array,
        default () {
          return [
            {
              text: 'Операция',
              align: 'start',
              value: 'operation',
            },
          ]
        },
      },
      expanded: {
        type: Array,
        default () {
          return []
        },
      },
      data: {
        type: Array,
        default () {
          return []
        },
      },
      totalCount: {
        type: Number,
        default: 0,
      },
      options: {
        type: Object,
        default: () => {
          return {
            page: 1,
            itemsPerPage: 25,
          }
        },
      },
      paginationOptions: {
        type: Array,
        default () {
          return [
            { text: '25 на странице', value: 25 },
            { text: '50 на странице', value: 50 },
            { text: '100 на странице', value: 100 },
            { text: '150 на странице', value: 150 },
            { text: '250 на странице', value: 250 },
            { text: '500 на странице', value: 500 },
          ]
        },
      },
      wordPages: {
        type: Array,
        default () {
          return ['странице', 'страницах', 'страницах']
        },
      },
      wordOperations: {
        type: Array,
        default () {
          return ['операция', 'операции', 'операций']
        },
      },
    },
    data () {
      return {
        pagination: {
          sortBy: 'name',
          descending: '',
        },
        tableOptions: this.options,
      }
    },
    computed: {
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
        if (count) {
          if (this.options.page > count) {
            this.changeTableOption('page', count)
          }
          return count
        }
        this.changeTableOption('page', 1)
        return 1
      },
      inputListeners () {
        var vm = this
        // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
        return Object.assign({},
                             // Мы добавляем все слушатели из родителя
                             this.$listeners,
                             // Затем мы можем добавить собственные слушатели или
                             // перезаписать поведение некоторых существующих.
                             {
                               // Это обеспечит, что будет работать v-model на компоненте
                               input: function (event) {
                                 vm.$emit('input', event.target.value)
                               },
                             },
        )
      },
    },
    created () {
    },
    methods: {
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          if (this.pagination.descending === 'ascending') {
            this.pagination.descending = 'descending'
          } else {
            this.pagination.descending = 'ascending'
          }
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = 'none'
        }
      },
      changeTableOption (option, val) {
        this.tableOptions[option] = val
      },
    },
  }
</script>

<style lang="scss" scoped>

.table-pagination-block {
  margin-left: 22px;
  margin-top: -30px;
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
