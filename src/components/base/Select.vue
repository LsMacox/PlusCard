<template>
  <div
    v-click-outside="hideList"
    class="base-select"
    :class="{active: showList}"
  >
    <v-btn
      class="base-select__btn"
      :ripple="false"
      @click="!disabled ? showList = !showList : $event.stopPropagation()"
    >
      <p
        v-if="selectedItem != null"
        class="body-m-medium neutral-700--text"
      >
        {{ selectedItem[itemText] }}
      </p>
      <p
        v-if="selectedItem == null || selectedItem == undefined"
        class="body-m-medium neutral-600--text"
      >
        {{ placeholder }}
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
          @click="select(item)"
        >
          <slot
            name="item"
            :attrs="{inputValue: item[itemValue] === internalSelectItem[itemValue]}"
            :item="item"
            :on="$listeners"
          >
            <v-list-item-title>
              <div class="item-select">
                <p class="body-m-medium">
                  {{ item[itemText] }}
                </p>
              </div>
            </v-list-item-title>
          </slot>
        </v-list-item>
      </v-list>
    </v-fade-transition>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'selectItem',
      event: 'change',
    },
    props: {
      selectItem: {
        type: [Object, String, Number, Boolean],
        default: null,
      },
      placeholder: {
        type: String,
        default: 'Выберите',
      },
      items: {
        type: Array,
        default () {
          return []
        },
      },
      itemValue: {
        type: String,
        default: 'name',
      },
      itemText: {
        type: String,
        default: 'title',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        internalSelectItem: Object.assign({}, this.items[0]),
        showList: false,
      }
    },
    computed: {
      selectedItem () {
        const comparisonVal = this.itemValue
        const index = this.items.findIndex(
          (item) => {
            return item[comparisonVal] === this.internalSelectItem[comparisonVal]
          },
        )
        return index >= 0 ? this.items[index] : null
      },
    },
    watch: {
      internalSelectItem (v) {
        this.$emit('change', v[this.itemValue] || v)
      },
    },
    mounted () {},
    methods: {
      select (item) {
        this.internalSelectItem = item
        this.showList = false
      },
      hideList () {
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
    z-index: 88;
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
