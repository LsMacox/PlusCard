<template>
  <div>
    <vue-progress-bar />
    <notifications group="api" />
    <notifications />

    <v-app id="vApp">
      <router-view />
      <v-overlay :value="loadingApp">
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'App',
    computed: {
      loadingApp () {
        return this.$store.getters.loadingApp
      },
    },
  }
</script>
