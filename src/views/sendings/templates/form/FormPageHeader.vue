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
          /*
          for (let i = 0; i < this.form.attachments.length; i++) {
            switch (this.form.attachments[i].type) {
              case 'IMAGE':
              case 'VIDEO':
              case 'FRIEND':
                // есть загружаемый файл
                if (this.form.attachments[i].value.file) {
                  this.form.attachments[i].value.url = null
                }
                console.log(this.form.attachments[i].value.file)
            }
          }
          const item = {
            program_id: this.program.id,
            id: this.form.id,
            name: this.form.name,
            title: this.form.title,
            description: this.form.description,
            // body: this.form.description,
            attachments: this.form.attachments,
          }
          */
          const formData = new FormData()
          formData.append('id', this.form.id)
          formData.append('program_id', this.program.id)
          formData.append('name', this.form.name)
          formData.append('title', this.form.title)
          formData.append('description', this.form.description)

          for (let i = 0; i < this.form.attachments.length; i++) {
            switch (this.form.attachments[i].type) {
              case 'TEXT':
                formData.append(`attachments[${i}][id]`, this.form.attachments[i].id)
                formData.append(`attachments[${i}][type]`, this.form.attachments[i].type)
                formData.append(`attachments[${i}][value][text]`, this.form.attachments[i].value.text)
                break

              case 'IMAGE':
              case 'VIDEO':
              case 'FRIEND':
                console.log('FormData')
                console.log(this.form.attachments[i].value.url)
                console.log(this.form.attachments[i].value.data)
                formData.append(`attachments[${i}][id]`, this.form.attachments[i].id)
                formData.append(`attachments[${i}][type]`, this.form.attachments[i].type)
                // есть загружаемый файл
                if (this.form.attachments[i].value.data) {
                  formData.append(`attachments[${i}][value][url]`, null)
                  formData.append(`attachments[${i}][value][data]`, this.form.attachments[i].value.data)
                } else {
                  formData.append(`attachments[${i}][value][url]`, this.form.attachments[i].value.url)
                }
                break
            }
          }
          // console.log(item)
          await this.$store.dispatch('company/notifications/update', formData)
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
