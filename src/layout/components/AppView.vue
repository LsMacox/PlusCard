<template>
  <v-main>
    <router-view />

    <app-footer />
  </v-main>
</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
      AppFooter: () => import('./AppFooter'),
    },
  }
</script>
