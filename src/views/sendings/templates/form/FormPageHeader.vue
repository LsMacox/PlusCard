<template>
  <div class="pls--page-header">
    <v-btn
      color="secondary"
      :text="true"
      :ripple="false"
      @click="$router.back()"
    >
      <v-icon left>
        $iconify_arrow-back
      </v-icon>Назад
    </v-btn>
    <v-spacer />
    <v-btn
      color="secondary"
      :text="true"
      :ripple="false"
      :loading="loading"
      @click="update()"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Сохранить
    </v-btn>
  </div>
</template>

<script>
  import RoutingMixin from '@/mixins/routing'

  export default {
    mixins: [RoutingMixin],
    props: {
      form: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        loading: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      template () {
        return this.$store.getters['company/notification/template']
      },
    },
    methods: {
      async update () {
        try {
          this.loading = true
          const item = {
            id: this.form.id,
            name: this.form.name,
            title: this.form.title,
            description: this.form.description,
            // body: this.form.description,
            attachments: this.form.attachments,
          }
          console.log(item)
          await this.$store.dispatch('company/notifications/update', item)
          this.toRoute('/sendings/templates')
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
