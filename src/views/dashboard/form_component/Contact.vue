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
          outlined
          :rules="[v => String(v).length < 255 || 'Телефон должен быть менее 255 символов']"
        />
        <base-text-field
          v-model="program.website"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="Адрес сайта"
          prepend-inner-icon="$iconify_feather-mouse-pointer"
          prepend-inner-icon-color="neutral-500"
          outlined
          :rules="[v => String(v).length < 255 || 'Адрес сайта должен быть менее 255 символов']"
        />
      </template>
    </BaseMasterFieldBlock>

    <BaseMasterFieldBlock
      title="Социальные сети"
      :horisontal="true"
    >
      <span
        slot="description"
      >Введите адреса ваших профилей и групп в социальных сетях. Вводите только название профиля, которое стоит в самом конце адресной строки после символа “/”.</span>
      <template v-slot:input>
        {{ program.social }}
        <base-text-field
          v-model="program.socials.vk"
          :validate-on-blur="true"
          placeholder="/Группа Вконтакте"
          prepend-inner-icon="$iconify_ion-logo-vk"
          prepend-inner-icon-color="logo-vk"
          outlined
          :rules="[maxLenRule, validURLRule]"
          @input="changeVK"
        />
        <base-text-field
          v-model="program.socials.youtube"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Канал на Youtube"
          prepend-inner-icon="$iconify_ant-design-youtube-filled"
          prepend-inner-icon-color="logo-youtube"
          outlined
          :rules="[maxLenRule, validURLRule]"
          @input="changeYoutube"
        />
        <base-text-field
          v-model="program.socials.facebook"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Группа в Facebook"
          prepend-inner-icon="$iconify_la-facebook-f"
          prepend-inner-icon-color="logo-facebook"
          outlined
          :rules="[maxLenRule ,validURLRule]"
          @input="changeFB"
        />
        <base-text-field
          v-model="program.socials.instagram"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Профиль в Instagram"
          prepend-inner-icon="$iconify_ion-logo-instagram"
          prepend-inner-icon-color="logo-instagram"
          outlined
          :rules="[maxLenRule, validURLRule]"
          @input="changeInstagram"
        />
      </template>
    </BaseMasterFieldBlock>
  </div>
</template>

<script>
  import { validURL } from '@/utils/validate'

  import Vue from 'vue'

  export default {
    props: {
      program: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data () {
      return {}
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
      this.replaceAll()
    },
    methods: {
      replaceAll () {
        this.changeVK(this.program.socials.vk)
        this.changeYoutube(this.program.socials.youtube)
        this.changeFB(this.program.socials.fb)
        this.changeInstagram(this.program.socials.instagram)
      },
      changeVK (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(vk.com)/gm
        this.program.socials.vk = v.replace(regex, '')
      },
      changeYoutube (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(youtube.com)/gm
        this.program.social.youtube = v.replace(regex, '')
      },
      changeFB (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|ru-ru.|www.ru-ru.|)(facebook.com|fb.com)/gm
        this.program.social.fb = v.replace(regex, '')
      },
      changeInstagram (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(instagram.com)/gm
        this.program.social.instagram = v.replace(regex, '')
      },
      maxLenRule (v) {
        return String(v).length < 255 || 'Ссылка должна быть менее 255 символов'
      },
      validURLRule (v) {
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
