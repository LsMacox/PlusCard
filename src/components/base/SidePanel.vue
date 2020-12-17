<template>
  <div
    ref="side-panel"
    class="side-panel"
    v-bind="$attrs"
  >
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
          @click="toggleSidePanel"
        />
      </v-overlay>
      <v-navigation-drawer
        ref="side-panel__nav"
        v-model="active"
        color="#fff"
        :right="true"
        :width="width"
        fixed
        class="side-panel__navigation"
      >
        <div
          class="side-panel__back"
          @click="toggleSidePanel"
        >
          <iconify-icon
            class="back__icon"
            icon="arrow-left"
            height="21"
          />
          Назад
        </div>
        <slot />
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SidePanel',
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      active: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 400,
      },
    },
    data () {
      return {
        state: this.active,
      }
    },
    computed: {
    },
    mounted () {},
    methods: {
      toggleSidePanel () {
        this.state = !this.active
        this.$emit('changeState', this.state)
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.side-panel {
    .side-panel__back {
        display: inline-block;
        position: relative;
        margin-top: 36px;
        margin-left: 59px;
        color: #4776E6;
        cursor: pointer;
        a {
            text-decoration: none;
            font-family: Gilroy;
            font-style: normal;
            font-weight: 600;
            font-size: 13px;
        }
        .back__icon {
          position: absolute;
          left: -25px;
          top: 0px;
          color: $primary-base;
          cursor: pointer;
        }
    }
    .side-panel__overlay {
        left: -100%!important;
        .v-overlay__content {
            position: unset!important;
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
    }
    .side-panel__navigation {
      z-index: 9!important;
    }
}

</style>
