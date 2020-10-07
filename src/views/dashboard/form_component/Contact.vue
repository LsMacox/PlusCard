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
        <base-text-field
          v-model="program.socials.vk"
          :validate-on-blur="true"
          placeholder="/Группа Вконтакте"
          prepend-inner-icon="$iconify_ion-logo-vk"
          prepend-inner-icon-color="logo-vk"
          outlined
          :rules="[v => String(v).length < 255 || 'Ссылка должна быть менее 255 символов']"
        />
        <base-text-field
          v-model="program.socials.youtube"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Канал на Youtube"
          prepend-inner-icon="$iconify_ant-design-youtube-filled"
          prepend-inner-icon-color="logo-youtube"
          outlined
          :rules="[v => String(v).length < 255 || 'Ссылка должна быть менее 255 символов']"
        />
        <base-text-field
          v-model="program.socials.facebook"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Группа в Facebook"
          prepend-inner-icon="$iconify_la-facebook-f"
          prepend-inner-icon-color="logo-facebook"
          outlined
          :rules="[v => String(v).length < 255 || 'Ссылка должна быть менее 255 символов']"
        />
        <base-text-field
          v-model="program.socials.instagram"
          style="margin-top: 20px !important;"
          :validate-on-blur="true"
          placeholder="/Профиль в Instagram"
          prepend-inner-icon="$iconify_ion-logo-instagram"
          prepend-inner-icon-color="logo-instagram"
          outlined
          :rules="[v => String(v).length < 255 || 'Ссылка должна быть менее 255 символов']"
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
        default: function () {
          return {}
        },
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
