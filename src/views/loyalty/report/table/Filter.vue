<template>
  <v-row
    no-gutters
  >
    <v-col>
      <div class="app__filter">
        <!--поле выбора-->
        <div
          class="app__filter-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
        >
          <v-icon
            v-show="emptyFastFilter"
            class="app__filter-block-input-icon-prepend"
          >
            $iconify_search-outlined
          </v-icon>

          <!--операции-->
          <div style="width: 100%;">
            <div
              v-for="(item, i) in fastFilter.pbr"
              :key="`operation${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('pbr', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--валюты-->
            <div
              v-for="(item, i) in fastFilter.bu"
              :key="`unit${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('bu', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--операторы-->
            <div
              v-for="(item, i) in fastFilter.operator"
              :key="`operator${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('operator', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--клиенты-->
            <div
              v-for="(item, i) in fastFilter.client"
              :key="`client${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('client', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--поле ввода-->
            <!--chip быстрый поиск-->
            <div
              v-if="fastFilter.query"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ fastFilter.query }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearFilterQuery()"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>
            <!--поле ввода-->
            <input
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
              @focus="switchShow"
            >
          </div>

          <v-icon
            v-show="!emptyFastFilter"
            class="app__filter-block-input-icon-append"
            @click="clearFastFilter"
          >
            $iconify_chrome-close
          </v-icon>
        </div>

        <!--окно фильтра-->
        <div
          v-show="show"
          class="app__filter-block"
        >
          <div
            class="app__filter-block-input"
          >
            <v-icon
              class="app__filter-block-input-icon-prepend"
            >
              $iconify_search-outlined
            </v-icon>
            <input
              ref="search"
              v-model="filter.query"
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
            >

            <div class="app__spacer" />

            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-close"
              @click="close()"
            >
              $iconify_chrome-close
            </v-icon>
            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-check"
              @click="apply()"
            >
              $iconify_bx-check
            </v-icon>
          </div>
          <div class="app__filter-content">
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Операции
                </div>
                <div
                  v-for="(item, i) in operations"
                  :key="i"
                  :class="getFilterClass('pbr', item)"
                  @click="setFilter('pbr', item)"
                >
                  {{ item.title }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Валюта
                </div>
                <div
                  v-for="(item, i) in units"
                  :key="i"
                  :class="getFilterClass('bu', item)"
                  @click="setFilter('bu', item)"
                >
                  {{ item.name }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Операторы
                </div>
                <div>
                  <v-autocomplete
                    v-model="filter.operator"
                    :items="operators"
                    placeholder="Выберите оператора"
                    item-text="label"
                    item-value="id"
                    outlined
                    multiple
                    chips
                    deletable-chips
                  />
                </div>
              </v-col>
              <v-col>
                <div class="app__filter-content-header">
                  Клиенты
                </div>
                <div>
                  <v-autocomplete
                    v-model="filter.client"
                    :loading="loading"
                    :items="foundClients"
                    :search-input.sync="searchClient"
                    placeholder="Начните вводить имя клиента"
                    item-text="label"
                    item-value="id"
                    outlined
                    multiple
                    chips
                    deletable-chips
                  />
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
    data () {
      return {
        filter: null,
        fastFilter: {},
        show: false,
        searchClient: null,
        loading: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      filterStore () {
        return this.$store.getters['widget/filter/filter']
      },
      filterDefault () {
        return this.$store.getters['widget/filter/filterDefault']
      },
      foundClients () {
        return this.$store.getters['widget/filter/foundClients']
      },
      operators () {
        return this.$store.getters['widget/operators/operators']
      },
      operations () {
        return this.$store.getters['company/bonus_resources/activeBonusResourcesShort']
      },
      units () {
        return this.$store.getters['company/bonus_units/bonusUnits']
      },
      emptyFastFilter () {
        if (this.fastFilter.query ||
          this.fastFilter.pbr.length ||
          this.fastFilter.bu.length ||
          this.fastFilter.operator.length ||
          this.fastFilter.client.length) return false
        return true
      },
    },
    watch: {
      show (v) {
        if (v) {
          this.filter = JSON.parse(JSON.stringify(this.filterStore))
        } else {
          this.filter = Object.assign({}, this.filterDefault)
        }
      },
      searchClient (v) {
        v && v !== this.filter.client && this.querySearchClient(v)
      },
      program (v) {
        // обнуление при смене программы
        this.filter = JSON.parse(JSON.stringify(this.filterDefault))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
      },
    },
    created () {
      this.filter = JSON.parse(JSON.stringify(this.filterDefault))
      this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
      this.setFastFilter(this.filter)
    },
    methods: {
      async switchShow () {
        this.show = !this.show
        await this.$nextTick()
        this.$refs.search.focus()
      },
      getFilterClass (field, item) {
        if (this.filter && this.filter[field].includes(item.id)) return 'app__filter-content-chip app__filter-content-chip-active'
        return 'app__filter-content-chip'
      },
      setFilter (field, item) {
        const index = this.filter[field].indexOf(item.id)
        if (index === -1) {
          this.filter[field].push(item.id)
        } else {
          this.filter[field].splice(index, 1)
          this.clearItemFastFilter(field, item)
        }
      },
      setFastFilter (filter) {
        if (filter && filter.query) this.fastFilter.query = `Быстрый поиск: ${filter.query}`
        filter.pbr.forEach(item => {
          const operation = this.operations.find(objItem => objItem.id === item)
          if (operation) {
            const obj = { id: item, label: `Операция: ${operation.title}` }
            if (!this.fastFilter.pbr.find(objItem => objItem.id === item)) this.fastFilter.pbr.push(obj)
          }
        })
        filter.bu.forEach(item => {
          const unit = this.units.find(objItem => objItem.id === item)
          if (unit) {
            const obj = { id: item, label: `Валюта: ${unit.name}` }
            if (!this.fastFilter.bu.find(objItem => objItem.id === item)) this.fastFilter.bu.push(obj)
          }
        })
        filter.operator.forEach(item => {
          const operator = this.operators.find(objItem => objItem.id === item)
          if (operator) {
            const obj = { id: item, label: `Оператор: ${operator.label}` }
            if (!this.fastFilter.operator.find(objItem => objItem.id === item)) this.fastFilter.operator.push(obj)
          }
        })
        filter.client.forEach(item => {
          const client = this.foundClients.find(objItem => objItem.id === item)
          if (client) {
            const obj = { id: item, label: `Клиент: ${client.label}` }
            if (!this.fastFilter.client.find(objItem => objItem.id === item)) this.fastFilter.client.push(obj)
          }
        })
      },
      clearItemFastFilter (field, item) {
        const i = this.fastFilter[field].findIndex(objItem => objItem.id === item.id)
        if (typeof i !== 'undefined') this.fastFilter[field].splice(i, 1)

        const filter = JSON.parse(JSON.stringify(this.filterStore))
        const j = filter[field].findIndex(objItem => objItem.id === item.id)
        if (typeof j !== 'undefined') filter[field].splice(j, 1)
        this.$store.commit('widget/filter/filter', JSON.parse(JSON.stringify(filter)))
      },
      clearFastFilter () {
        this.filter = JSON.parse(JSON.stringify(this.filterDefault))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
        this.$store.commit('widget/filter/filter', JSON.parse(JSON.stringify(this.filterDefault)))
      },
      async querySearchClient (search) {
        if (search.length >= 3) {
          this.loading = true
          const item = {
            program_id: this.program.id,
            search,
          }
          await this.$store.dispatch('widget/filter/foundClients', item)
          this.loading = false
        }
      },
      clearFilterQuery () {
        this.fastFilter.query = null
        this.filter.query = null
        this.$store.commit('widget/filter/filter', this.filter)
      },
      close () {
        this.show = false
      },
      apply () {
        this.$store.commit('widget/filter/filter', this.filter)
        this.setFastFilter(this.filter)
        this.show = false
      },
    },
  }
</script>

<style lang="scss" scoped>
.app__filter {
  position: relative;

  .app__filter-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #E8E8ED;
    box-sizing: border-box;
    box-shadow: 0px 12px 24px rgba(88, 93, 106, 0.1);
    border-radius: 10px;
    z-index: 1000;

    .app__filter-content {
      padding: 8px 20px;

      .app__filter-content-header {
        margin-bottom: 4px;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: #2A2A34;
      }

      .app__filter-content-chip {
        display: inline-block;
        margin: 8px 8px 0 0;
        padding: 10px 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 17px;
        color: #9191A1;
        background: #F2F2F7;
        border-radius: 8px;
        cursor: pointer;
      }

      .app__filter-content-chip-active {
        background: #EBF1FF;
        color: #4776E6;
      }

      .app__filter-content-checkbox {
        display: inline-block;
        margin-right: 20px;
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        line-height: 21px;
        color: #9191A1;

        input {
          display: inline-block;
          margin-right: 11px;
        }

        div {
          display: inline-block;
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
.app__filter-block-input {
  display: flex;
  align-items: center;
  min-height: 45px;
  color: #9191A1;
  border-bottom: 1px solid #D7D7E0;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .app__filter-block-input-icon-prepend {
    margin: 6px 0 6px 12px;
  }

  .app__filter-block-input-icon-append {
    margin: 6px 12px 6px 0;
  }

  .app__filter-block-input-field {
    display: inline;
    outline: none !important;
    margin: 13px 0;
    padding: 0 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
  }
}

.app__filter-block-icon-close {
  color: #B5B5C4 !important;
  cursor: pointer;
}

.app__filter-block-icon-check {
  width: 30px !important;
  height: 28px !important;
  position: relative;
  top: -1px;
  color: #4776E6 !important;
  cursor: pointer;
}

.app__filter-chip {
  display: inline-flex;
  align-items: center;
  background-color: #EBF1FF;
  border-radius: 6px;
  max-width: 100%;
  margin: 3px;
  padding: 0 6px 0 12px;
  height: 37px;
  white-space: nowrap;

  .app__filter-chip-content {
    align-items: center;
    display: inline-flex;
    height: 100%;
    max-width: 100%;
    color: #4776E6;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 17px;
  }

  .app__filter-chip-icon-append {
    margin: 0 0 0 6px;
    color: #4776E6;
  }
}
</style>
