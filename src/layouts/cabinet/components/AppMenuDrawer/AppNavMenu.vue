<template>
  <v-list
    id="AppNavMenu"
    expand
  >
    <template v-for="(item, i) in menuItems">
      <main-menu-group-item
        v-if="item.children"
        :key="`group-${i}`"
        :item="item"
        :mini="mini"
      >
        <!--  -->
      </main-menu-group-item>

      <main-menu-item
        v-else
        :key="`item-${i}`"
        :item="item"
        :mini="mini"
      />
    </template>
  </v-list>
</template>

<script>
  import MainMenuItem from './MainMenuItem'
  import MainMenuGroupItem from './MainMenuGroupItem'

  export default {
    name: 'AppNavMenu',
    components: { MainMenuItem, MainMenuGroupItem },
    props: {
      mini: Boolean,
    },
    data: () => ({
      expandProgramList: false,
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings'],
      ],
      mobileDevice: false,
      exitRequest: false,
      menuItems: [
        {
          icon: '$iconify_ion-stats-chart',
          active_icon_color: 'secondary',
          title: 'Общая информация',
          to: '/dashboard',
        },
        {
          icon: '$iconify_ion-wallet-outline',
          title: 'Программа лояльности',
          to: '/loyalty',
        },
        {
          icon: '$iconify_ant-design-gift-outlined',
          title: 'Сертификаты',
          to: '/account/certificates',
          alias: ['/program/certificate/list', '/certificate/master'],
          // children: [
          //   {
          //     icon: '$iconify_ant-design-gift-outlined',
          //     title: 'Сертификаты',
          //     to: '/account/certificates',
          //   },

          // ],
        },
        {
          icon: '$iconify_ion-funnel-outline',
          title: 'CRM',
          children: [
            {
              icon: '$iconify_feather-users',
              title: 'Клиенты',
              to: '/program/accounts',
            },
            {
              icon: '$iconify_carbon-diagram',
              title: 'Сегменты',
              to: '/program/segments',
            },
            {
              icon: '$iconify_feather-shopping-bag',
              title: 'Продажи',
              to: '/program/sellings',
            },
          ],

        },
        {
          icon: '$iconify_ion-megaphone-outline',
          title: 'Акции',
          to: '/actions',
        },
        {
          icon: '$iconify_ion-mail-outline',
          title: 'Рассылки',
          to: '/sendings',
        },
        {
          icon: '$iconify_ion-chatbox-outline',
          title: 'Чаты',
          to: '/communications/chat',
          alias: ['ChatType', 'ChatConversation'],
          badge: 12,
        },
        {
          icon: '$iconify_feather-settings',
          title: 'Настройки',
          to: '/settings',
        },
      ],
    }),
    computed: {
      bgcolor1 () {
        return this.program.bgcolor1 ? this.program.bgcolor1 : '#000000'
      },
      bgcolor2 () {
        return this.program.bgcolor2 ? this.program.bgcolor2 : '#eaeaea'
      },
      selectedCompanyMini () {
        return this.program && this.program.name.slice(0, 1)
      },
      drawer: {
        get () {
          return this.$store.getters.drawer
        },
        set (val) {
          this.$store.dispatch('app/changeDrawer', val)
        },
      },
      profile () {
        return this.$store.getters['profile/profile/profile']
      },
      programs () {
        return this.$store.getters['company/program/programs'].filter(item => item.id !== this.program.id)
      },
      program: {
        get () {
          return this.$store.getters['company/program/program']
        },
        set (v) {
          this.$store.commit('widget/filter/RESET_FILTER') // сброс фильтра бонусных операций
          this.$store.commit('company/program/SET_PROGRAM', v)
        },
      },
    },
    mounted () {

    },
    methods: {
      goToHelp () {
        this.$router.push({ name: 'Help' })
      },
      setExpandProgramList () {
        this.expandProgramList = !this.expandProgramList
      },
      goToMaster () {
        this.$router.push('/master')
        this.$refs.programListGroup.click()
      },
      changeCompany (item) {
        this.program = Object.assign({}, item)
        this.$refs.programListGroup.click()
      },

    },
  }
</script>

<style lang="scss" scoped>

// @import '@/styles/vuetify-preset-plus/overrides';

.menu-divider{
  border-color: #F2F2F7;
}

</style>
