<template>
  <v-tooltip
    ref="vTooltip"
    v-model="isActive"
    :value="isActive"
    :activator="activator"
    :open-delay="openDelay"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :content-class="'base-tooltip'"
    :color="color"
    :absolute="absolute"
    :open-on-hover="openOnHover"
    :z-index="zIndex"
    :disabled="disabled"
    :attach="attach"
    :allow-overflow="allowOverflow"
    :offset-overflow="offsetOverflow"
  >
    <template v-slot:activator="{ on }">
      <!-- <slot
        name="activator"
        :on="on"
      /> -->
      <div
        v-on="on"
      >
        <slot name="default" />
      </div>
    </template>
    <span>{{ text }}</span>
    <slot name="content" />
    <div
      v-if="arrow"
      :class="arrowClass"
      :x-placement="placement"
    />
  </v-tooltip>
</template>

<script>
  import { config } from '@/config/config'
  import Toggleable from 'vuetify/lib/mixins/toggleable'

  export default {
    name: 'Tooltip',
    mixins: [Toggleable],
    props: {
      activator: {
        type: [String, Object],
        default: undefined,
      },
      attach: {
        type: [String, Object, Boolean, HTMLDivElement],
        default: false,
      },
      openDelay: {
        type: [Number, String],
        default: config.tooltipButtonDelay,
      },
      text: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: undefined,
      },
      absolute: Boolean,
      allowOverflow: Boolean,
      offsetOverflow: Boolean,
      top: Boolean,
      bottom: Boolean,
      left: Boolean,
      right: Boolean,
      positionY: {
        type: Number,
        default: undefined,
      },

      arrow: {
        type: Boolean,
        default: true,
      },
      contentClass: {
        type: String,
        default: '',
      },
      // show: Boolean,
      openOnHover: {
        type: Boolean,
        default: true,
      },
      zIndex: {
        type: [String, Number],
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },     
    },

    computed: {
      placement () {
        if (this.top) return 'top'
        else if (this.right) return 'right'
        else if (this.bottom) return 'bottom'
        else if (this.left) return 'left'
        else return 'bottom'
      },
      arrowClass () {
        const classList = {
          'base-tooltip__arrow': true,
        }
        if (this.color) {
          classList[this.color] = true
        }
        return classList
      },
    },
    mounted () {
      // console.log('mounted', this.$el)
      // this.$el.setAttribute('x-placement', this.placement)
      // console.log('vTooltip', this.$refs.vTooltip)
      // if (this.pageYOffsetOff) {
      //   this.$refs.vTooltip.pageYOffset = 0
      //   this.$refs.vTooltip.checkForPageYOffset = () => {}
      // }

      // this.$refs.vTooltip.activatorFixed = true
    },
    created () {

    },
  }
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

$arrow_size: 8px;

.base-tooltip {
  opacity: 1 !important;

  .base-tooltip__arrow
   {
    position: absolute;
    display: block;
    width: $arrow_size;
    height: $arrow_size;
    background: $tooltip-background-color;
    border-radius: 1px;
    transform: rotate(-45deg);
  }

   .base-tooltip__arrow[x-placement^="top"] {
    bottom: -$arrow_size/2;
    left: calc(50% - #{ $arrow_size/2 } );
  }

  .base-tooltip__arrow[x-placement^="right"] {
    left: -$arrow_size/2;
    top: calc(50% - #{ $arrow_size/2 } );
  }

  .base-tooltip__arrow[x-placement^="bottom"] {
    top: -$arrow_size/2;
    left: calc(50% - #{ $arrow_size/2 } );
  }

   .base-tooltip__arrow[x-placement^="left"] {
    right: -$arrow_size/2;
    top: calc(50% - #{ $arrow_size/2 } );
  }

}

</style>
