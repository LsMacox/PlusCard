<template>
  <div class="pls--page-table">
    <base-table
      class-name="table-segment"
      :headers="tableHeaders"
      :data="templates"
      :word-operations="['шаблон', 'шаблона', 'шаблонов']"
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
          {{ item.created_at }}
        </p>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <p class="body-s-medium mb-0">
          <v-icon
            @click.stop="remove(item)"
          >
            $iconify_feather-trash
          </v-icon>
        </p>
      </template>
    </base-table>
  </div>
</template>

<script>
  import Routing from '@/mixins/routing'

  export default {
    mixins: [Routing],
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
