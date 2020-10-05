<template>
  <v-container style="padding:0px">
    <!-- Main logo -->
    <v-row
      no-gutters
      :class="mini?'main-logo-row-mini': 'main-logo-row'"
    >
      <v-col cols="auto">
        <router-link
          v-show="!mini"
          :to="{ name: 'Dashboard' }"
        >
          <v-img
            src="@/assets/svg/logo_77x32.svg"
            width="77px"
            height="32px"
          />
        </router-link>
        <v-badge
          v-show="mini"
          dot
          color="error"
          overlap
          avatar
          offset-x="5"
          offset-y="5"
        >
          <router-link :to="{ name: 'Dashboard' }">
            <v-img
              src="@/assets/svg/logo_32x32.svg"
              width="32px"
              height="32px"
              @click.stop="$router.push({ name: 'Dashboard' })"
            />
          </router-link>
        </v-badge>
      </v-col>
      <v-spacer v-show="!mini" />
      <v-col
        v-if="!mini"
        cols="auto"
      >
        <v-badge
          dot
          color="error"
          overlap
          avatar
          offset-x="10"
        >
          <v-btn
            fab
            x-small
            color="secondary"
            @click.stop=""
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
        </v-badge>
      </v-col>
    </v-row>
    <v-divider class="menu-divider" />
    <!-- Program select -->
    <app-program-select :mini="mini" />

    <v-divider class="menu-divider" />
  </v-container>
</template>

<script>

  export default {
    name: 'AppMenuHeader',
    components: {
      AppProgramSelect: () => import('./AppProgramSelect'),
    },

    props: {
      mini: Boolean,
    },

    data: () => ({

    }),
    computed: {

    },
    mounted () {},
    methods: {

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
  margin-top: 33px;
  margin-bottom: 33px;
  height: 32px;
}

.main-logo-row-mini {
  padding-left: 14px;
  padding-right: 14px;
}

</style>
