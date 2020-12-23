<template>
  <div class="pls--page-table">
    <base-table
      class-name="table-segment"
      :headers="tableHeaders"
      :data="sendings"
      :word-operations="['рассылка', 'рассылки', 'рассылок']"
      :pagination="tableSettings.sort"
    >
      <template v-slot:[`item.id`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.id }}
        </p>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.name }}
        </p>
      </template>
      <template v-slot:[`item.title`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.title }}
        </p>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ getDateTimeMin(item.created_at) }}
        </p>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div style="display: flex; align-items: center;">
          <div class="body-s-medium mb-0">
            <v-tooltip
              open-delay="1000"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-switch
                    v-model="item.active"
                    :loading="item.changeActiveAction"
                    :disabled="item.changeActiveAction"
                    inset
                    hide-details
                    class="custom-switch"
                    @change="active(item, $event)"
                  />
                </div>
              </template>
              <span v-if="item.active">Остановить рассылку</span>
              <span v-else>Запустить рассылку</span>
            </v-tooltip>
          </div>

          <div class="body-s-medium mb-0 ml-1">
            <v-tooltip
              open-delay="1000"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  style="position: relative; top: 4px;"
                  v-on="on"
                  @click.stop="remove(item)"
                >
                  $iconify_feather-trash
                </v-icon>
              </template>
              <span>Удалить рассылку</span>
            </v-tooltip>
          </div>
        </div>
      </template>
    </base-table>
  </div>
</template>

<script>
  import DataTableMixin from '@/mixins/dataTable'
  import DateTimeFormatMixin from '@/mixins/dateTimeFormat'
  import RoutingMixin from '@/mixins/routing'
  import Vue from 'vue'

  export default {
    mixins: [DataTableMixin, DateTimeFormatMixin, RoutingMixin],
    data () {
      return {
        loading: false,
        dialogCreate: false,
        tableHeaders: [
          { text: 'ID', align: 'start', value: 'id' },
          { text: 'Название рассылки', align: 'start', value: 'name' },
          { text: 'Заголовок шаблона', align: 'start', value: 'title' },
          { text: 'Дата создания', align: 'start', value: 'created_at' },
          { text: 'Действия', align: 'end', value: 'actions' },
        ],
        tableKey: 'Sendings',
        tableSettings: {
          sort: {
            sortBy: 'id',
            descending: 'descending',
          },
        },
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      sendings () {
        return this.$store.getters['company/sendings/sendings'].map(x => {
          Vue.set(x, 'changeActiveAction', false)
          return x
        })
      },
    },
    watch: {
      tableSettings: {
        handler (v) {
          this.setDataTableSetting(this.tableKey, v)
        },
        deep: true,
      },
    },
    created () {
      this.tableSettings = this.getDataTableSetting(this.tableKey, this.tableSettings)
    },
    methods: {
      async active (item, active) {
        try {
          item.changeActiveAction = true
          const send = {
            id: item.id,
            active: active,
          }
          console.log(item)
          await this.$store.dispatch('company/sendings/active', send)
        } finally {
          item.changeActiveAction = false
        }
      },
      async remove (item) {
        try {
          this.loading = true
          console.log(item)
          await this.$store.dispatch('company/sendings/delete', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";

.activity-icon {
  width: 25px;
  height: 25px;
}
</style>
