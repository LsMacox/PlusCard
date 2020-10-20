<template>
  <div
    class="base-select"
    :class="{active: showList}"
  >
    <v-btn
      class="base-select__btn"
      :ripple="false"
      @click="showList = !showList"
    >
      <p
        v-if="selectedItem != null"
        class="body-m-medium neutral-700--text"
      >
        {{ selectedItem.name }}
      </p>
      <p
        v-if="selectedItem == null || selectedItem == undefined"
        class="body-m-medium neutral-600--text"
      >
        {{ itemPlaceholder }}
      </p>
      <iconify-icon
        class="icon-triangle"
        icon="si-glyph-triangle-down"
        width="15"
      />
    </v-btn>
    <v-fade-transition>
      <v-list
        v-show="showList"
        class="base-select__list"
      >
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(item.id)"
          @mouseover="item.setting = true"
          @mouseleave="item.setting = false"
        >
          <v-list-item-title>
            <div class="item-select">
              <p class="body-m-medium">
                {{ item.name }}
              </p>
            <!-- <img
              v-if="item.id === internalValue && !item.setting"
              src="@/icons/svg/check.svg"
            >
            <img
              v-if="item.setting"
              src="@/icons/svg/settings.svg"
            > -->
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-fade-transition>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'selectId',
      event: 'change',
    },
    props: {
      itemPlaceholder: {
        type: String,
        default: 'Выберите',
      },
      selectId: {
        type: Number,
        default: null,
      },
      items: {
        type: Array,
        default: () => [{ id: 1, name: 'test' }],
      },
      disabled: Boolean,
    },
    data () {
      return {
        internalSelectId: null,
        showList: false,
      }
    },
    computed: {
      selectedItem () {
        const index = this.items.findIndex(item => item.id === this.internalSelectId)
        return index >= 0 ? this.items[index] : null
      },
    },
    watch: {
      internalSelectId (v) {
        this.$emit('change', v)
      },
    },
    methods: {
      selectItem (itemId) {
        this.internalSelectId = itemId
        this.showList = false
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.base-select {
  position: relative;
  .base-select__btn.v-btn.v-btn--contained.theme--light {
    width: 100%;
    background: $neutral-100 !important;
    border: 1px solid $neutral-400 !important;
    border-radius: 10px;
    padding: 12px 16px !important;
    display: flex;
    justify-content: space-between;
    transition: all .2s ease-in-out;
    .icon-triangle {
      color: $primary-base;
      transition: all .2s ease-in-out;
    }
    &:hover {
      &::before {
        opacity: 0!important;
      }
    }
  }
  .base-select__list {
    position: absolute;
    border: 1px solid $neutral-400 !important;
    border-radius: 10px;
    width: 100%;
    background: $neutral-100 !important;
    z-index: 33;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
  &.active {
    .base-select__list {
      border-top-color: transparent !important;
    }
    .base-select__btn.v-btn.v-btn--contained.theme--light {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-color: transparent;
      .icon-triangle {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
