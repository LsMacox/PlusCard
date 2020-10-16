<template>
  <base-text-field
    v-model="urlInternal"    
    :validate-on-blur="false"
    :placeholder="socialsEnum[type].placeholder"
    :prepend-inner-icon="socialsEnum[type].icon"
    :prepend-inner-icon-color="socialsEnum[type].iconColor"
    :maxlength="MAX_URL_LEN"
    outlined
    :rules="[maxLenRule ,validURLRule]"
 
    @input="changeURL"
  />
</template>

<script>
  import { asMixin, validURL } from '@/utils/validate'

  // import Vue from 'vue'

  export default {
    mixins: [asMixin({ validURL })],
    model: {
      prop: 'url',
      event: 'change',
    },
    props: {
      url: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'vk',
      },
    },
    data () {
      return {
        urlInternal: this.url,
      }
    },
    computed: {

    },

    watch: {
      urlInternal (v) {
        this.$emit('change', v)
      },
      url (v) {
        this.urlInternal = v
      },
    },

    constants: {
      MAX_URL_LEN: 255,
      socialsEnum: {
        vk: {
          icon: '$iconify_ion-logo-vk',
          iconColor: 'logo-vk',
          placeholder: '/Группа Вконтакте',
          regex: /^(http:\/\/|https:\/\/|)(www.|)(vk.com)/gm,
        },
        youtube: {
          icon: '$iconify_ant-design-youtube-filled',
          iconColor: 'logo-youtube',
          placeholder: '/Канал на Youtube',
          regex: /^(http:\/\/|https:\/\/|)(www.|)(youtube.com)/gm,
        },
        facebook: {
          icon: '$iconify_la-facebook-f',
          iconColor: 'logo-facebook',
          placeholder: '/Группа в Facebook',
          regex: /^(http:\/\/|https:\/\/|)(www.|ru-ru.|www.ru-ru.|)(facebook.com|fb.com)/gm,
        },
        instagram: {
          icon: '$iconify_ion-logo-instagram',
          iconColor: 'logo-instagram',
          placeholder: '/Профиль в Instagram',
          regex: /^(http:\/\/|https:\/\/|)(www.|)(instagram.com)/gm,
        },
      },
    },

    created () {
      this.changeURL(this.urlInternal)
    },

    methods: {
      changeURL (v) {
        this.urlInternal = String(v || '').replace(this.socialsEnum[this.type].regex, '')
      },
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
