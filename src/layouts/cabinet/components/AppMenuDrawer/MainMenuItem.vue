<template>
  <v-list-item
    :class="{
      'main-menu-item': true,
      'item-child': subitem,
      'item-mini': mini
    }"
    active-class="main-menu-item-active"
    :to="item.to"
    @click="$emit('click')"
  >
    <v-list-item-icon
      v-if="text"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon
      v-else-if="item.icon"
      class="item-icon"
    >
      <v-icon
        style="height: 20px; width: 20px;"
        :color="active ? ( item.active_icon_color || 'primary' ) : 'neutral-500' "
        v-text="item.icon"
      />
    </v-list-item-icon>
    <v-list-item-icon
      v-else
      class="item-icon"
    >
      <slot name="prependIcon" />
    </v-list-item-icon>

    <v-list-item-content
      v-if="item.title || item.subtitle"
      class="item-content"
    >
      <v-list-item-title>
        <span class="body-m-medium">{{ item.title }}</span>
      </v-list-item-title>

      <v-list-item-subtitle v-text="item.subtitle" />
    </v-list-item-content>

    <v-list-item-action
      v-if="item.badge"
      class="item-action"
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
        >
          {{ item.badge }}
        </v-btn>
      </v-badge>
    </v-list-item-action>
    <v-list-item-action
      v-else-if="item.action_icon"
      class="item-action"
      @click.stop.prevent="$emit('action-click')"
      @hover="hoverAction"
    >
      <v-icon
        class="item-action-icon"
        v-text="item.action_icon"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  export default {
    name: 'MainMenuItem',

    props: {
      item: {
        type: Object,
        default: () => ({
          icon: undefined,
          active_icon_color: undefined,
          subtitle: undefined,
          title: undefined,
          to: undefined,
          badge: undefined,
          action_icon: undefined,
        }),
      },
      subitem: {
        type: Boolean,
        default: false,
      },
      mini: Boolean,
      text: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      isActive: false,
    }),
    computed: {
      active () {
        return this.item.to === this.$route.path
      },
      computedText () {
        if (!this.item || !this.item.title) return ''

        let text = ''

        this.item.title.split(' ').forEach((val) => {
          text += val.substring(0, 1)
        })

        return text
      },
    },
    methods: {
      itemClickHandler () {
        this.$emit('click')
      },
      hoverAction () {
        console.log('hoverAction')
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

#AppMenuDrawer {
  .main-menu-item {
    min-height: 46px;
    padding-left: 20px;
    padding-right: 20px;
    color: $neutral-500;
    &:hover,
    &:active,
    &:focus,
    &:visited,
    &.v-list-item--active > &::before,
    & {
      background-color: transparent !important;
      color: transparent !important;
    }

    &:focus::before,
    &:hover::before {
      opacity: 0;
    }

    .item-icon{
      margin-top: 13px;
      margin-bottom: 13px;
    }
    .item-action {
      color: $neutral-500;
      margin-top: 7px;
      margin-bottom: 7px;
      min-width: 36px;
      justify-content: center;

      &:hover{
        .item-action-icon{
          color: $primary-base;
        }
      }
    }

    &:not(.item-mini) .item-icon {
       margin-right: 20px;
    }

    .item-content {
      color: $neutral-500;
    }
    &.main-menu-item-active {
      color: $primary-base;
      border-right: 2px solid $primary-base;
      border-radius: 0;
      .item-content {
        color: $primary-base;
      }
    }

    &.item-child {
      margin-left: 30px;
      padding-left: 30px;
      border-left: 1px solid $neutral-300;
      .item-icon {
        margin-right: 12px;
        // margin-top: 8px;
        // margin-bottom: 8px;
      }
      .item-content{
        padding-top: 8px;;
        padding-bottom: 8px;;
      }
    }
  }
}
</style>
