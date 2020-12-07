<template>
  <div class="pls--page-header">
    <div class="pls--page-header-title title-m-bold">
      Шаблоны сообщений
    </div>
    <v-spacer />
    <v-btn
      class="pls--page-header-btn-right"
      color="primary"
      :loading="loading"
      @click="create()"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Создать шаблон
    </v-btn>
  </div>
</template>

<script>
  import RoutingMixin from '@/mixins/routing'

  export default {
    mixins: [RoutingMixin],
    data () {
      return {
        loading: false,
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
      async create () {
        try {
          this.loading = true
          const item = {
            program_id: this.program.id,
            name: `Новый шаблон сообщения ${this.templates.length + 1}`,
            title: `Новый шаблон сообщения ${this.templates.length + 1}`,
          }
          // console.log(item)
          const result = await this.$store.dispatch('company/notifications/create', item)
          this.toRoute(`/sendings/templates/${result.id}`)
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
