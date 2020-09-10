<template>
  <v-list-item
    :to="item.to"
    @click="itemClickHandler"
  >
    <v-list-item-icon
      v-if="text"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon v-else-if="item.icon">
      <v-icon v-text="item.icon" />
    </v-list-item-icon>

    <v-list-item-content v-if="item.title || item.subtitle">
      <v-list-item-title v-text="item.title" />

      <v-list-item-subtitle v-text="item.subtitle" />
    </v-list-item-content>

    <v-list-item-action v-if="item.badge">
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
            @click="$router.push({ name: 'Dashboard' })"
          >{{item.badge}}
          </v-btn>
        </v-badge>
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
          subtitle: undefined,
          title: undefined,
          to: undefined,
          badge: undefined,
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
    methods: {
      itemClickHandler () {
        this.$emit('click')
      },
    },
  }
</script>

<style lang="scss">

</style>
