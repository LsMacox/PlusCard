<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    :mini-variant="drawer"
    permanent
    app
    width="280"
    v-bind="$attrs"
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
            :ripple="false"
            small
            text
            class="logoBtn"
          >
            <v-img
              src="@/assets/logo_77x32.svg"
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
              :ripple="false"
              small
              text
              class="logoBtn"
              style="
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
              "
            >
              <v-img
                src="@/assets/logo_32x32.svg"
                width="32px"
                height="32px"
              />
            </v-btn>
          </v-badge>

        </v-col>
        <v-spacer v-if="!drawer" />
        <v-col
          cols="3"
          style="padding: 34px 12px 34px 12px"
          v-if="!drawer"
        >
          <v-badge
            dot
            color="error"
            overlap
            avatar
            offset-x="25"
          >
            <v-btn
              :ripple="false"
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
    <v-divider
      style="border-color: #F2F2F7;"
    />
    <div class="companySelectWrapper">
      <v-select
        v-model="selectedItem"
        :items="selectItems"
        class="companySelect"
      >
        <v-icon slot="append">
          mdi-chevron-down
        </v-icon>
      </v-select>
    </div>
    <v-divider
      style="border-color: #F2F2F7;"
    />
    <v-list
      expand
      nav
      class="sidebarMenu"
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
      <v-list-item-group
        color="primary"
      >
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :ripple="false"
          :class="{'v-list-item--active': $route.path.includes(item.to)}"
          @click="$router.push(item.to)"
        >
          <v-list-item-icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
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
      <v-list-item style="margin: 0 20px 0 0">
        <v-list-item-avatar
          height="24px"
          width="24px"
          min-width="24px"
        >
          <v-img
            src="data:image/jpeg;base64,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"
            width="24px"
            height="24px"
          />
        </v-list-item-avatar>
        <v-list-item-title style="color: #70707D;margin:0; padding:0;">
          Константин К.
        </v-list-item-title>
        <v-list-item-action style="color: rgb(0, 209, 93);margin: 0px;padding: 0px;min-width: 45px;width: 45px;font-size: 13px;font-weight: 600;">
          9 999 ₽
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        v-if="!drawer"
        class="appendIcon"
        @click="drawer = !drawer"
      >
        <v-list-item-icon>
          <v-icon color="#B5B5C4">
            mdi-arrow-left
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('turn_off') }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else
        class="appendIcon"
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
        @click="$router.push('/logout')"
      >
        <v-list-item-icon>
          <v-icon color="#B5B5C4" style="transform: rotate(180deg)">
            mdi-exit-to-app
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('exit') }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else
        class="appendIcon"
        @click="$router.push('/dashboard#exit')"
      >
        <v-list-item-icon>
          <v-icon color="#B5B5C4" style="transform: rotate(180deg)">
            mdi-exit-to-app
          </v-icon>
        </v-list-item-icon>
      </v-list-item>

    </template>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapState,
} from 'vuex'

export default {
  name: 'DashboardCoreDrawer',
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    selectItems: ['ООО Ромашка', 'ООО НМТ'],
    selectedItem: 'ООО Ромашка',
    item: 1,
    mobileDevice: false,
    items: [
      {
        icon: 'mdi-poll',
        title: 'Общая информация',
        to: '#',
      },
      {
        icon: 'mdi-wallet-outline',
        title: 'Программа лояльности',
        to: '##',
      },
      {
        icon: 'mdi-gift-outline',
        title: 'Сертификаты',
        to: '###',
      },
      {
        icon: 'mdi-filter-outline',
        title: 'CRM',
        to: '####',
      },
      {
        icon: 'mdi-bullhorn-outline',
        title: 'Рассылки',
        to: '#####',
      },
      {
        icon: 'mdi-message-outline',
        title: 'Чаты',
        to: '######',
      },
      {
        icon: 'mdi-cog-outline',
        title: 'Настройки компаний',
        to: '#######',
      },
    ],
  }),

  computed: {
    ...mapState(['barColor', 'barImage']),
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
      return {
        avatar: true,
        title: this.$t('avatar'),
      }
    },
  },

  methods: {
    mapItem (item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      }
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  box-shadow: inset 0px 0px 44px rgba(19, 31, 95, 0.13)
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-navigation-drawer__append
    .appendIcon
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
