<template>
  <v-menu
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        class="app__date-select-btn"
        v-on="on"
      >
        <div class="app__date-select-btn-text">
          {{ getItemLabel(model) }}
        </div>
        <div>
          <v-icon
            class="app__date-select-btn-icon"
          >
            {{ attrs['aria-expanded'] === 'true'? '$iconify_si-glyph-triangle-up' : ' $iconify_si-glyph-triangle-down' }}
          </v-icon>
        </div>
      </div>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(item, index) in itemsSelect"
        :key="index"
        @click="selectItem(item)"
      >
        <v-list-item-title
          :class=" {
            'body-s-medium' : true,
            'neutral-600--text':true,
          }"
        >
          {{ item[itemLabel] }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- <div
    v-else
    class="app__date-select"
  >
    <div
      class="app__date-select-btn"
      @click.stop="show = !show"
    >
      <div class="app__date-select-btn-text">
        {{ getItemLabel(model) }}
      </div>
      <div>
        <v-icon
          v-if="!show"
          class="app__date-select-btn-icon"
        >
          $iconify_si-glyph-triangle-down
        </v-icon>
        <v-icon
          v-else
          class="app__date-select-btn-icon"
        >
          $iconify_si-glyph-triangle-down
        </v-icon>
      </div>
    </div>
    <div
      v-show="show"
      class="app__date-select-block"
      :style="`min-width: ${minWidth};`"
    >
      <div class="app__date-select-block-square" />
      <div
        v-for="(item, i) in items"
        :key="i"
        class="app__date-select-block-item"
        :style="getStyle(item)"
        @click="selectItem(item)"
      >
        <div class="app__date-select-block-item-text">
          {{ item[itemLabel] }}
        </div>
        <div
          v-if="isActiveItem(item)"
          style="position: relative;"
        >
          <v-icon>
            $iconify_bx-check
          </v-icon>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
  export default {
    props: [
      'minWidth',
      'items',
      'model',
      'itemValue',
      'itemLabel',
    ],
    data () {
      return {
        show: false,
      }
    },
    computed: {
      itemsSelect () {
        return this.items.filter(x => x[this.itemValue] !== this.model)
      },
    },
    watch: {
      model (v) {
        // console.log('changerole')
        this.$emit('changerole')
      },
    },
    created () {
      // document.addEventListener('click', () => {
      //   if (this.show) {
      //     this.show = !this.show
      //   }
      // })
    },
    methods: {
      getItemLabel (model) {
        if (model) {
          const elem = this.items.find(objItem => objItem[this.itemValue] === model)
          return elem[this.itemLabel]
        }
        if (this.items[0] && this.items[0][this.itemLabel]) return this.items[0][this.itemLabel]
        return 'undefined'
      },
      getStyle (item) {
        if (item[this.itemValue] === this.model) return 'color: #4776E6; font-weight: 600;'
        return 'color: #9191A1; font-weight: normal;'
      },
      isActiveItem (item) {
        if (item[this.itemValue] === this.model) return true
        return false
      },
      selectItem (item) {
        const elem = this.items.find(objItem => objItem[this.itemValue] === item[this.itemValue])
        this.updateItem(elem[this.itemValue])
        this.show = !this.show
      },
      updateItem (v) {
        this.$emit('update:model', v)
      },
    },
  }
</script>

<style lang="scss" scoped>
// .app__date-select {
//   position: relative;

  .app__date-select-btn {
    display: flex;
    align-items: center;
    cursor: pointer;

    .app__date-select-btn-text {
      width: 180px;
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 17px;
      color: #2A2A34;
    }

    .app__date-select-btn-icon {
      position: relative;
      top: 2px;
      width: 12px;
      color: #4776E6;
    }
  }

  .app__date-select-block {
    position: absolute;
    top: 40px;
    left: -20px;
    padding: 8px 18px 8px 20px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px rgba(88, 93, 106, 0.1);
    border-radius: 12px;
    z-index: 1000;

    .app__date-select-block-square {
      position: absolute;
      top: -6px;
      left: 57px;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      border-radius: 1px;
      transform: rotate(-45deg);
      z-index: 999;
    }

    .app__date-select-block-item {
      display: flex;
      align-items: center;
      margin: 12px 0;
      font-style: normal;
      font-size: 15px;
      line-height: 21px;
      cursor: pointer;

      .app__date-select-block-item-text {
        width: calc(100% - 22px);
      }

      .app__date-select-block-item-icon {
        position: absolute;
        top: -16px;
        left: 0;
        font-size: 26px;
      }

      .app__date-select-block-item-icon-white {
        font-size: 22px;
        color: #ffffff;
      }
    }
  }
// }
</style>
