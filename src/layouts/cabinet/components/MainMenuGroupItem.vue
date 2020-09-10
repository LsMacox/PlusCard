<template>
  <v-list-group
    v-model="item.active"
    no-action
  >
    <template v-slot:activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-icon v-else-if="item.icon">
        <v-icon v-text="item.icon" />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in item.children">
      <MainMenuItem
        :key="`item-${i}`"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
  import MainMenuItem from './MainMenuItem'

  export default {
    name: 'MainMenuGroupItem',
    components:{MainMenuItem},
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
      text: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({

    }),
    computed: {
      computedText () {
        if (!this.item || !this.item.title) return ''

        let text = ''

        this.item.title.split(' ').forEach(val => {
          text += val.substring(0, 1)
        })

        return text
      },

    },
  }
</script>

<style lang="scss">

</style>
