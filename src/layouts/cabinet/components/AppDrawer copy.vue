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
            to="/dashboard"
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
              to="/dashboard"
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
          ref="programListGroup"
          :value="false"
          @click="setExpandProgramList"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ program.name }}</v-list-item-title>
          </template>
          <template v-slot:appendIcon>
            <div
              v-show="!expandProgramList"
            >
              <span
                class="iconify"
                data-icon="entypo:chevron-down"
                data-inline="false"
              />
            </div>
            <div
              v-show="expandProgramList"
            >
              <span
                class="iconify"
                data-icon="entypo:chevron-up"
                data-inline="false"
              />
            </div>
          </template>

          <v-list-item
            v-for="(item, i) in programs"
            :key="i"
            @click="changeCompany(item)"
          >
            <v-list-item-title v-text="item.name" />
          </v-list-item>
          <div style="padding: 0 16px;">
            <v-btn
              block
              color="secondary"
              @click="goToMaster()"
            >
              Добавить компанию
            </v-btn>
          </div>
        </v-list-group>
      </v-list>
    </div>
    <div
      v-else
      class="miniCompany"
      :style="'background: linear-gradient(140deg,'+ bgcolor1 + ' 0% ,' + bgcolor2 + ' 99.35%); color:'+ program.font_color"
    >
      {{ program.name && program.name.slice(0,1) || 'M' }}
    </div>
    <v-divider style="border-color: #F2F2F7;" />
    <div class="app__drawer-scrollable-block">
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
    </div>
    <template v-slot:append>
      <v-list-item style="margin: 0">
        <v-list-item-avatar          
        >
          <v-img
            :src="profile.avatar"
            width="24px"
            height="24px"
          />
        </v-list-item-avatar>
        <v-list-item-title style="color: #70707D;margin:0; padding:0;">
          {{ profile.UserName }}
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
          @click.stop.prevent="goToHelp()"
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
    data: () => ({
      expandProgramList: false,
      selectedCompany: 'Management',
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
        // {
        //   icon: '<span class="iconify" data-icon="ant-design:gift-outlined" data-inline="false"></span>',
        //   title: 'Сертификаты/Мастер',
        //   to: '/certificate/master',
        // },
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
        })
      },
    },
  }
</script>

<style lang="sass" scoped>

@import '@/styles/vuetify-preset-plus/overrides'

@import '~vuetify/src/styles/tools/_rtl.sass'

.sidebarMenu.v-list
  padding: 0 !important
  margin: 0 !important
  .v-item-group
    margin-top: 10px
    .v-list-item.v-list-item--link.theme--light
      margin: 0 !important
      padding: 0 0 0 5px !important
      min-height: 10px
      height: 45px
      &:hover, &:active, &:focus, &:visited, &.v-list-item--active > &::before, &
        background-color: transparent !important
        color: transparent !important
      .v-list-item__title
        font-weight: 500
        font-size: 15px
        line-height: 21px
        color: #B5B5C4
      &.v-list-item--active
        color: transparent
        border-right: 2px solid #4776E6
        border-radius: 0

        .v-list-item__title
          color: #4776E6 !important
        .v-list-item__icon .iconify
          color: #4776E6 !important
        .v-list-item
          &__icon:first-child
            .iconify.stats
              color: #8E54E9 !important

      .v-list-item__icon
        width: 21px
        height: 21px
        padding: 0
        margin: 0
        margin-left: 20px !important
        margin-top: 10px !important
        .iconify
          width: 21px
          height: 21px
          margin-right: 20px
          color: #B5B5C4

.miniCompany
  width: 36px
  height: 36px
  margin: 17px 12px
  border-radius: 50%
  font-style: normal
  font-weight: 600
  font-size: 17px
  line-height: 35px
  text-align: center
  letter-spacing: 0.4px
.v-list.companySelect.v-sheet.theme--light
  padding: 0 !important
  margin: 0 !important
  #company_group_select
    .v-list-item.v-list-item--link.theme--light
      color: transparent !important
      .v-list-item__content, .v-list-item__title
        color: $neutral-900 !important
        font-weight: 600
        font-size: 17px
        line-height: 22px
        letter-spacing: 0.4px
      .v-list-item__icon.v-list-group__header__append-icon
        min-width: 0
        color: $primary-base

.companySelectWrapper
  padding: 20px 0 15px 0

#core-navigation-drawer.v-navigation-drawer--mini-variant
  width: 60px
  .v-list-item.v-list-item--link.theme--light
    padding: 0 0 0 8px !important

  .companySelectWrapper
    width: 5px
    padding: 0 0 0 10px

  .companySelect
    .v-select__selections
      display: none

#core-navigation-drawer
  .v-navigation-drawer__content
    overflow-y: hidden

    // scrollable block
    .app__drawer-scrollable-block
      height: calc(100vh - 185px)
      overflow-y: auto
      -ms-overflow-style: none
      overflow: -moz-scrollbars-none

    .app__drawer-scrollable-block::-webkit-scrollbar
      width: 0

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
