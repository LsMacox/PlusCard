<template>
  <v-row
    no-gutters
  >
    <v-col>
      <div class="app__popover">
        <div
          class="app__popover-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
        >
          <v-icon>
            $iconify_search-outlined
          </v-icon>
          <input
            class="app__popover-block-input-field"
            placeholder="Поиск и фильтр"
            @focus="switchShow"
          >
        </div>
        <div
          v-show="show"
          class="app__popover-block"
        >
          <div
            class="app__popover-block-input"
          >
            <v-icon>
              $iconify_search-outlined
            </v-icon>
            <input
              ref="search"
              class="app__popover-block-input-field"
              placeholder="Поиск и фильтр"
            >
            <v-icon
              class="app__popover-block-icon-close"
              @click="close()"
            >
              $iconify_chrome-close
            </v-icon>
            <v-icon
              class="app__popover-block-icon-check"
              @click="apply()"
            >
              $iconify_bx-check
            </v-icon>
          </div>
          <div class="app__popover-content">
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Операции
                </div>
                <div
                  v-for="(item, i) in operations"
                  :key="i"
                  class="app__popover-content-chip"
                  @click="setFilterOperation(item)"
                >
                  {{ item.title }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Валюта
                </div>
                <div
                  v-for="(item, i) in units"
                  :key="i"
                  class="app__popover-content-checkbox"
                >
                  <input
                    type="checkbox"
                    @click="setFilterUnit(item)"
                  >
                  <div>
                    {{ item.name }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Операторы
                </div>
                <div>
                  <input
                    class="app__popover-content-input"
                    placeholder="Начните вводить имя оператора"
                  >
                </div>
              </v-col>
              <v-col>
                <div class="app__popover-content-header">
                  Клиенты
                </div>
                <div>
                  <input
                    class="app__popover-content-input"
                    placeholder="Начните вводить имя клиента"
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {
        show: false,
        filter: {},
      }
    },
    computed: {
      operations () {
        return this.$store.getters['company/bonus_resources/activeBonusResourcesShort']
      },
      units () {
        return this.$store.getters['company/bonus_units/bonusUnits']
      },
    },
    methods: {
      async switchShow () {
        this.show = !this.show
        await this.$nextTick()
        this.$refs.search.focus()
      },
      setFilterOperation (item) {
        //
      },
      setFilterUnit (item) {
        //
      },
      close () {
        this.show = false
      },
      apply () {
        this.show = false
      },
    },
  }
</script>

<style lang="sass" scoped>
.app__popover
  position: relative

  .app__popover-block
    position: absolute
    top: 0
    left: 0
    width: 100%
    background: #FFFFFF
    border: 1px solid #E8E8ED
    box-sizing: border-box
    box-shadow: 0px 12px 24px rgba(88, 93, 106, 0.1)
    border-radius: 10px
    z-index: 1000

    .app__popover-content
      padding: 8px 20px

      .app__popover-content-header
        margin-bottom: 12px
        font-style: normal
        font-weight: 600
        font-size: 15px
        line-height: 21px
        letter-spacing: 0.1px
        color: #2A2A34

      .app__popover-content-input
        width: 100%
        outline: none !important
        padding: 11px 12px
        font-style: normal
        font-weight: 500
        font-size: 13px
        line-height: 17px
        color: #9191A1
        border: 1px solid #D7D7E0
        box-sizing: border-box
        border-radius: 10px

      .app__popover-content-chip
        display: inline-block
        margin-right: 8px
        padding: 10px 12px
        font-style: normal
        font-weight: 600
        font-size: 13px
        line-height: 17px
        color: #9191A1
        background: #F2F2F7
        border-radius: 8px
        cursor: pointer

      .app__popover-content-checkbox
        display: inline-block
        margin-right: 20px
        font-style: normal
        font-weight: 500
        font-size: 15px
        line-height: 21px
        color: #9191A1

        input
          display: inline-block
          margin-right: 11px

        div
          display: inline-block
          position: relative
          top: -1px

.app__popover-block-input
  display: flex
  align-items: center
  padding: 11px 12px
  color: #9191A1
  border-bottom: 1px solid #D7D7E0
  box-sizing: border-box
  border-top-left-radius: 10px
  border-top-right-radius: 10px

  .app__popover-block-input-field
    display: block
    width: 100%
    outline: none !important
    padding: 0 10px
    font-style: normal
    font-weight: 500
    font-size: 13px
    line-height: 17px

.app__popover-block-icon-close
  color: #B5B5C4 !important
  cursor: pointer

.app__popover-block-icon-check
  width: 42px !important
  height: 28px !important
  position: relative
  top: -1px
  margin-left: 5px
  color: #4776E6 !important
  cursor: pointer
</style>
