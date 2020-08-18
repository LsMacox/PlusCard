<template>
  <v-app>
    <div class="layouts-auth">
      <side-panel />
      <router-view />
    </div>
  </v-app>
</template>

<script>
  export default {
    components: {
      SidePanel: () => import('./components/SidePanel'),
    },
    data: () => ({}),
  }
</script>

<style lang="sass" scoped>
  .layouts-auth
    display: flex
</style>
