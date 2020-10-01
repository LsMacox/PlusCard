<template>
  <div>
    <top-menu
      :menu="menu"
      :value="0"
      cancel-button-text="Отменить"
      action-button-text="Сохранить"
      :loading="loading"
      @cancelbutton="toRoute('/dashboard')"
      @actionbutton="updateCompany()"
    />
    <v-row
      align="center"
      justify="center"
      no-gutters
    >
      <v-col :cols="6">
        <v-form
          ref="form"
          v-model="valid"
        >
          <info :program="program" />
        </v-form>

        <v-row
          style="margin: 68px 0;"
          justify="space-between"          
          align="baseline"
        >
          <v-btn
            v-if="!!program.id"
            color="error"
            text
            :loading="loading"
            @click="deleteCompany()"
          >
            <v-icon left>
              $iconify_feather-trash
            </v-icon>
            Удалить компанию
          </v-btn>

          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!program.name || !program.logo"
            @click="updateCompany()"
          >
            <v-icon style="margin-right: 10px;">
              $iconify_ion-checkmark-circle-outline
            </v-icon>
            Сохранить
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import Info from '@/views/dashboard/form_component/Info'
  import TopMenu from '@/components/base/TopMenu'
  import Routing from '@/mixins/routing'

  export default {
    components: {
      TopMenu,
      Info,
    },
    mixins: [Routing],
    data () {
      return {
        loading: false,
        valid: false,
        program: {
          name: null,
          logo: null,
          color: null,
          allow_issue: false,
        },
      }
    },
    computed: {
      menu () {
        return this.$store.getters['company/program/menu']
      },
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
    },
    created () {
      this.program = JSON.parse(JSON.stringify(this.programModel))
    },
    methods: {
      async deleteCompany () {
        try {
          this.loading = true
          await this.$confirm(
            `Вы уверены, что хотите удалить компанию ${this.program.name}?`,
            'Удаление компании',
            {
              confirmButtonText: 'Удалить',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          )
          await this.$store.dispatch('company/program/Delete', this.program.id)
          this.toRoute('/dashboard')
        } catch (error) {
          console.log('deleteCompany', error)
        } finally {
          this.loading = false
        }
      },
      async updateCompany () {
        try {
          this.loading = true
          const item = {
            id: this.program.id,
            name: this.program.name,
            logo: this.program.logo,
            color: this.program.bgcolor1,
            allow_issue: this.program.allow_issue,
          }
          // console.log(item)
          await this.$store.dispatch('company/program/updateInfo', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>
