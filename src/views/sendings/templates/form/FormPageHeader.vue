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
      :disabled="form.attachments && !form.attachments.length"
      @click="createOrUpdate()"
    >
      <v-icon left>
        $iconify_plus-circle-outlined
      </v-icon>Сохранить
    </v-btn>
  </div>
</template>

<script>
  import Routing from '@/mixins/routing'

  export default {
    mixins: [Routing],
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
      async createOrUpdate () {
        try {
          this.loading = true
          const item = {
            program_id: this.program.id,
            id: this.form.id,
            name: this.form.name,
            title: this.form.title,
            description: this.form.description,
            // body: this.form.description,
            attachments: this.form.attachments,
          }
          console.log(item)
          if (this.form.id) {
            await this.$store.dispatch('company/notifications/update', item)
          } else {
            await this.$store.dispatch('company/notifications/create', item)
          }
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
