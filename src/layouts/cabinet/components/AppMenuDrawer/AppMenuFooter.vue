<template>
  <v-list>
    <v-list-item class="profile-item">
      <v-list-item-icon class="profile-item-avatar">
        <!-- :src="profile.avatar" -->
        <v-img
          :src="profile.avatar"
          height="24"
          width="24"
        />
      </v-list-item-icon>
      <v-list-item-content class="profile-item-content">
        <v-list-item-title
          class="profile-item-title body-m-medium neutral-700--text"
        >
          {{ profile.UserName }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-action-text
        class="body-s-semibold profile-item-action color-success"
      >
        <span class="success--text">{{ balance+' ₽' }} </span>
      </v-list-item-action-text>
    </v-list-item>

    <main-menu-item
      :item="{
        icon: (internalMini ? 'mdi-arrow-right' :'mdi-arrow-left'),
        title: $t('turn_off'),
      }"
      :mini="mini"
      @click="internalMini = !internalMini"
    />

    <main-menu-item
      :item="{
        title: $t('exit'),
        action_icon: 'mdi-help-circle-outline'
      }"
      :mini="mini"
      @click="exitClick"
      @action-click="$router.push({ name: 'Help' })"
    >
      <template v-slot:prependIcon>
        <v-icon
          color="neutral-500"
          style="transform: rotate(180deg)"
        >
          $iconify_ion-exit-outline
        </v-icon>
      </template>
    </main-menu-item>
  </v-list>
</template>

<script>

  export default {
    name: 'AppMenuFooter',

    components: {
      MainMenuItem: () => import('./MainMenuItem'),
    },
    model: {
      prop: 'mini',
      event: 'change',
    },

    props: {
      mini: Boolean,
    },

    data: () => ({

      // balance: 9999,
    }),
    computed: {

      balance (){
          return this.merchant ? this.merchant.balance : '-'
      },
      profile () {
        return this.$store.getters['profile/profile/profile']
      },
      merchant () {
        return this.$store.getters.merchant
      },
      internalMini: {
        get () {
          return this.mini
        },
        set (val) {
          if (val === this.mini) return

          this.$emit('change', val)
        },
      },
    },
    mounted () {},
    methods: {
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
@import "@/styles/_typography";

#program-logo-btn {
  @include body-l-semibold;
  height: 36px;
  width: 36px;
  margin-left: -8px;
}

.program-select,
.main-logo-row {
  padding-left: 20px;
  padding-right: 20px;
}

.main-logo-row,
.main-logo-row-mini {
  margin-top: 34px;
  margin-bottom: 34px;
}

.main-logo-row-mini {
  padding-left: 14px;
  padding-right: 14px;
}

.profile-item {
  // min-height: 46px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 26px;
  .profile-item-avatar {
    margin-top: 12px;
    margin-bottom: 12px;
    margin-right: 0px;
    margin-left: -1px;
  }
  .profile-item-content {
    margin-left: 19px;
  }
}
</style>
