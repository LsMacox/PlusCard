<template>
  <div>
    <page-header />
    <div class="pls--page-block-center">
      <v-text-field
        placeholder="Название шаблона"
        outlined
      >
        <template slot="prepend-inner">
          <span
            class="iconify"
            data-icon="ion:mail-outline"
            data-inline="false"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader'
  export default {
    components: {
      PageHeader,
    },
    data () {
      return {
        template: {},
        types: [
          { id: 'simple', value: 'Простое' },
          { id: 'complex', value: 'Комплексное' },
        ],
      }
    },
    computed: {
      defaultTemplate () {
        return {
          name: null,
          type: 'simple',
          title: null,
          description: null,
          attachments: [],
        }
      },
    },
    created () {
      if (this.$route.params.id === 'new') {
        this.template = Object.copy(this.defaultTemplate)
      }
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/page/_page.scss";
</style>
