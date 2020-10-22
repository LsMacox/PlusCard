<template>
  <div>
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
          :validate-on-blur="true"
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
          :validate-on-blur="true"
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
    <!-- socials -->

    <social-field-block v-model="program" />
  </div>
</template>

<script>
  import { asMixin, validURL } from '@/utils/validate'

  import Vue from 'vue'

  export default {
    components: {
      SocialFieldBlock: () => import('@/views/dashboard/form_component/SocialFieldBlock.vue'),
    },
    props: {
      program: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    mixins: [asMixin({ validURL })],
    data () {
      return {}
    },
    constants: {
      MAX_URL_LEN: 255,
    },
    computed: {

    },
    watch: {

    },
    created () {
      Vue.set(this.program, 'socials', Object.assign({
        vk: '',
        youtube: '',
        facebook: '',
        instagram: '',
      }, this.program.socials))

      console.log('program', this.program.social)
    },
    methods: {

      maxLenRule (v) {
        return String(v).length < this.MAX_URL_LEN || `Ссылка должна быть менее ${this.MAX_URL_LEN} символов`
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
@import 'form-component.scss';
</style>
