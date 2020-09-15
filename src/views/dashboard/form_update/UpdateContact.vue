<template>
  <v-row
    align="center"
    justify="center"
  >
    <div style="max-width: 676px;">
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
          @click="updateContact()"
        >
          <v-icon style="margin-right: 10px;">
            $iconify_ion-checkmark-circle-outline
          </v-icon>
          Сохранить
        </v-btn>
      </div>
    </div>
  </v-row>
</template>

<script>
  import Contact from '@/views/dashboard/form_component/Contact'

  export default {
    components: {
      Contact,
    },
    data () {
      return {
        loading: false,
        valid: false,
        program: {
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
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
    },
    created () {
      const program = JSON.parse(JSON.stringify(this.programModel))
      // если социальные сети не заполнены
      if (!program.socials) program.socials = this.program.socials
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
