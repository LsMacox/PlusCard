<template>
  <v-app>
    <app-drawer />

    <app-view />
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',

    components: {
      AppDrawer: () => import('./components/AppDrawer'),
      AppView: () => import('./components/AppView'),
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
