<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    :mini-variant="drawer"
    permanent
    width="280"
    mini-variant-width="60"
    app
  >
    <v-row
      no-gutters
      justify="space-between"
    >
      <v-col cols="auto">
        <router-link
          v-show="!drawer"
          :to="{ name: 'Dashboard' }"
        >
          <v-img
            src="@/assets/svg/logo_77x32.svg"
            width="77px"
            height="32px"
          />
        </router-link>

        <v-badge
          v-show="drawer"
          dot
          color="error"
          overlap
          avatar
          offset-x="5"
          offset-y="5"
        >
          <router-link :to="{ name: 'Dashboard' }">
            <v-img
              src="@/assets/svg/logo_32x32.svg"
              width="32px"
              height="32px"
              @click="$router.push({ name: 'Dashboard' })"
            />
          </router-link>
        </v-badge>
      </v-col>

      <v-col
        v-if="!drawer"
        cols="auto"
      >
        <v-badge
          dot
          color="error"
          overlap
          avatar
          offset-x="10"
        >
          <v-btn
            fab
            x-small
            color="secondary"
            @click="$router.push({ name: 'Dashboard' })"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
        </v-badge>
      </v-col>
    </v-row>
    <v-divider class="menu-divider" />
    <v-row no-gutters>
      select program
    </v-row>
    <v-divider class="menu-divider" />
    <v-row>
      <v-col>
        <app-nav-menu />
      </v-col>
    </v-row>

    <template v-slot:append>
      <v-list>
        <main-menu-item
          :item="{
            icon: (drawer ? 'mdi-arrow-right' :'mdi-arrow-left'),
            title: $t('turn_off'),
          }"
          @click="drawer = !drawer"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import MainMenuItem from './MainMenuItem' 
  import AppNavMenu from './AppNavMenu'

  export default {
    name: 'AppMenuDrawer',
    components: { MainMenuItem,  AppNavMenu },

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
          children: [
            {
              icon: '$iconify_ant-design-gift-outlined',
              title: 'Сертификаты',
              to: '/account/certificates',
            },

          ],
        },
        {
          icon: '$iconify_ion-funnel-outline',
          title: 'CRM',
          to: '/',
        },
        {
          icon: '$iconify_ion-megaphone-outline',
          title: 'Рассылки',
          to: '/',
        },
        {
          icon: '$iconify_ion-chatbox-outline',
          title: 'Чаты',
          to: '/',
        },
        {
          icon: '$iconify_feather-settings',
          title: 'Настройки компаний',
          to: '/',
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
          this.$store.commit('widget/filter/RESET_STATE') // сброс фильтра бонусных операций
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
      exitClick () {
        this.exitRequest = true
        this.$store.dispatch('auth/auth/logout').finally(() => {
          this.exitRequest = false
        })
      },
    },
  }
</script>

<style lang="scss" scoped>

@import '@/styles/vuetify-preset-plus/overrides';

.menu-divider{
  border-color: #F2F2F7;
}

</style>
