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
        />
        <base-text-field
          v-model="program.website"
          :validate-on-blur="true"
          placeholder="Адрес сайта"
          prepend-inner-icon="$iconify_feather-mouse-pointer"
          prepend-inner-icon-color="neutral-500"
          outlined
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
        <base-text-field
          v-model="program.socials.vk"
          :validate-on-blur="true"
          placeholder="/Группа Вконтакте"
          prepend-inner-icon="$iconify_ion-logo-vk"
          prepend-inner-icon-color="logo-vk"
          outlined
        />
        <base-text-field
          v-model="program.socials.youtube"
          :validate-on-blur="true"
          placeholder="/Канал на Youtube"
          prepend-inner-icon="$iconify_ant-design-youtube-filled"
          prepend-inner-icon-color="logo-youtube"
          outlined
        />
        <base-text-field
          v-model="program.socials.facebook"
          :validate-on-blur="true"
          placeholder="/Группа в Facebook"
          prepend-inner-icon="$iconify_la-facebook-f"
          prepend-inner-icon-color="logo-facebook"
          outlined
        />
        <base-text-field
          v-model="program.socials.instagram"
          :validate-on-blur="true"
          placeholder="/Профиль в Instagram"
          prepend-inner-icon="$iconify_ion-logo-instagram"
          prepend-inner-icon-color="logo-instagram"
          outlined
        />
      </template>
    </BaseMasterFieldBlock>
  </div>
</template>

<script>
  export default {
    props: {
      program: {
        type: Object,
        default: {},
      },
    },
    data () {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-component.scss';
</style>
