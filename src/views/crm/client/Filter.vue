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
          @click.stop="switchShow"
        >
          <v-icon
            v-show="emptyFastFilter"
            class="app__filter-block-input-icon-prepend"
          >
            $iconify_search-outlined
          </v-icon>

          <div style="width: 100%;">
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
                  @click.stop="clearFilterQuery()"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>
            <!--поле ввода-->
            <input
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
            >
          </div>

          <v-icon
            v-show="!emptyFastFilter"
            class="app__filter-block-input-icon-append"
            @click.stop="clearFastFilter"
          >
            $iconify_chrome-close
          </v-icon>
        </div>

        <!--окно фильтра-->
        <div
          v-show="show"
          class="app__filter-block"
          @click.stop=""
        >
          <!--окно фильтра - поле ввода -->
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
              v-model="query"
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
              @input="querySearch(query)"
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
          <!--окно фильтра - содержимое -->
          <div class="app__filter-content">
            <div
              v-for="(item, i) in accountsForFilter"
              :key="i"
            >
              <div>{{ item.name }}</div>
            </div>
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
        query: null,
        filter: {
          query: null,
        },
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
      accountsForFilter () {
        return this.$store.getters['crm/client/accountsForFilter']
      },
      filterStore () {
        return this.$store.getters['crm/client/filter']
      },
      filterDefault () {
        return this.$store.getters['crm/client/filter']
      },
      emptyFastFilter () {
        if (this.query) return false
        return true
      },
    },
    watch: {
      'filter.query' (v) {
        if (v && v.length > 2) this.querySearchClient(v)
      },
      program (v) {
        // обнуление при смене программы
        if (v) {
          this.filter = JSON.parse(JSON.stringify(this.filterStore))
          this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
          this.setFastFilter(this.filter)
        }
      },
    },
    created () {
      this.filter = JSON.parse(JSON.stringify(this.filterStore))
      this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
      // this.setFastFilter(this.filter)

      document.addEventListener('click', () => {
        if (this.show) {
          this.close()
        }
      })
    },
    methods: {
      async switchShow () {
        this.show = true
        this.$store.commit('crm/clients/SET_ACCOUNTS_FOR_FILTER', [])
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
        if (i !== -1) this.fastFilter[field].splice(i, 1)

        const filter = JSON.parse(JSON.stringify(this.filterStore))
        const j = filter[field].findIndex(elem => elem === item.id)
        if (j !== -1) filter[field].splice(j, 1)

        this.$store.commit('widget/filter/filter', JSON.parse(JSON.stringify(filter)))
      },
      clearFastFilter () {
        this.filter = JSON.parse(JSON.stringify(this.filterDefault))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.$store.commit('widget/filter/filter', JSON.parse(JSON.stringify(this.filter)))
      },
      async querySearch (search) {
        console.log(search)
        if (search.length >= 3) {
          try {
            this.loading = true
            const item = {
              program_id: this.program.id,
              search,
            }
            await this.$store.dispatch('crm/client/querySearch', item)
          } finally {
            this.loading = false
          }
        }
      },
      clearFilterQuery () {
        this.fastFilter.query = null
        const filter = JSON.parse(JSON.stringify(this.filterStore))
        filter.query = null
        this.$store.commit('widget/filter/filter', JSON.parse(JSON.stringify(filter)))
      },
      close () {
        this.show = false
      },
      apply () {
        this.$store.commit('widget/filter/filter', this.filter)
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
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
      min-height: 200px;

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
