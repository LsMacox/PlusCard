<template lang="">
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="8">
        <v-form
          ref="form"
          v-model="valid"
        >
          <BaseMasterFieldBlock
            title="Контактная информация"
            :horisontal="true"
          >
            <span
              slot="description"
            >Введите единый номер телефона и адрес вашего сайта, чтобы ваши клиенты могли связаться с вами удобным способом.</span>
            <template v-slot:input>
              <base-text-field
                v-model="program.phone"
                :validate-on-blur="false"
                placeholder="Номер горячей линии"
                prepend-inner-icon="$iconify_feather-phone"
                prepend-inner-icon-color="neutral-500"
                maxlength="255"
                outlined
                :rules="[v => String(v).length <= 255 || 'Телефон должен быть не более 255 символов']"
              />
              <base-text-field
                v-model="program.website"
                style="margin-top: 20px !important;"
                :validate-on-blur="false"
                placeholder="Адрес сайта"
                prepend-inner-icon="$iconify_feather-mouse-pointer"
                prepend-inner-icon-color="neutral-500"
                maxlength="255"
                outlined
                :rules="[
                  v => (!v || validURL(v, {protocol: false})) || 'Не верная ссылка',
                  v => String(v).length <= 255 || 'Адрес сайта должен быть не более 255 символов'
                ]"
              />
            </template>
          </BaseMasterFieldBlock>

          <social-field-block v-model="program" />

          <v-row>
            <v-col>
              <v-btn
                :disabled="!valid"
                :loading="companyCreateAction"
                color="primary"
                class="master-next-btn"
                @click="createProgram"
              >
                <v-icon left>
                  $iconify_ion-checkmark-circle-outline
                </v-icon>
                Создать компанию
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { asMixin, validURL } from '@/utils/validate'
  import { mapGetters } from 'vuex'

  export default {

    mixins: [asMixin({ validURL })],
    components: {
      SocialFieldBlock: () => import('@/views/dashboard/form_component/SocialFieldBlock.vue'),
    },
    model: {
      prop: 'program',
      event: 'change',
    },
    props: {
      program: {
        type: Object,
        required: true,
      },
    },
    constants: {
      MAX_URL_LEN: 255,
    },
    data () {
      return {
        companyCreateAction: false,
        valid: false,
      }
    },
    computed: {
      ...mapGetters({
        merchant_id: 'merchantId',
      }),
    },
    created () {

    },
    methods: {
      async createProgram () {
        if (!this.$refs.form.validate()) return
        try {
          this.companyCreateAction = true
          const program = {
            name: this.program.name,
            slogan: this.program.slogan,
            logo: this.program.fileLogo && this.program.fileLogo.data ? this.program.fileLogo : this.program.logo,
            color: this.program.bgcolor1,

            shops: this.program.shops,

            phone: this.program.phone,
            website: this.program.website,
            socials: this.program.socials,
            allow_issue: this.program.allow_issue,
            // merchant_id: this.merchant_id,
          }
          console.log('CreateProgram', program)
          await this.$store.dispatch('company/program/CreateProgram', program)
          this.$emit('continue', true)
        } finally {
          this.companyCreateAction = false
        }
      },
      validURLRule (v) {
        if (!v) return true
        const url = `https://fake.ru${v}`
        console.log('validURLRule', url)
        return validURL(url) || 'Не верная ссылка'
      },
    },
  }
</script>
<style lang="scss" scoped>
@import 'master-style.scss';
@import '@/styles/variables.scss';

.socials-row{
  margin-top: -$container-padding-x;
}
</style>
