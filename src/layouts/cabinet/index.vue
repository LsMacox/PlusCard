<template>
  <v-app
    v-if="!loadingApp"
  >
    <app-menu-drawer />
    <app-view />
  </v-app>
</template>

<script>
  export default {
    components: {
      AppMenuDrawer: () => import('./components/AppMenuDrawer/index'),
      AppView: () => import('./components/AppView'),
    },
    data: () => ({
      expandOnHover: false,
    }),
    computed: {
      loadingApp () {
        return this.$store.getters.loadingApp
      },
    },
    async created () {
      await this.$store.dispatch('app/setLoadingApp', true)

      console.log('loading App Data')
      await this.$store.dispatch('auth/auth/loadingApp')

      await this.$store.dispatch('app/setLoadingApp', false)
    },
  }
</script>
