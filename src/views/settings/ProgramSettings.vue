<template>
  <v-container
    fluid
    class="program-settings"
  >
    <v-row
      no-gutters
      style="margin-bottom:34px;"
    >
      <v-col><span class="title-m-bold neutral-900--text">Настройки</span></v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in settings"
        :key="index"
        cols="6"
      >
        <setting-block
          :icon="item.icon"
          :title="item.title"
          :description="item.description"
          :to="item.to"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    components: {
      SettingBlock: () => import('./components/SettingBlock'),
    },
    constants: {

    },
    data () {
      return {

      }
    },
    computed: {
      program () {
        return this.$store.getters.program
      },
      settings () {
        return [
          {
            icon: require('@/assets/settings/Rocket-On.png'),
            title: 'Компания',
            description: 'Управление названием компании, бонусной картой, точками продаж и контактными данными.',
            to: this.program ? `/company/${this.program.id}/info` : null,
          },
          {
            icon: require('@/assets/settings/Card-On.png'),
            title: 'Реквизиты',
            description: 'Управление реквизитами компании, просмотр соглашений и отчетов по платежам.',
            to: '/settings/requisites',
          },
          {
            icon: require('@/assets/settings/Bag-On.png'),
            title: 'Сертификаты',
            description: 'Редактирование выпущенных сертификатов и создание новых.',
            to: '/program/certificate/list',
          },
          {
            icon: require('@/assets/settings/Lego-On.png'),
            title: 'Программа лояльности',
            description: 'Подключение новых бонусных механик, редактировние существующих.',
            to: '/program/bonus/settings',
          },
          {
            icon: require('@/assets/settings/Megaphone-On.png'),
            title: 'Акции',
            description: 'Управление текущими акциями компании, удаление неактивных, создание новых.',
            to: '/todo',
          },
          {
            icon: require('@/assets/settings/Mail-On.png'),
            title: 'Рассылки',
            description: 'Управление текущими рассылками компаниии и создание новых.',
            to: '/sendings',
          },
          {
            icon: require('@/assets/settings/Chat-On.png'),
            title: 'Чаты',
            description: 'Настройка приветственных сообщений, аватара и имени представителя в чате компании.',
            to: '/communications/chat',
          },
          {
            icon: require('@/assets/settings/Stuff-On.png'),
            title: 'Сотрудники',
            description: 'Настройка и редактирование прав доступа сотрудников комапнии, добавление новых.',
            to: '/settings/staff',
          },
          {
            icon: require('@/assets/settings/Embed-On.png'),
            title: 'Интеграции',
            description: 'Подключение и настройка интеграций с различными сервисами.',
            to: '/settings/integration',
          },
          {
            icon: require('@/assets/settings/Moderations-On.png'),
            title: 'История модераций',
            description: 'История всех изменений настроек вашей компании.',
            to: '/moderations',
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
.program-settings {
    padding: 6px 0px 0px 0px;
}
</style>
