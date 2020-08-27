<template>
  <v-container>
    <v-row
      no-gutters
    >
      <v-col>
        <div class="app__popover">
          <v-text-field
            outlined
            placeholder="Поиск и фильтр"
            @focus="switchShow"
          >
            <template v-slot:prepend-inner>
              <span
                class="iconify"
                data-icon="ant-design:search-outlined"
                data-inline="false"
              />
            </template>
          </v-text-field>
          <div
            v-show="show"
            class="app__popover-block"
          >
            <v-text-field
              ref="search"
              outlined
              placeholder="Поиск и фильтр"
            >
              <template v-slot:prepend-inner>
                <span
                  class="iconify"
                  data-icon="ant-design:search-outlined"
                  data-inline="false"
                />
              </template>
              <template v-slot:append>
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
              </template>
            </v-text-field>
            <div class="app__popover-content">
              <v-row>
                <v-col>
                  <div class="app__popover-content-header">
                    Операции
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="app__popover-content-header">
                    Валюта
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
  </v-container>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {
        show: false,
      }
    },
    methods: {
      async switchShow () {
        this.show = !this.show
        await this.$nextTick()
        this.$refs.search.focus()
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
      padding: 20px 20px 8px 20px

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

.app__popover-block-icon-close
  color: #B5B5C4 !important
  cursor: pointer

.app__popover-block-icon-check
  width: 42px !important
  height: 28px !important
  position: relative
  top: -4px
  margin-left: 5px
  color: #4776E6 !important
  cursor: pointer
</style>
