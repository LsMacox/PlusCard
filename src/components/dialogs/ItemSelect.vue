<template>
  <div class="app__date-select">
    <div class="app__date-select-btn">
      <div
        class="app__date-select-btn-text"
        @click="show = !show"
      >
        {{ getItemName() }}
      </div>
      <div>
        <span
          v-if="!show"
          class="iconify app__date-select-btn-icon"
          data-icon="feather:chevron-down"
          data-inline="false"
        />
        <span
          v-else
          class="iconify app__date-select-btn-icon"
          data-icon="octicon:chevron-up-16"
          data-inline="false"
        />
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
        :style="getStyle(i)"
        @click="selectItem (i)"
      >
        <div class="app__date-select-block-item-text">
          {{ item.name }}
        </div>
        <div
          v-if="activeItem === i"
          style="position: relative;"
        >
          <span
            class="iconify app__date-select-block-item-icon"
            data-icon="bx:bx-check"
            data-inline="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'minWidth',
      'items',
      'item',
    ],
    data () {
      return {
        show: false,
        activeItem: 0,
      }
    },
    created () {
      this.updateItem()
    },
    methods: {
      getItemName () {
        if (this.items[this.activeItem] && this.items[this.activeItem].name) {
          return this.items[this.activeItem].name.toLowerCase()
        }
        return ''
      },
      getItem () {
        return this.items[this.activeItem]
      },
      getStyle (index) {
        if (index === this.activeItem) return 'color: #4776E6; font-weight: 600;'
        return 'color: #9191A1; font-weight: normal;'
      },
      selectItem (index) {
        this.activeItem = index
        this.updateItem()
        this.show = !this.show
      },
      updateItem () {
        this.$emit('update:item', this.getItem())
      },
    },
  }
</script>

<style lang="sass" scoped>
.app__date-select
  position: relative

  .app__date-select-btn
    display: flex
    align-items: center

    .app__date-select-btn-text
      font-weight: 600
      font-size: 17px
      line-height: 22px
      letter-spacing: 0.4px
      color: #4776E6

    .app__date-select-btn-icon
      position: relative
      top: 4px
      font-size: 24px
      color: #4776E6

  .app__date-select-block
    position: absolute
    top: 40px
    left: -20px
    padding: 8px 18px 8px 20px
    background: #FFFFFF
    box-shadow: 0px 5px 20px rgba(88, 93, 106, 0.1)
    border-radius: 12px
    z-index: 1000

    .app__date-select-block-square
      position: absolute
      top: -6px
      left: 57px
      width: 12px
      height: 12px
      background: #FFFFFF
      border-radius: 1px
      transform: rotate(-45deg)
      z-index: 999

    .app__date-select-block-item
      display: flex
      align-items: center
      margin: 12px 0
      font-style: normal
      font-size: 15px
      line-height: 21px
      cursor: pointer

      .app__date-select-block-item-text
        width: calc(100% - 22px)

      .app__date-select-block-item-icon
        position: absolute
        top: -16px
        left: 0
        font-size: 26px

      .app__date-select-block-item-icon-white
        font-size: 22px
        color: #ffffff
</style>
