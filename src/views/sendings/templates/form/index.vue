<template>
  <div>
    <page-header />
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
          :attachments.sync="form.attachments"
        />
      </v-form>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader'
  import ContentConstructor from './ContentConstructor/index'

  export default {
    components: {
      PageHeader,
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
          name: null,
          title: null,
          description: null,
          attachments: [],
        }
      },
    },
    created () {
      if (this.$route.params.id === 'new') {
        this.form = Object.copy(this.defaultForm)
      }
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
