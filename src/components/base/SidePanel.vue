<template>
  <div class="side-panel">
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
        v-model="active"
        color="#fff"
        :right="true"
        absolute
        class="side-panel__navigation"
      >
        <div
          class="side-panel__back"
          @click="toggleSidePanel"
        >
          <a href="#back">Назад</a>
        </div>
      </v-navigation-drawer>
    </div>
    <slot />
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

<style lang="scss" >

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.side-panel {
    .side-panel__back {
        position: relative;
        margin-top: 36px;
        margin-left: 59px;
        a {
            text-decoration: none;
            font-family: Gilroy;
            font-style: normal;
            font-weight: 600;
            font-size: 13px;
        }
        &:before {
            content: '';
            position: absolute;
            background-color: $primary-base;
            width: 12px;
            height: 1.5px;
            top: 9px;
            left: -20px;
        }
        &:after {
            content: '';
            position: absolute;
            background-color: $primary-base;
            width: 12px;
            height: 1.5px;
            top: 9px;
            left: -20px;
        }
    }
    .side-panel__overlay {
        left: -280px!important;
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
