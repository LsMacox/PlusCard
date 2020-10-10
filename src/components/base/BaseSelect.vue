<template>
  <div
    class="base-select"
  >
    <v-menu
      class=""
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="base-select__select"
          v-bind="attrs"
          v-on="on"
        >
          <p class="body-m-medium neutral-900--text">
            {{ select ? select.title : 'Выберите операцию' }}
          </p>
          <iconify-icon
            class="icon-triangle-down"
            icon="si-glyph-triangle-down"
            width="15"
          />
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          link
          @click="setSelectedItem(item)"
        >
          <v-list-item-title v-text="item.title || '-'" />
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'selected',
      event: 'changeSelectedItem',
    },
    props: {
      selected: {
        type: Object,
        default: () => {
          return {}
        },
      },
      items: {
        type: Array,
        default () {
          return [{ id: 1, title: 'данные отсутствуют' }]
        },
      },
    },
    data () {
      return {
        select: null,
      }
    },
    created () {
    },
    methods: {
      setSelectedItem (item) {
        this.select = item
        this.$emit('changeSelectedItem', item)
      },
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography.sass";

.base-select {
  .base-select__select.v-btn.v-btn--contained.theme--light {
    padding: 0 16px!important;
    width: 100%;
    background-color: $neutral-100 !important;
    border: 1px solid $neutral-400 !important;
    border-radius: 10px !important;
    .v-btn__content {
      display: flex;
      justify-content: space-between;
    }
    .icon-triangle-down {
      color: $primary-base;
    }
    &::before {
      opacity: 0 !important;
    }
    &::hover {
      &::before {
        opacity: 0 !important;
      }
    }
  }
}
</style>
