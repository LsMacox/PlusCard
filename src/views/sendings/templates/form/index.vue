<template>
  <div>
    <form-page-header :form="form" />
    <div class="pls--page-block-center">
      <v-form
        :ref="formRef"
        v-model="valid"
      >
        <v-text-field
          v-model="form.name"
          placeholder="Название шаблона"
          outlined
        >
          <template slot="prepend-inner">
            <v-icon>$iconify_feather-edit</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="form.title"
          placeholder="Заголовок сообщения"
          outlined
        >
          <template slot="prepend-inner">
            <v-icon>$iconify_feather-edit</v-icon>
          </template>
        </v-text-field>
        <v-textarea
          v-model="form.description"
          placeholder="Описание сообщения"
          outlined
          rows="3"
        >
          <template slot="prepend-inner">
            <v-icon>$iconify_feather-edit</v-icon>
          </template>
        </v-textarea>
        <content-constructor
          :attachments="form.attachments"
          @update:attachments="updateAttachments"
        />
      </v-form>
    </div>
  </div>
</template>

<script>
  import FormPageHeader from './FormPageHeader'
  import ContentConstructor from './ContentConstructor/index'

  export default {
    components: {
      FormPageHeader,
      ContentConstructor,
    },
    data () {
      return {
        loading: false,
        valid: true,
        formRef: 'form',
        form: {},
      }
    },
    computed: {
      defaultForm () {
        return {
          id: null,
          name: null,
          title: null,
          description: null,
          attachments: [],
        }
      },
      template () {
        return this.$store.getters['company/notifications/template']
      },
    },
    async created () {
      await this.initForm()
    },
    methods: {
      updateAttachments (v) {
        this.form.attachments = Object.copy(v)
      },
      async initForm () {
        if (this.$route.params.id === 'new') {
          this.form = Object.copy(this.defaultForm)
        } else if (this.$route.params.id) {
          await this.fetchData()
          this.form = Object.copy(this.template)
        }
      },
      async fetchData () {
        try {
          this.loading = true
          const item = {
            id: this.$route.params.id,
          }
          await this.$store.dispatch('company/notifications/read', item)
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
