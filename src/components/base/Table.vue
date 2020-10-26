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
          :item-class="itemClass"
          class="plus-table"
          :show-expand="Boolean(expanded.length)"
          :expanded.sync="expanded"
          :sort-by="pagination.sortBy"
          :sort-desc="pagination.descending === 'descending' ? true : false"
          hide-default-footer
          :hide-default-header="isCustomHeader"
          v-on="inputListeners"
        >
          <template v-if="isCustomHeader" v-slot:[`header`]="{ props }">
            <thead class="v-data-table-header">
              <tr>
                <th
                  v-for="(header) in props.headers"
                  :key="header.text"
                  role="columnheader"
                  scope="col"
                  :class="[
                    {
                      active: isValEqualSort = (header.value === pagination.sortBy),
                    },
                    isValEqualSort ? (pagination.descending === 'descending' ? 'desc' : 'ask') : ''
                  ]"
                  :style="header.width? {
                    width: header.width,
                    'min-width': header.width,
                  }: {}"
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
            v-for="hItem in headersSlots"
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
    name: 'Table',
    components: {
      SelectPageLimit,
    },
    mixins: [Convertor],
    inheritAttrs: false,
    props: {
      isCustomHeader:{
        type: Boolean,
        default: true,
      },
      className: {
        type: String,
        default: '',
      },
      itemClass: {
        type: Function,
        default: undefined,
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
      pagination: {
        type: Object,
        default () {
          return {
            sortBy: 'name',
            descending: '',
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
        tableOptions: this.options,
      }
    },
    computed: {
      headersSlots () {
        return this.headers.filter(x => this.$slots[`item.${x.value}`] || this.$scopedSlots[`item.${x.value}`])
      },
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
        var _this = this
        // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
        return Object.assign({},
                             // Мы добавляем все слушатели из родителя
                             this.$listeners,
                             // Затем мы можем добавить собственные слушатели или
                             // перезаписать поведение некоторых существующих.
                             {
                               // Это обеспечит, что будет работать v-model на компоненте
                               input: function (event) {
                                 _this.$emit('input', event.target.value)
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
