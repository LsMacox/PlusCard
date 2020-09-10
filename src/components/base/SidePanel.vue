<template>
  <div class="side-panel">
    <div @click="closePanel">
      <!-- <iconify-icon
        icon="arrow-back"
        width="21"
      /> -->
    </div>
    <div class="side-panel__menu">
      <v-overlay
        :absolute="true"
        :opacity="0.5"
        :value="active"
        :z-index="7"
        class="side-panel__overlay"
      >
        <v-btn
          class="overlay-btn__close"
          @click="closePanel"
        />
      </v-overlay>
      <v-navigation-drawer
        v-model="active"
        color="#fff"
        :right="true"
        absolute
        class="side-panel__navigation"
      />
    </div>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'SidePanel',
    data () {
      return {
        active: false,
      }
    },
    mounted () {},
    methods: {
      closePanel () {
        console.log('close panel')
      },
    },
  }
</script>

<style lang="scss" scoped>
.side-panel__overlay {
    left: -280px;
    .v-overlay__content {
        position: unset!important;
    }
}
.side-panel__navigation {
    z-index: 9;
}
.overlay-btn__close {
    position: absolute;
    width: 100%!important;
    height: 100%!important;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: default;
}
</style>
