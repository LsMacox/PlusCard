<template>
  <div
    ref="base-combobox"
    v-click-outside="hide"
    class="base-combobox"
    :placement="showList ? listPlacement : 'none'"
  >
    <base-text-field
      v-model="findBy"
      type="text"
      class="base-combobox__input"
      :class="{'no-selected': !internalSelectedItems.length}"
      outlined
      placeholder="Введите название сегмента"
      @focus="show"
    >
      <template
        v-if="!!internalSelectedItems.length"
        v-slot:prepend-inner
      >
        <div
          class="base-select__select-items"
        >
          <div
            v-for="item in internalSelectedItems"
            :key="item.id"
            :style="item.color.length ? `background: ${item.color.charAt(0) == '#' ? hexToRgbA(item.color, '0.15') : item.color};` : ''"
            class="base-combobox__select-item"
          >
            <p
              class="body-s-semibold"
              :style="`color: ${item.color}`"
            >
              {{ item.name }}
            </p>
            <iconify-icon
              :style="`color: ${item.color}`"
              class="icon-close"
              icon="jam-close"
              width="18"
              @click="deleteSelectItem(item.id)"
            />
          </div>
        </div>
      </template>
    </base-text-field>
    <v-fade-transition>
      <v-list
        v-show="showList"
        ref="base-combobox-list"
        class="base-combobox__list"
        :style="!listItems.length ? 'padding-top: 0; padding-bottom: 0;' : ''"
      >
        <div
          class="base-combobox__list-scroll"
          :style="!listItems.length ? 'padding-top: 0; overflow-y: hidden' : ''"
        >
          <v-list-item
            v-for="(item, index) in listItems"
            :key="index"
            class="list-item"
            :ripple="false"
            @click="selectItem(item.id)"
          >
            <v-list-item-title
              :style="item.color.length ? `background: ${item.color.charAt(0) == '#' ? hexToRgbA(item.color, '0.15') : item.color};` : ''"
              class="list-item-title"
            >
              <div class="item-select">
                <p
                  class="body-m-medium mb-0"
                  :style="`color: ${item.color}`"
                >
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
          <v-list-item
            v-if="!listItems.length"
            class="list-item-title"
          >
            <div class="item-select">
              <p class="body-m-medium mb-0">
                {{ notFoundPlaceholder || '' }}
              </p>
            </div>
          </v-list-item>
        </div>
      </v-list>
    </v-fade-transition>
  </div>
</template>

<script>
  import Calculation from '@/mixins/calculation.js'
  import Convertor from '@/mixins/convertor.js'

  export default {
    mixins: [Convertor, Calculation],
    model: {
      prop: 'selectedItems',
      event: 'change',
    },
    props: {
      selectedItems: {
        type: Array,
        default () {
          return []
        },
      },
      items: {
        type: Array,
        default () {
          return [{ id: 1, color: '#ff008a', name: 'test' }]
        },
      },
      notFoundPlaceholder: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        showList: false,
        internalItems: this.items,
        listPlacement: 'top',
        internalSelectedItems: [],
        findBy: '',
      }
    },
    computed: {
      listItems () {
        const items = this.internalItems.filter(item => {
          return this.internalSelectedItems.filter(selectedItem => selectedItem.id === item.id).length === 0
        })

        if (this.findBy.length > 0) {
          const sortItems = items.filter((item) => {
            if (
              item.name
                .toLowerCase()
                .indexOf(this.findBy.toLowerCase()) !== -1
            ) {
              return item
            }
          })

          return sortItems
        }

        return items
      },
    },
    watch: {
      internalSelectedItems (v) {
        this.$emit('change', v)
      },
    },
    mounted () {},
    methods: {
      selectItem (id) {
        const item = this.internalItems[this.internalItems.findIndex(item => item.id === id)]
        this.internalSelectedItems.push(item)
        this.$nextTick(() => {
          this.calculationPositionForList()
        })
      },
      deleteSelectItem (id) {
        const index = this.internalSelectedItems.findIndex(item => item.id === id)
        this.internalSelectedItems.splice(index, 1)
        this.$nextTick(() => {
          this.calculationPositionForList()
        })
      },
      calculationPositionForList () {
        this.calculationPositionEl(this.$refs['base-combobox-list'].$el, this.$refs['base-combobox'])
      },
      hide () {
        this.showList = false
      },
      show (event) {
        this.calculationPositionForList()
        this.showList = true
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography.sass";

.base-combobox {
  position: relative;
  .base-combobox__input {
    z-index: 66;
    .v-input__slot {
      display: block;
      padding: 0 !important;
      position: relative;
      input {
        max-height: 100%;
        margin-left: 7px !important;
        @include body-m-medium;
        &::placeholder {
          @include body-m-medium;
        }
      }
      .v-input__append-inner {
        display: none;
      }
      fieldset {
        transition: all .2s ease-in-out;
      }
      .v-text-field__slot {
        display: inline-block !important;
        max-height: 38px;
        min-width: 220px;
        margin-bottom: 5px;
        input {
          padding: 0;
        }
      }
    }
    &.no-selected {
      .v-input__slot {
        .v-text-field__slot {
          margin-top: 10.4px;
          input {
            margin-left: 11px !important;
          }
        }
      }
    }
  }
  .base-combobox__input.v-input--is-focused {
    .v-input__slot {
      background: $neutral-200;
    }
  }
  .base-combobox__list {
    position: absolute;
    width: 100%;
    border: 1px solid $neutral-400 !important;
    border-radius: 10px;
    z-index: 44 !important;
    background: $neutral-100 !important;
    padding: 3px 4px 8px 20px;
    .list-item {
      min-height: inherit;
      padding: 0;
      margin-bottom: 8px;
      &:before {
        content: none !important;
      }
    }
    .list-item-title {
      flex: none;
      border-radius: 5px;
      padding: 4px 8px;
    }
    .base-combobox__list-scroll {
      padding-top: 20px;
      max-height: 244px;
      overflow-y: scroll;
      &::-webkit-scrollbar-button {
        background-repeat:no-repeat;
        width:6px;
        height:0px
      }
      &::-webkit-scrollbar-track {
        background-color: $neutral-250;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        background-color: $neutral-400;
      }
      &::-webkit-resizer {
        background-repeat:no-repeat;
        width:7px;
        height:0px
      }
      &::-webkit-scrollbar {
        width: 4px;
      }
    }
  }
  &[placement="none"] {
    .base-combobox__input {
      fieldset {
        border-radius: 10px !important;
      }
    }
  }
  &[placement="top"] {
    .base-combobox__input {
      fieldset {
        border-radius: 0px 0px 10px 10px !important;
      }
    }
    .base-combobox__list {
      border-bottom-color: transparent !important;
      border-radius: 10px 10px 0px 0px !important;
    }
  }
  &[placement="bottom"] {
    .base-combobox__input {
      fieldset {
        border-radius: 10px 10px 0px 0px !important;
      }
    }
    .base-combobox__list {
      border-top-color: transparent !important;
      border-radius: 0px 0px 10px 10px !important;
    }
  }
  .base-select__select-items {
    margin-top: -8px;
    margin-left: 0px;
    .base-combobox__select-item {
      margin-left: 4px;
      cursor: pointer;
      margin-bottom: 4px;
      padding: 10px 12px;
      padding-right: 7px;
      border-radius: 8px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      cursor: default;
      p {
        margin-bottom: 0 !important;
        margin-right: 12px;
      }
      .icon-close {
        z-index: 77;
        cursor: pointer;
      }
    }
  }
}
</style>
