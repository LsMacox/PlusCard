<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    :mini-variant="drawer"
    permanent
    width="280"
    mini-variant-width="60"
    app
  >
    <!--    header-->
    <v-container style="padding:0">
      <v-row align="center">
        <v-col
          v-if="!drawer"
          cols="6"
          style="padding: 34px 12px 34px 32px"
        >
          <v-btn
            small
            text
            class="logoBtn"
            @click="drawer = !drawer"
          >
            <v-img
              src="@/assets/svg/logo_77x32.svg"
              width="77px"
              height="32px"
            />
          </v-btn>
        </v-col>
        <v-col
          v-else
          cols="6"
          style="padding: 34px 0px 34px 26px;"
        >
          <v-badge
            dot
            color="error"
            overlap
            avatar
            offset-x="5"
            offset-y="5"
          >
            <v-btn
              small
              text
              class="logoBtn"
              style="
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
              "
              @click="drawer = !drawer"
            >
              <v-img
                src="@/assets/svg/logo_32x32.svg"
                width="32px"
                height="32px"
              />
            </v-btn>
          </v-badge>
        </v-col>
        <v-spacer v-if="!drawer" />
        <v-col
          v-if="!drawer"
          cols="3"
          style="padding: 34px 12px 34px 12px"
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
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </v-col>
      </v-row>
    </v-container>
    <!--    header-end-->
    <v-divider style="border-color: #F2F2F7;" />
    <div
      v-if="!drawer"
      class="companySelectWrapper"
    >
      <v-list
        class="companySelect"
      >
        <v-list-group
          id="company_group_select"
          :value="expandedSelect"
          @click="pressClick"
        >
          <template v-slot:appendIcon>
            <div v-show="!activeGroup">
              <span
                class="iconify"
                data-icon="entypo:chevron-down"
                data-inline="false"
              />
            </div>
            <div v-show="activeGroup">
              <span
                class="iconify"
                data-icon="entypo:chevron-up"
                data-inline="false"
              />
            </div>
          </template>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ program.name }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(item, i) in programs.filter(item => item.id != program.id)"
            :key="i"
            :ripple="false"
            @click="changeCompany(item)"
          >
            <v-list-item-title v-text="item.name" />
          </v-list-item>
          <v-btn
            block
            color="secondary"
            @click="goToMaster()"
          >
            Добавить компанию
          </v-btn>
        </v-list-group>
      </v-list>
    </div>
    <div
      v-else
      class="miniCompany"
      :style="'background: linear-gradient(140deg,'+ bgcolor1 + ' 0% ,' + bgcolor2 + ' 99.35%); color:'+ program.font_color"
    >
      {{ selectedCompanyMini }}
    </div>
    <v-divider style="border-color: #F2F2F7;" />
    <v-list
      expand
      nav
      class="sidebarMenu"
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :class="{ 'v-list-item--active': $route.path.includes(item.to) }"
          @click="$router.push(item.to)"
        >
          <v-list-item-icon>
            <span v-html="item.icon" />
          </v-list-item-icon>
          <v-list-item-title style="cursor:pointer;">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
    <template v-slot:append>
      <v-list-item style="margin: 0">
        <v-list-item-avatar
          height="24px"
          width="24px"
          min-width="24px"
        >
          <v-img
            :src="profile.avatar"
            width="24px"
            height="24px"
          />
        </v-list-item-avatar>
        <v-list-item-title style="color: #70707D;margin:0; padding:0;">
          {{ profile.name }}
        </v-list-item-title>
        <v-list-item-action
          style="color: rgb(0, 209, 93);margin: 0px;padding: 0px;min-width: 45px;width: 45px;font-size: 13px;font-weight: 600;"
        >
          9 999 ₽
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        v-if="!drawer"
        class="appendIcon"
        style="background: #F7F7FC !important"
        @click="drawer = !drawer"
      >
        <v-list-item-icon>
          <v-icon color="#B5B5C4">
            mdi-arrow-left
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t("turn_off") }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else
        class="appendIcon"
        style="background: #F7F7FC !important"
        @click="drawer = !drawer"
      >
        <v-list-item-icon>
          <v-icon color="#B5B5C4">
            mdi-arrow-right
          </v-icon>
        </v-list-item-icon>
      </v-list-item>

      <v-list-item
        v-if="!drawer"
        class="appendIcon"
        style="background: #F7F7FC !important"
        :disabled="exitRequest"
        @click="exitClick"
      >
        <v-list-item-icon>
          <v-icon
            color="#B5B5C4"
            style="transform: rotate(180deg)"
          >
            mdi-exit-to-app
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t("exit") }}</v-list-item-title>
        <v-list-item-action
          style="color: rgb(0, 209, 93);margin: 0px;padding: 0px;min-width: 45px;width: 45px;font-size: 13px;font-weight: 600; position: relative; z-index:10000"
        >
          <v-icon color="#B5B5C4">
            mdi-help-circle-outline
          </v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-list-item
        v-else
        class="appendIcon"
        style="background: #F7F7FC !important"
        :disabled="exitRequest"
        @click="exitClick()"
      >
        <v-list-item-icon>
          <v-icon
            color="#B5B5C4"
            style="transform: rotate(180deg)"
          >
            mdi-exit-to-app
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'DashboardCoreDrawer',
    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      expandedSelect: false,
      selectedCompany: 'Management',
      activeGroup: false,
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings'],
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete'],
      ],
      selectItems: ['ООО Ромашка', 'ООО НМТ'],
      selectedItem: 'ООО Ромашка',
      item: 1,
      mobileDevice: false,
      exitRequest: false,
      items: [
        {
          icon: '<span class="iconify stats" data-icon="ion:stats-chart" data-inline="false"></span>',
          title: 'Общая информация',
          to: '/dashboard',
        },
        {
          icon: '<span class="iconify" data-icon="ion:wallet-outline" data-inline="false"></span>',
          title: 'Программа лояльности',
          to: '/loyalty',
        },
        {
          icon: '<span class="iconify" data-icon="ant-design:gift-outlined" data-inline="false"></span>',
          title: 'Сертификаты',
          to: '/account/certificates',
        },
        {
          icon: '<span class="iconify" data-icon="ant-design:gift-outlined" data-inline="false"></span>',
          title: 'Сертификаты/Мастер',
          to: '/certificate/master',
        },
        {
          icon: '<span class="iconify" data-icon="ion:funnel-outline" data-inline="false"></span>',
          title: 'CRM',
          to: '####',
        },
        {
          icon: '<span class="iconify" data-icon="ion:megaphone-outline" data-inline="false"></span>',
          title: 'Рассылки',
          to: '#####',
        },
        {
          icon: '<span class="iconify" data-icon="ion:chatbox-outline" data-inline="false"></span>',
          title: 'Чаты',
          to: '######',
        },
        {
          icon: '<span class="iconify" data-icon="feather:settings" data-inline="false"></span>',
          title: 'Настройки компаний',
          to: '#######',
        },
        {
          icon: '<span class="iconify" data-icon="bi:ui-checks" data-inline="false"></span>',
          title: 'UI_KIT',
          to: '/ui_kit',
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
        return this.selectedCompany.slice(0, 1)
      },
      drawer: {
        get () {
          return this.$store.getters.drawer
        },
        set (val) {
          this.$store.dispatch('app/changeDrawer', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        return this.$store.getters['profile/profile/profile']
      },
      programs () {
        return this.$store.getters['company/program/programs']
      },
      program: {
        get () {
          console.log(this.$store.getters['company/program/program'])
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
      goToMaster () {
        this.$router.push('/master')
        this.expandedSelect = false
      },
      changeCompany (item) {
        this.expandedSelect = false
        this.program = Object.assign({}, item)
      },
      pressClick (e) {
        this.expandedSelect = !this.expandedSelect
        this.activeGroup = !this.activeGroup
      },
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
      exitClick () {
        this.exitRequest = true
        this.$store.dispatch('auth/auth/logout').finally(() => {
          this.exitRequest = false
          this.$router.push('/login')
        })
      },
    },
  }
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-navigation-drawer__content
    overflow-y: hidden

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .appendIcon.v-list-item.v-list-item--link.theme--light
      background: #F7F7FC !important

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px
        color: #B5B5C4 !important

        &__title
          font-weight: 500
          font-size: 15px
          line-height: 21px
          color: #B5B5C4
          +ltr()
          margin-right: 24px
          margin-left: 12px !important

          +rtl()
          margin-left: 24px
          margin-right: 12px !important

    a.appendIcon.v-list-item.v-list-item--link.theme--light
      background: #F7F7FC !important
      & .v-list-item__icon
        margin-left: 0 !important

        i.v-icon
          color: #B5B5C4 !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
        padding-left: 8px

        +rtl()
        padding-right: 8px

        .v-list-group__header
          +ltr()
          padding-right: 0

          +rtl()
          padding-right: 0

          .v-list-item__icon--text
            margin-top: 19px
            order: 0

            .v-list-group__header__prepend-icon
              order: 2

              +ltr()
              margin-right: 8px

              +rtl()
              margin-left: 8px
</style>
