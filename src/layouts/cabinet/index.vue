<template>
  <v-app
    v-if="!loadingApp"
    id="vApp"
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
      try {
        await this.$store.dispatch('app/setLoadingApp', true)

        console.log('loading App Data: start')
        await this.$store.dispatch('auth/auth/loadingApp')
        // TODO connect socket+redis

        await this.$store.dispatch('app/setLoadingApp', false)
        console.log('loading App Data: end')
      } catch (error) {
        console.log('loading error', error)
      }
    },
  }
</script>
