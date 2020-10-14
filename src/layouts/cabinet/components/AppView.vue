<template>
  <v-main>
    <div id="appView">
      <router-view />
    </div>
  </v-main>
</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
    },
    computed: {
      drawer () {
        return this.$store.getters.drawer
      },
    },
  }
</script>

<style lang="sass">

#appView
    /*z-index: 100*/
    position: relative
    padding: $page-content-padding
    height: 100%
    // overflow: hidden
    box-shadow: 0px 0px 44px rgba(19, 31, 95, 0.13)
</style>
