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
    watch: {
      'program.website' (v) {
        const regex = /^(http:\/\/|https:\/\/|)((www.|)[\w]+.[\w]+)(\/|)/gm
        const str = regex.exec(v)
        if (str && str[2] != null) {
          this.program.website = str[2]
        }
      },
      'program.social.vk' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(vk.com)/gm
        this.program.social.vk = v.replace(regex, '')
      },
      'program.social.fb' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|ru-ru.|www.ru-ru.|)(facebook.com|fb.com)/gm
        this.program.social.fb = v.replace(regex, '')
      },
      'program.social.youtube' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(youtube.com)/gm
        this.program.social.youtube = v.replace(regex, '')
      },
      'program.social.instagram' (v) {
        // //console.log('instagram', v)
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(instagram.com)/gm
        this.program.social.instagram = v.replace(regex, '')
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
