<template>
  <div>
    <top-menu
      :menu="menu"
      :value="2"
      cancel-button-text="Отменить"
      action-button-text="Сохранить"
      :loading="loading"
      @cancelbutton="toRoute('/dashboard')"
      @actionbutton="updateContact()"
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
          <contact :program="program" />
        </v-form>
        <div style="margin: 68px 0;">
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="updateContact()"
          >
            <v-icon style="margin-right: 10px;">
              $iconify_ion-checkmark-circle-outline
            </v-icon>
            Сохранить
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import Contact from '@/views/dashboard/form_component/Contact'
  import TopMenu from '@/components/base/TopMenu'
  import Routing from '@/mixins/routing'

  export default {
    components: {
      TopMenu,
      Contact,
    },
    mixins: [Routing],
    data () {
      return {
        loading: false,
        valid: true,
        program: {
          id: null,
          phone: null,
          website: null,
          socials: {
            vk: null,
            youtube: null,
            facebook: null,
            instagram: null,
          },
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
    watch: {

    },
    created () {
      console.log('this.programModel', this.programModel)
      const program = JSON.parse(JSON.stringify(this.programModel))
      if (typeof this.programModel.socials === 'string') {

        program.socials = JSON.parse(this.programModel.socials)
        console.log('program.socials', program.socials)
      }
      //
      this.program = program
    },
    methods: {
      async updateContact () {
        try {
          this.loading = true
          const item = {
            id: this.program.id,
            phone: this.program.phone,
            website: this.program.website,
            socials: this.program.socials,
          }
          console.log(item)
          await this.$store.dispatch('company/program/updateContact', item)
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
