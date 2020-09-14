<template>
  <v-navigation-drawer
    id="AppMenuDrawer"
    :mini-variant="drawer"
    permanent
    width="280"
    mini-variant-width="60"
    app
  >
    <template v-slot:prepend>
      <app-menu-header :mini="drawer" />
    </template>

    <v-row>
      <v-col>
        <app-nav-menu :mini="drawer" />
      </v-col>
    </v-row>

    <template v-slot:append>
      <app-menu-footer v-model="drawer" />
    </template>
  </v-navigation-drawer>
</template>

<script>

  export default {
    name: 'AppMenuDrawer',
    components: {
      AppNavMenu: () => import('./AppNavMenu'),
      AppMenuHeader: () => import('./AppMenuHeader'),
      AppMenuFooter: () => import('./AppMenuFooter'),
    },

    data: () => ({

    }),
    computed: {
      
      drawer: {
        get () {
          return this.$store.getters.drawer
        },
        set (val) {
          this.$store.dispatch('app/changeDrawer', val)
        },
      },

    },
    mounted () {},
    methods: {

    },
  }
</script>

<style lang="scss" scoped>

</style>
