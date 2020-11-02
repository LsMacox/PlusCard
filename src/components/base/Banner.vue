<template>
  <v-container :class="['base-banner', typeClass]" v-show="display">
    <v-row
      class="base-banner__wrapper"
      align="center"
    >
      <v-col
        class="base-banner__icon"
        cols="auto"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-icon :color="color">
            $iconify_eva-info-fill
          </v-icon>
        </v-row>
      </v-col>
      <v-divider
        vertical
        class="base-banner__divider"
      />
      <v-col class="base-banner__content">
        <div
          v-if="text"
          class="body-m-semibold"
        >
          {{ text }}         
        </div>
        <slot />
      </v-col>

      <v-col
        class="base-banner__action"
        cols="auto"        
      >
        <v-btn
          v-if="!$slots.action && closeable"
          icon
          :color="color"
          @click="display = false"
        >
          <v-icon>$iconify_ion-close</v-icon>
        </v-btn>
        <slot name="action" />
      </v-col>
    </v-row>
  </v-container>
</template>

    <script>


  export default {
    components: {},
    mixins: [],
    props: {
      type: {
        type: String, // info, warn, error
        default: 'info',
      },
      text: {
        type: String,
        default: undefined,
      },
      closeable: {
        type: Boolean,
        default: false,
      }
    },
    data () {
      return {
        display: true,
      }
    },
    computed: {
      typeClass () {
        return `base-banner--${this.type}`
      },
      color () {
        switch (this.type) {
          case 'warn':
            return 'warning'
          default:
            return 'primary'
        }
      },
    },
    mounted () {},

    methods: {},
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/variables.scss";
.base-banner {
  border-style: solid;
  border-width: 1px;
  border-radius: $container-padding-x;
  .base-banner__icon {
    width: 53px;
  }
  .base-banner__divider {
    margin-top: -$container-padding-x;
    margin-bottom: -$container-padding-x;
  }

  &.base-banner--warn {
    color: $warning;
    background-color: #fff1e1;
    .base-banner__divider {
      // rgba(255, 163, 56, 0.15);
      border-color: rgba(255, 163, 56, 0.15);
    }
  }
}
</style>
