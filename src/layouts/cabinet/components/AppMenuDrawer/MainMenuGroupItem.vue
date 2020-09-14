<template>
  <v-list-group
    v-model="item.active"
    :class="{
      'main-menu-item-group': true,
      'item-group-mini': mini

    }"
    active-class="main-menu-item-group-active"
    no-action
  >
    <template v-slot:activator>
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
          color="neutral-500"
          v-text="item.icon"
        />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          <span class="body-m-medium neutral-500--text">{{ item.title }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in item.children">
      <main-menu-item
        :key="`item-${i}`"
        :subitem="true"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
  import MainMenuItem from './MainMenuItem'

  export default {
    name: 'MainMenuGroupItem',
    components: { MainMenuItem },
    props: {
      item: {
        type: Object,
        default: () => ({
          icon: undefined,
          subtitle: undefined,
          title: undefined,
          to: undefined,
        }),
      },
      mini: Boolean,
      text: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({}),
    computed: {
      computedText () {
        if (!this.item || !this.item.title) return ''

        let text = ''

        this.item.title.split(' ').forEach((val) => {
          text += val.substring(0, 1)
        })

        return text
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

#AppNavMenu {
  .main-menu-item-group {
    .v-list-group__header {
      min-height: 45px;
      padding-left: 20px;
      padding-right: 20px;
      &:focus::before,
      &:hover::before {
        opacity: 0;
      }

      .v-list-item__icon.v-list-group__header__append-icon{
      .v-icon{
        font-size: 15px;
        color: $primary-base;
      }
     }
     .v-list-group__header__append-icon{
       min-width: 36px;
       justify-content: center;
     }

    }

  }
}
</style>
<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

#AppNavMenu {
  .main-menu-item-group {
    
     .item-icon {
      margin-top: 12px ;
      margin-bottom: 12px ;
     
    }

     &:not(.item-group-mini) .item-icon {
        margin-right: 20px;
     }
    &.main-menu-item-group-active {
    }
  }
}

// &:focus::before, &:hover::before {
//     opacity: 0
//   }
</style>
