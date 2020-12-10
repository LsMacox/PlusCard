<template>
  <div class="pls--page-table">
    {{ tableSettings }}
    <base-table
      class-name="table-segment"
      :headers="tableHeaders"
      :data="templates"
      :word-operations="['шаблон', 'шаблона', 'шаблонов']"
      :pagination="tableSettings.pagination"
      @click:row="updateTemplate"
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
        <p class="body-s-medium mb-0">
          <v-tooltip
            open-delay="1000"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click.stop="remove(item)"
              >
                $iconify_feather-trash
              </v-icon>
            </template>
            <span>Удалить шаблон</span>
          </v-tooltip>
        </p>
      </template>
    </base-table>
  </div>
</template>

<script>
  import DataTableMixin from '@/mixins/dataTable'
  import DateTimeFormatMixin from '@/mixins/dateTimeFormat'
  import RoutingMixin from '@/mixins/routing'

  export default {
    mixins: [DataTableMixin, DateTimeFormatMixin, RoutingMixin],
    data () {
      return {
        loading: false,
        tableHeaders: [
          { text: 'ID', align: 'start', value: 'id' },
          { text: 'Название шаблона', align: 'start', value: 'name' },
          { text: 'Заголовок', align: 'start', value: 'title' },
          { text: 'Дата создания', align: 'start', value: 'created_at' },
          { text: 'Действия', align: 'end', value: 'actions' },
        ],
        tableKey: 'SettingTemplate',
        tableSettings: {
          pagination: {
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
      templates () {
        return this.$store.getters['company/notifications/templates']
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
      console.log(this.tableSettings)
    },
    methods: {
      updateTemplate (item) {
        this.toRoute(`/sendings/templates/${item.id}`)
      },
      async remove (item) {
        try {
          this.loading = true
          console.log(item)
          await this.$store.dispatch('company/notifications/delete', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
